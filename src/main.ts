import { DETAILED_ACTION_DICT, ENEMY_LIST, HERO_LIST, INVENTORY_LIST, SIMPLE_ACTION_DICT } from "./data";
import { dismissBtn, getSlotDefenseOverlayById, getSlotEfxOverlayById, slots } from "./dom";
import {
  drawAMagicEffect,
  drawAttackEffect,
  drawBottomPane,
  drawCharacters,
  drawDefenseEffect,
  drawItemEffect,
  drawSelectedCharacterOutline,
  drawTimeline,
  drawTurnCount,
} from "./draw";
import { ActionName, InventoryItemName, InventoryItemType, MagicSpellName, StatusName } from "./enums";
import {
  getCharacterById,
  getAllCharacters,
  shouldSelectTarget,
  setShouldSelectTarget,
  currentActionData,
  allCharacters,
  incrementTurnCount,
  inventory,
  timeline,
  turnCount,
  setTimeline,
} from "./globals";
import { panes } from "./infoPane";
import { StatusTurn, CharacterTurn, Character, InventoryItem, Turn, CurrentActionData, Action, Status } from "./types";
import { calcTurnDuration, calculateNextTurnTime, idMaker, rowDice, wait } from "./utils";

// window.addEventListener("turn-start", onTurnStart);
window.addEventListener("character-action", onCharacterAction);
window.addEventListener("action-selected", onActionSelected);
window.addEventListener("action-detail-selected", onActionDetailSelected);
window.addEventListener("action-target-selected", onActionTargetSelected);

for (const slot of slots) {
  slot.onclick = onSlotClick;
}

function onSlotClick(e: MouseEvent) {
  const el = e.target as HTMLElement;
  const slot = el.closest(".lane-slot")!;
  if (!slot.id) return;

  const targetCharacter = getCharacterById(slot.id);
  // console.log("onSlotClick", { slot, targetCharacter });

  if (shouldSelectTarget) {
    setShouldSelectTarget(false);
    // console.log("Target selected", { slot, targetCharacter });
    currentActionData.actionTarget = targetCharacter;
    window.dispatchEvent(new CustomEvent("action-target-selected"));
  }
}

async function onCharacterAction(e: any) {
  const { characterId } = e.detail;
  const character = getCharacterById(characterId);
  currentActionData.character = character;

  console.log("onCharacterAction", character.name);

  drawBottomPane(panes.text(`${character.name}'s turn`));
  await wait(1000);

  if (character.type === "enemy" || character.type === "npc") {
    //  decideEnemyAction
    return updateTimeline();
  }

  if (character.type === "hero") {
    // draw actions pane
    drawBottomPane(panes.heroActions(character));
  }
}

async function onActionSelected(e: any) {
  const actionName = e.detail;
  console.log("onActionSelected", actionName);

  if (!currentActionData.character) {
    throw Error("no character data inside currentActionData");
  }
  currentActionData.actionName = actionName;
  const isHeroAction = currentActionData.character.type === "hero";

  if (!isHeroAction) {
    // selectActionDetail
    // selectTarget
  }

  if (isHeroAction) {
    const dismissFn = () => {
      console.log("dismiss");
      drawBottomPane(panes.heroActions(currentActionData.character!));
    };

    switch (actionName) {
      case ActionName.Attack:
      case ActionName.Magic:
      case ActionName.Invoke:
      case ActionName.Summon:
        drawBottomPane(panes.heroActionDetail(currentActionData.character, actionName), dismissFn);
        break;
      case ActionName.Item:
        drawBottomPane(panes.itemSelection(inventory), dismissFn);
        break;
      case ActionName.Defend:
        currentActionData.actionTarget = currentActionData.character;
        onActionTargetSelected();
        break;
      case ActionName.Steal:
        setShouldSelectTarget(true);
        break;
      default:
        break;
    }
  }
}

function onActionDetailSelected(e: any) {
  const detail = e.detail;

  currentActionData.actionDetail = detail;
  setShouldSelectTarget(true);

  // console.log("onActionDetailSelected", { detail, currentActionData });
  drawBottomPane(panes.text("select target"));
}

