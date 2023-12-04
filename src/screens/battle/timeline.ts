import { getSlotElementById, getSlotDefenseOverlayById } from "../../shared/dom";
import { StatusName, MagicSpellName, InventoryItemName, ActionName } from "../../shared/enums";
import { Action, Status, Character, StatusTurn, Turn, CharacterTurn } from "../../shared/types";
import { idMaker, calcTurnDuration, wait, calculateNextTurnTime } from "../../shared/utils";
import {
  drawActionPane,
  drawCharacters,
  drawAttackEffect,
  drawItemEffect,
  drawAMagicEffect,
  drawStatusEffect,
  drawStealEffect,
  drawBottomPane,
  drawDefenseEffect,
  drawNumber,
  drawSelectedCharacterOutline,
  drawTurnCount,
  drawTimeline,
} from "./draw";
import { createNewStatus, onActionTargetSelected } from "./events";
import {
  getCharacterById,
  timeline,
  getCharacterStatusIdxByName,
  getDefenseStatusIdx,
  subtractFromInventory,
  performStealAttempt,
  addInventoryItem,
  inventory,
  currentTurnInfo,
  incrementTurnCount,
  turnCount,
  allCharacters,
  setTimeline,
  getTimeline,
} from "./globals";
import { panes } from "./infoPane";

export async function processAction(actionData: { actorId: string; targetId: string; action: Action }) {
  const { action, actorId, targetId } = actionData;
  const actor = getCharacterById(actorId);
  const target = getCharacterById(targetId);

  console.log("PROCESSING ACTION!!!", {
    actionData,
    action: { ...action },
    actor: { ...actor },
    target: { ...target },
  });

  await computeEntityChanges(action, actor, target);

  await drawActionPane(action, actor, target);

  await handleActionEfx(action, actor, target);

  drawCharacters(); // to reflect the updated hp values, statuses etc

  await updateTimeline();
}

async function computeEntityChanges(action: Action, actor: Character, target: Character) {
  // console.log("COMPUTE ENTITY CHANGES", {
  //   action: { ...action },
  //   actor: { ...actor },
  //   target: { ...target },
  //   targetStatuses: { ...target.statuses },
  //   // targetStatuses: target.statuses[getCharacterStatusIdxByName(target.id, StatusName.Poison)],
  // });

  if (["melee", "ranged"].includes(action.type)) {
    let attackPower = 0;

    if (action.name === ActionName.MeleeAttack) {
      attackPower = 100; // + strength
    } else if (action.name === ActionName.RangedAttack) {
      attackPower = 100; // + dexterity
    } else {
      let attackPower = (action as any).power;

      if (getDefenseStatusIdx(target.statuses) > -1) {
        attackPower *= 0.5;
      }
    }
    target.hp -= attackPower;
  }

  if (action.type === "magical") {
    actor.mp -= action.mpCost;

    if (action.effects?.length) {
      for (const statusName of action.effects) {
        if (target.statuses.some((s) => s.name === statusName)) {
          // console.log("UPDATE EXISTING STATUS");
          updateStatusTurn(statusName, target);
        } else {
          const newStatus = createNewStatus(statusName);
          target.statuses.push(newStatus);
          // console.log("ADD STATUS TURN", newStatus);
          insertStatusTurn(newStatus, target);
        }
      }
    }

    if (action.power) {
      if ([MagicSpellName.Cure, MagicSpellName.Regen, MagicSpellName.Protect].includes(action.name as MagicSpellName)) {
        target.hp += action.power;
      } else {
        target.hp -= action.power;
      }
    }
  }

  if (action.type === "item") {
    subtractFromInventory(action.name);

    switch (action.name) {
      case InventoryItemName.Potion:
        if (target.hp > 0) {
          target.hp += 100;
          if (target.hp > target.maxHp) target.hp = target.maxHp;
        }
        break;
      case InventoryItemName.Ether:
        if (target.hp > 0) {
          target.mp += 50;
          if (target.mp > target.maxMp) target.mp = target.maxMp;
        }
        break;
      case InventoryItemName.PhoenixDown:
        if (target.hp <= 0) {
          resurrectTarget(target);
        }
        break;
    }
  }

  if (action.type === "status") {
    if (action.name === StatusName.Poison) {
      target.hp -= action.power!;
    }
    if (action.name === StatusName.Regen) {
      target.hp += action.power!;
    }
  }

  if (target.hp < 0) {
    target.hp = 0;
    removeDeadTargetFromTimeline(target);
  }
  if (actor.mp < 0) {
    actor.mp = 0;
  }
}

