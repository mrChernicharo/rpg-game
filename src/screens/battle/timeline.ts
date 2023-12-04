import { getSlotElementById, getSlotDefenseOverlayById } from "../../shared/dom";
import { StatusName, MagicSpellName, InventoryItemName, ActionName } from "../../shared/enums";
import { Action, Status, Character, StatusTurn, Turn, CharacterTurn, CharacterTurnEntity } from "../../shared/types";
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
  drawtotalTurnCount,
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
  incrementtotalTurnCount,
  totalTurnCount,
  allCharacters,
  setTimeline,
  getTimeline,
} from "./globals";
import { panes } from "./infoPane";

export async function processAction(actionData: { actorId: string; targetId: string; action: Action }) {
  const { action, actorId, targetId } = actionData;
  const actor = getCharacterById(actorId);
  const target = getCharacterById(targetId);

  // console.log("PROCESSING ACTION!!!", {
  //   actionData,
  //   action: { ...action },
  //   actor: { ...actor },
  //   target: { ...target },
  // });

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

    if (action.name === "attack") {
      if (action.type === "ranged") {
        attackPower = 100; // + dexterity
      } else if (action.type === "melee") {
        attackPower = 100; // + strength
      }
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
        target.hp += 100;
        break;
      case InventoryItemName.Ether:
        target.mp += 50;
        break;
      case InventoryItemName.PhoenixDown:
        if (target.hp <= 0) {
          target.hp = 70;
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
  }
  if (actor.mp < 0) {
    actor.mp = 0;
  }
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
    totalTurnCount: status.totalTurnCount,
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

  // console.log("UPDATING EXISTING STATUS before", JSON.stringify({ ...target.statuses }, null, 2));
  // status: getCharacterStatusIdxByName(target.id, statusName),

  // simply keep the previous status. update its turnPlayed count, and update character.status to match it
  if (existingStatusTurnIdx > -1 && existingCharacterStatusIdx > -1) {
    timeline[existingStatusTurnIdx].turnsPlayed = 0;
    target.statuses[existingCharacterStatusIdx].turnsPlayed = 0;
    // console.log("UPDATING EXISTING STATUS after", JSON.stringify({ ...target.statuses }, null, 2));
  }
}

async function handleActionEfx(action: Action, actor: Character, target: Character) {
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
          totalTurnCount: 1,
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
  const isTargetAlive = target.hp > 0;
  const isTargetPoisoned = target.statuses.some((s) => s.name === StatusName.Poison);

  if (isTargetAlive && isTargetPoisoned && !slot.classList.contains("poisoned")) {
    slot.classList.add("poisoned");
  }
  if (!isTargetAlive || (slot.classList.contains("poisoned") && !isTargetPoisoned)) {
    slot.classList.remove("poisoned");
  }

  const actionPow = (action as any)?.power;
  if (actionPow) {
    if ([MagicSpellName.Cure, MagicSpellName.Regen].includes((action as any).name)) {
      drawNumber(target.id, actionPow, "lightgreen");
    } else {
      drawNumber(target.id, actionPow);
    }
  } else {
    drawNumber(target.id, 100);
  }
}

async function startTurn(turn: Turn) {
  if (turn.type === "status") {
    const character = getCharacterById(turn.characterId);
    // console.log("start Status Turn", character.name, { inventory });

    currentTurnInfo.isStatusAction = true;
    currentTurnInfo.actionName = ActionName.Status;
    currentTurnInfo.actionDetail = turn.entity.name;
    currentTurnInfo.actionTarget = character;
    currentTurnInfo.character = character;

    onActionTargetSelected();
  } else {
    const character = getCharacterById(turn.entity.id);

    await drawSelectedCharacterOutline(character);
    // console.log(`start ${turn.type} Turn`, character.name);

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
  incrementtotalTurnCount();
  drawtotalTurnCount(totalTurnCount);

  timeline.sort((a, b) => a.nextTurnAt - b.nextTurnAt);

  drawTimeline();

  console.log([...timeline]);

  const currentTurn = timeline[0];
  currentTurn.turnsPlayed++;

  await startTurn(currentTurn);

  currentTurn.nextTurnAt = calculateNextTurnTime(currentTurn);

  if (currentTurn.type === "status" && currentTurn.turnsPlayed >= currentTurn.totalTurnCount) {
    handleTimelineStatusRemoval(currentTurn);
  }
  updateDead();

  timeline.sort((a, b) => a.nextTurnAt - b.nextTurnAt);
}

function updateDead() {
  const highestNextMove = Math.max(...timeline.map((t) => t.nextTurnAt));

  const statusRemoveIdxs: number[] = [];
  timeline.forEach((turn, i) => {
    const isDead = turn.type === "character" && getCharacterById(turn.entity.id).hp <= 0;

    if (isDead) {
      // update dead characters nextTurnAt so they are all at the end of the line
      turn.nextTurnAt = highestNextMove + 0.1 * i;

      getCharacterById(turn.entity.id).statuses = [];

      for (let i = 0; i < timeline.length; i++) {
        const t = timeline[i];
        if (t.type === "status" && t.characterId === turn.entity.id) {
          // get dead chararcter's related statuses indices
          statusRemoveIdxs.push(i);
        }
      }
    }
  });

  // remove dead chararcter's related statuses
  for (const idx of statusRemoveIdxs) {
    timeline.splice(idx, 1);
  }
}

function handleTimelineStatusRemoval(turn: StatusTurn) {
  console.log("REMOVE STATUS!!!!!!");

  const characterStatusIdx = getCharacterStatusIdxByName(turn.characterId, turn.entity.name as StatusName);
  const character = getCharacterById(turn.characterId);

  character.statuses.splice(characterStatusIdx, 1);
  timeline.shift();
}

export async function initializeTimeline() {
  const initialCharacterTurns: CharacterTurn[] = allCharacters.map((c) => ({
    type: "character",
    entity: { id: c.id, name: c.name, type: getCharacterById(c.id)!.type, isDead: false },
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