function createNewAction(actionName: ActionName, actionDetail: string | null) {
  let action: Action | null = null;

  if (actionDetail) {
    action = DETAILED_ACTION_DICT[actionName]![actionDetail];
  } else {
    action = SIMPLE_ACTION_DICT[actionName]!;
  }

  console.log(":::createNewAction", action, actionName, actionDetail);
  return action;
}

async function onActionTargetSelected() {
  const actionData = {
    actorId: currentActionData.character!.id,
    targetId: currentActionData.actionTarget!.id,
    action: createNewAction(currentActionData.actionName!, currentActionData.actionDetail || null) as Action,
  };

  // RESET CURRENT ACTION DATA
  currentActionData.character = null;
  currentActionData.actionDetail = null;
  currentActionData.actionName = null;
  currentActionData.actionTarget = null;

  console.log("onActionTargetSelected", actionData);

  await processAction(actionData);
}

async function drawActionPane(action: Action, actor: Character, target: Character) {
  console.log("ACTION PANE", action.name, action);
  if (action.type === "physical") {
    drawBottomPane({ type: "text", content: `${actor.name} attacks ${target.name}` });
  }
  if (action.type === "magical") {
    drawBottomPane({ type: "text", content: `${actor.name} casts ${action.name} on ${target.name}` });
  }
  if (action.type === "item") {
    drawBottomPane({ type: "text", content: `${target.name} received ${action.name}` });
  }
  if (action.type === "other") {
    switch (action.name) {
      case ActionName.Defend:
        drawBottomPane(panes.text(`${actor.name} raised its defenses`));
        break;
      case ActionName.Steal:
        drawBottomPane({ type: "text", content: `stealing from ${target.name}` });
        break;
      case ActionName.Summon:
        drawBottomPane({ type: "text", content: `${actor.name} summoned ${action.name}` });
        break;
      case ActionName.Invoke:
        drawBottomPane({ type: "text", content: `${actor.name} invoked ${action.name}` });
        break;
      case ActionName.Move:
        drawBottomPane({ type: "text", content: `${target.name} is on the move` });
        break;
      case ActionName.Hide:
        drawBottomPane({ type: "text", content: `${target.name} is hidden` });
        break;
      default:
        break;
    }
  }

  await wait(1000);
}

async function processAction(actionData: { actorId: string; targetId: string; action: Action }) {
  const { action, actorId, targetId } = actionData;
  const actor = getCharacterById(actorId);
  const target = getCharacterById(targetId);

  console.log("PROCESSING ACTION!!!", { actionData, action, actor, target });

  await computeEntityChanges(action, actor, target);

  await drawActionPane(action, actor, target);

  await handleActionEfx(action, actor, target);

  drawCharacters(); // to reflect the updated hp values, statuses etc

  await updateTimeline();
}
function subtractFromInventory(itemName: InventoryItemName) {
  const itemIdx = inventory.findIndex((obj) => obj.name === itemName)!;
  const inventoryItem = inventory[itemIdx];

  if (inventoryItem?.quantity === 1) {
    inventory.splice(itemIdx, 1);
  } else {
    inventoryItem.quantity--;
  }

  console.log("inventory", inventory);
}

function addInventoryItem(itemName: InventoryItemName) {
  const itemIdx = inventory.findIndex((obj) => obj.name === itemName)!;
  const inventoryItem = inventory[itemIdx];

  if (inventoryItem?.quantity > -1) {
    inventoryItem.quantity++;
    // inventory.splice(itemIdx, 1);
  } else {
    const newInventoryItem = INVENTORY_LIST.find((item) => item.name === itemName)!;
    inventory.push({ ...newInventoryItem });
  }
}