function resurrectTarget(target: Character) {
  target.hp = 70;

  const turnDuration = calcTurnDuration(target.speed);
  const ressurectedCharTurn: CharacterTurn = {
    type: "character",
    entity: { id: target.id, name: target.name, type: target.type },
    turnsPlayed: 0,
    turnDuration,
    nextTurnAt: timeline[0].nextTurnAt + turnDuration,
  };
  setTimeline([...getTimeline(), ressurectedCharTurn]);
}

function removeDeadTargetFromTimeline(target: Character) {
  target.statuses = [];

  const noDeadCharOrStatusTimeline = timeline.filter((turn) => {
    if (turn.type === "status") {
      return turn.characterId !== target.id;
    }
    // type character
    else {
      return turn.entity.id !== target.id;
    }
  });

  setTimeline(noDeadCharOrStatusTimeline);
}

function insertStatusTurn(status: Status, target: Character) {
  // console.log(":::insert status into timeline", { status, target, timeline: timeline.slice() });

  const nowTick = timeline[0].nextTurnAt;
  // const statusRef = STATUS_DICT[status.name as StatusName]

  const statusTurn: StatusTurn = {
    type: "status",
    characterId: target.id,
    entity: { id: idMaker(), name: status.name, type: "status" },
    turnDuration: calcTurnDuration(status.speed!),
    nextTurnAt: nowTick + calcTurnDuration(status.speed!),
    turnsPlayed: 0,
    turnCount: status.turnCount,
  };

  let insertionIdx = timeline.length;
  let smallestPositiveTimeDiff = Infinity;

  for (let i = 0; i < timeline.length; i++) {
    const timeDiff = timeline[i].nextTurnAt - statusTurn.nextTurnAt;

    if (timeDiff > 0 && timeDiff < smallestPositiveTimeDiff) {
      smallestPositiveTimeDiff = timeDiff;
      insertionIdx = i;
    }
  }
  timeline.splice(insertionIdx, 0, statusTurn);
}

function updateStatusTurn(statusName: StatusName, target: Character) {
  const existingStatusTurnIdx = timeline.findIndex((turn) => turn.type === "status" && turn.characterId === target.id);
  const existingCharacterStatusIdx = getCharacterStatusIdxByName(target.id, statusName);

  console.log("UPDATING EXISTING STATUS before", JSON.stringify({ ...target.statuses }, null, 2));
  // status: getCharacterStatusIdxByName(target.id, statusName),

  // simply keep the previous status. update its turnPlayed count, and update character.status to match it
  if (existingStatusTurnIdx > -1 && existingCharacterStatusIdx > -1) {
    timeline[existingStatusTurnIdx].turnsPlayed = 0;
    target.statuses[existingCharacterStatusIdx].turnsPlayed = 0;
    console.log("UPDATING EXISTING STATUS after", JSON.stringify({ ...target.statuses }, null, 2));
  }
}

async function handleActionEfx(action: Action, actor: Character, target: Character) {
  console.log("handleActionEfx", action);
  switch (action.type) {
    case "melee":
    case "ranged":
      await drawAttackEffect(actor, target, action);
      break;
    case "item":
      await drawItemEffect(actor, target);
      break;
    case "magical":
      await drawAMagicEffect(actor, target, action);
      break;
    case "status":
      await drawStatusEffect(action.name, target.id);
      break;
    case "steal":
      await drawStealEffect(actor, target, action);
      const itemName = performStealAttempt(actor, target);
      if (itemName) {
        addInventoryItem(itemName);
        drawBottomPane({ type: "text", content: `stolen ${itemName} from ${target.name}!` });
      } else {
        drawBottomPane({ type: "text", content: `failed to steal` });
      }
      await wait(1000);
      break;
    case "defend":
      if (action.name === ActionName.Defend) {
        actor.statuses.push({
          name: StatusName.Defense,
          turnCount: 1,
          turnsPlayed: 0,
        });
        await drawDefenseEffect(actor);
        drawBottomPane(panes.text(`${actor.name} raised its defenses`));
        await wait(800);
      }
      break;
    default:
      break;
  }

  const slot = getSlotElementById(target.id);
  const isPoisoned = target.statuses.some((s) => s.name === StatusName.Poison);

  if (isPoisoned && !slot.classList.contains("poisoned")) {
    slot.classList.add("poisoned");
  }

  if (slot.classList.contains("poisoned") && !isPoisoned) {
    slot.classList.remove("poisoned");
  }

  const actionPow = (action as any)?.power;
  if (actionPow) {
    if ([MagicSpellName.Cure, MagicSpellName.Regen].includes((action as any).name)) {
      drawNumber(target.id, actionPow, "lightgreen");
    } else {
      drawNumber(target.id, actionPow);
    }
  }
}

