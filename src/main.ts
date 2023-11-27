import {
  DETAILED_ACTION_DICT,
  ENEMY_LIST,
  HERO_LIST,
  SIMPLE_ACTION_DICT,
} from "./data";
import {
  dismissBtn,
  getSlotDefenseOverlayById,
  getSlotEfxOverlayById,
  slots,
} from "./dom";
import {
  drawBottomPane,
  drawCharacters,
  drawDefenseEffect,
  drawSelectedCharacterOutline,
  drawTimeline,
} from "./draw";
import {
  ActionName,
  InventoryItemName,
  InventoryItemType,
  MagicSpellName,
  StatusName,
} from "./enums";
import { panes } from "./infoPane";
import {
  StatusTurn,
  CharacterTurn,
  Character,
  InventoryItem,
  Turn,
  CurrentActionData,
  Action,
  Status,
} from "./types";
import {
  calcTurnDuration,
  calculateNextTurnTime,
  idMaker,
  wait,
} from "./utils";

let turnCount = 0;
let allCharacters: Character[] = [...ENEMY_LIST, ...HERO_LIST] as Character[];
let timeline: Turn[] = [];
let inventory: InventoryItem[] = [
  {
    id: idMaker(),
    name: InventoryItemName.Potion,
    type: InventoryItemType.Consumable,
    quantity: 3,
  },
  {
    id: idMaker(),
    name: InventoryItemName.Ether,
    type: InventoryItemType.Consumable,
    quantity: 2,
  },
  {
    id: idMaker(),
    name: InventoryItemName.PhoenixDown,
    type: InventoryItemType.Consumable,
    quantity: 4,
  },
  {
    id: idMaker(),
    name: InventoryItemName.ShortSword,
    type: InventoryItemType.Equipment,
    quantity: 1,
  },
];
let currentActionData: CurrentActionData = {
  character: null,
  actionDetail: null,
  actionName: null,
  actionTarget: null,
};
let shouldSelectTarget = false;

export function getTimeline() {
  return timeline;
}
export function getAllCharacters() {
  return allCharacters;
}
function incrementTurnCount() {
  turnCount++;
}
export function getCharacterById(id: string): Character {
  return getAllCharacters().find((c) => c.id === id)!;
}
export function getAllHeroes() {
  const allHeroes = [];
  for (const char of allCharacters) {
    if (char.type === "hero") {
      allHeroes.push(char);
    }
  }
  return allHeroes;
}
export function getAllEnemies() {
  const allEnemies = [];
  for (const char of allCharacters) {
    if (char.type === "enemy") {
      allEnemies.push(char);
    }
  }
  return allEnemies;
}

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
    shouldSelectTarget = false;
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
        drawBottomPane(
          panes.heroActionDetail(currentActionData.character, actionName),
          dismissFn
        );
        break;
      case ActionName.Item:
        drawBottomPane(panes.itemSelection(inventory), dismissFn);
        break;
      case ActionName.Defend:
        currentActionData.actionTarget = currentActionData.character;
        onActionTargetSelected();
        break;
      case ActionName.Steal:
        shouldSelectTarget = true;
        drawBottomPane(panes.text("select target to steal"));
        break;
      default:
        break;
    }
  }
}

function onActionDetailSelected(e: any) {
  const detail = e.detail;

  currentActionData.actionDetail = detail;
  shouldSelectTarget = true;

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
    action: createNewAction(
      currentActionData.actionName!,
      currentActionData.actionDetail || null
    ) as Action,
  };

  // RESET CURRENT ACTION DATA
  currentActionData.character = null;
  currentActionData.actionDetail = null;
  currentActionData.actionName = null;
  currentActionData.actionTarget = null;

  console.log("onActionTargetSelected", actionData);

  await processAction(actionData);
}

async function processAction(actionData: {
  actorId: string;
  targetId: string;
  action: Action;
}) {
  const { action, actorId, targetId } = actionData;
  const actor = getCharacterById(actorId);
  const target = getCharacterById(targetId);

  console.log("PROCESSING ACTION!!!", { actionData, action, actor, target });

  await wait(1000);

  await computeCharacterChanges(action, actor, target);

  // await drawEfx()

  await wait(1000);
  drawCharacters(); // to reflect the updated hp values, statuses etc

  await updateTimeline();
}

async function computeCharacterChanges(
  action: Action,
  actor: Character,
  target: Character
) {
  console.log("COMPUTE CHARACTER CHANGES", { action, actor, target });

  if (action.type === "physical") {
    if (action.ranged) {
      target.hp -= action.power; // + dexterity
    } else {
      target.hp -= action.power; // + strength
    }
  }
  //
  if (action.type === "magical") {
    actor.mp -= action.mpCost;

    if (action.power) {
      if (
        [
          MagicSpellName.Cure,
          MagicSpellName.Regen,
          MagicSpellName.Protect,
        ].includes(action.name as MagicSpellName)
      ) {
        target.hp += action.power;
      } else {
        target.hp -= action.power;
      }
    }
  }
  //
  if (action.type === "item") {
  }
  //
  if (action.type === "other") {
    switch (action.name) {
      case ActionName.Defend:
        drawBottomPane(panes.text(`${actor.name} raised its defenses`));

        actor.statuses.push({
          name: StatusName.Defense,
          turnCount: 1,
          turnsPlayed: 0,
        });
        console.log("HANDLE DEFEND!", actor.name, {
          actor,
          all: getAllCharacters(),
        });

        await drawDefenseEffect(actor);
        break;
      default:
        break;
    }
  }
}

function getDefenseStatusIdxByName(statusList: Status[]) {
  const defenseStatusIdx = statusList.findIndex(
    (s) => s.name === StatusName.Defense
  );
  return defenseStatusIdx;
}

async function startTurn(turn: Turn) {
  const character = getCharacterById(turn.entity.id);
  await drawSelectedCharacterOutline(character);
  console.log("startTurn", character.name, {
    turn,
    character: { ...character },
  });

  if (turn.type !== "status") {
    if (turn.entity.type === "hero") {
      const character = getCharacterById(turn.entity.id);
      const removeIdx = getDefenseStatusIdxByName(character.statuses);

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
  drawTimeline();

  // drawTurnCount(turnCount);

  // 1. dequeue first turn
  const prevTimeline = timeline.slice();
  const currentTurn = timeline.shift()!;

  // @TODO: 2. check if turn must be removed HERE! if so, remove it!
  // const turnRemoved = await shouldRemoveTurn()

  // if (turnRemoved)
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

  timeline = [...initialCharacterTurns].sort(
    (a, b) => a.nextTurnAt - b.nextTurnAt
  );

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