async function handleActionEfx(action: Action, actor: Character, target: Character) {
  switch (action.type) {
    case "physical":
      await drawAttackEffect(actor, target, action);
      break;
    case "item":
      await drawItemEffect(actor, target);
      break;
    case "magical":
      await drawAMagicEffect(actor, target, action);
      break;
    case "other":
      if (action.name === ActionName.Defend) {
        actor.statuses.push({
          name: StatusName.Defense,
          turnCount: 1,
          turnsPlayed: 0,
        });
        await drawDefenseEffect(actor);
      }
      if (action.name === ActionName.Steal) {
        const itemName = performStealAttempt(actor, target);
        if (itemName) {
          addInventoryItem(itemName);
          drawBottomPane({ type: "text", content: `stolen ${itemName} from ${target.name}` });
        } else {
          drawBottomPane({ type: "text", content: `failed to steal` });
        }
        await wait(1000);
      }
      break;
  }

  await wait(1000);
}

async function computeEntityChanges(action: Action, actor: Character, target: Character) {
  console.log("COMPUTE ENTITY CHANGES", { action, actor, target });

  if (action.type === "physical") {
    let attackPower = 0;

    if (action.ranged) {
      attackPower -= action.power; // + dexterity
    } else {
      attackPower -= action.power; // + strength
    }

    if (getDefenseStatusIdx(target.statuses) > -1) {
      attackPower /= 2;
    }
    target.hp -= attackPower;
  }

  if (action.type === "magical") {
    actor.mp -= action.mpCost;

    if (action.effects?.length) {
      for (const effect of action.effects) {
        target.statuses.push(effect);
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

  if (action.type === "other") {
    if (action.name === ActionName.Defend) {
      actor.statuses.push({
        name: StatusName.Defense,
        turnCount: 1,
        turnsPlayed: 0,
      });
    }

    // if (action.name === ActionName.Steal) {

    // }
  }
}

function performStealAttempt(actor: Character, target: Character) {
  const result = rowDice(20);

  if (result <= 10) return null;
  else if (result > 10 && result <= 14) return INVENTORY_LIST[0].name;
  else if (result > 14 && result <= 17) return INVENTORY_LIST[1].name;
  else return INVENTORY_LIST[2].name;
}

function getDefenseStatusIdx(statusList: Status[]) {
  const defenseStatusIdx = statusList.findIndex((s) => s.name === StatusName.Defense);
  return defenseStatusIdx;
}

async function startTurn(turn: Turn) {
  const character = getCharacterById(turn.entity.id);
  console.log("startTurn", character.name);

  await drawSelectedCharacterOutline(character);

  if (turn.type === "status") {
  } else {
    if (turn.entity.type === "hero") {
      const character = getCharacterById(turn.entity.id);
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

async function updateTimeline() {
  // console.log("updateTimeline");
  incrementTurnCount();
  drawTurnCount(turnCount);
  drawTimeline();

  // drawTurnCount(turnCount);

  // 1. dequeue first turn
  const prevTimeline = timeline.slice();
  const currentTurn = timeline.shift()!;

  // @TODO: 2. check if turn must be removed HERE! if so, remove it!
  // const turnRemoved = await shouldRemoveTurn()

  // if (turnRemoved) return startTurn(currentTurn);
  // else

  // update turn
  const nextTurn: Turn = {
    ...currentTurn,
    nextTurnAt: calculateNextTurnTime(currentTurn),
    turnsPlayed: currentTurn.turnsPlayed + 1,
  };

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

async function initializeTimeline() {
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

async function main() {
  drawCharacters();
  await initializeTimeline();
  await wait(1000);
  await updateTimeline();
}

main();

// // startTurn -> updateTimeline -> startTurn -> updateTimeline -> etc....

// export { getTimeline, getCharacterById };

// Marcos vê Fred e Raquel
// Raquel sai
// Fred arruma treta com Marcos
// Marcos volta pro hotel e pede whisky

// Expedito confessa o q fez pra Lorena
// Lorena briga e manda Expedito se calar q ela vai descansar e pensar
// Expedito sai pra espairecer e encontra Marina
// Ela convida ele pro estúdio
// Lorena acorda e vai tirar satisfação com Marina
// Chegando no estúdio, vê Expedito lá
// Lorena manda real e sai
// Expedito e Marina transam
// Lorena tem momento música reflexiva

//

// Paulinha sacaneia durante encontro da galera na casa do Cesar
// Rodrigo manda real na Paulinha

// Fernanda manda chamar salete, ela sabe q vai morrer...