async function startTurn(turn: Turn) {
  if (turn.type === "status") {
    const character = getCharacterById(turn.characterId);
    console.log("start Status Turn", character.name, { inventory });

    currentTurnInfo.isStatusAction = true;
    currentTurnInfo.actionName = ActionName.Status;
    currentTurnInfo.actionDetail = turn.entity.name;
    currentTurnInfo.actionTarget = character;
    currentTurnInfo.character = character;

    onActionTargetSelected();
  } else {
    const character = getCharacterById(turn.entity.id);
    await drawSelectedCharacterOutline(character);
    console.log(`start ${turn.type} Turn`, character.name);

    if (turn.entity.type === "hero") {
      const removeIdx = getDefenseStatusIdx(character.statuses);

      if (removeIdx > -1) {
        const slotOverlay = getSlotDefenseOverlayById(character.id)!;
        slotOverlay.classList.remove("defending");

        character.statuses.splice(removeIdx, 1);
        console.log("REMOVED DEFENSE STATUS", character.name, { ...character });
      }
    }

    window.dispatchEvent(
      new CustomEvent("character-action", {
        detail: {
          characterId: turn.entity.id,
        },
      })
    );
  }
}

export async function updateTimeline() {
  // console.log("updateTimeline");
  incrementTurnCount();
  drawTurnCount(turnCount);
  drawTimeline();

  // 1. dequeue first turn
  const prevTimeline = timeline.slice();
  const currentTurn = timeline.shift()!;

  // @TODO: 2. check if turn must be removed HERE! if so, remove it!
  // const turnRemoved = await shouldRemoveTurn()

  // update turn
  const nextTurn: Turn = {
    ...currentTurn,
    nextTurnAt: calculateNextTurnTime(currentTurn),
    turnsPlayed: currentTurn.turnsPlayed + 1,
  };

  if (currentTurn.type === "status") {
    const character = getCharacterById(currentTurn.characterId);
    const characterStatusIdx = getCharacterStatusIdxByName(
      currentTurn.characterId,
      currentTurn.entity.name as StatusName
    );

    if (characterStatusIdx > -1) {
      character.statuses[characterStatusIdx].turnsPlayed++;
    }

    const shouldRemoveTurn = nextTurn.turnsPlayed >= (nextTurn as StatusTurn).turnCount;
    if (shouldRemoveTurn) {
      character.statuses.splice(characterStatusIdx, 1);
      return startTurn(currentTurn);
    }
  }

  let insertionIdx = timeline.length;
  let smallestPositiveTimeDiff = Infinity;

  for (let i = 0; i < timeline.length; i++) {
    const timeDiff = timeline[i].nextTurnAt - nextTurn.nextTurnAt;

    if (timeDiff > 0 && timeDiff < smallestPositiveTimeDiff) {
      smallestPositiveTimeDiff = timeDiff;
      insertionIdx = i;
    }
  }

  // reinsert turn
  timeline.splice(insertionIdx, 0, nextTurn);

  // console.log(
  //   "\n prevTimeline \n",
  //   prevTimeline,
  //   "\n timeline \n",
  //   timeline.slice()
  // );

  startTurn(currentTurn);
}

export async function initializeTimeline() {
  const initialCharacterTurns: CharacterTurn[] = allCharacters.map((c) => ({
    type: "character",
    entity: { id: c.id, name: c.name, type: getCharacterById(c.id)!.type },
    turnDuration: calcTurnDuration(c.speed),
    nextTurnAt: calcTurnDuration(c.speed),
    turnsPlayed: 0,
  }));

  // @TODO: handle statuses that might eventually exist at the beginning of the battle

  setTimeline([...initialCharacterTurns].sort((a, b) => a.nextTurnAt - b.nextTurnAt));

  drawTimeline();

  console.log({
    allCharacters: allCharacters.slice(),
    timeline: timeline.slice(),
  });
}
