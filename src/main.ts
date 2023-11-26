import { ENEMY_LIST, HERO_LIST } from "./data";
import { dismissBtn } from "./dom";
import { drawBottomPane, drawTimeline } from "./draw";
import { ActionName, InventoryItemName, InventoryItemType } from "./enums";
import { panes } from "./infoPane";
import {
  StatusTurn,
  CharacterTurn,
  Character,
  InventoryItem,
  Turn,
  CurrentActionData,
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
export function getCharacterById(id: string): Character {
  return allCharacters.find((c) => c.id === id)!;
}

function incrementTurnCount() {
  turnCount++;
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

export function getTimeline() {
  return timeline;
}

// window.addEventListener("turn-start", onTurnStart);
window.addEventListener("character-action", onCharacterAction);
window.addEventListener("action-selected", onActionSelected);
window.addEventListener("action-detail-selected", onActionDetailSelected);
window.addEventListener("action-target-selected", onActionTargetSelected);
// function onTurnStart(e: any) {}

async function onCharacterAction(e: any) {
  const { characterId } = e.detail;
  const character = getCharacterById(characterId);
  currentActionData.character = character;

  console.log("onCharacterAction", character.name);

  drawBottomPane(panes.text(`${character.name}'s turn`));
  await wait(2000);

  if (character.type === "enemy" || character.type === "npc") {
    //  decideEnemyAction
    // await wait(1200);
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

  if (
    currentActionData.character.type === "enemy" ||
    currentActionData.character.type === "npc"
  ) {
    // selectActionDetail
    // selectTarget
  }

  if (currentActionData.character.type === "hero") {
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
      case ActionName.Defend:
        drawBottomPane(
          panes.text(`${currentActionData.character.name} raised its defenses`)
        );
        await wait(1000);
        updateTimeline();
        break;
      case ActionName.Item:
        drawBottomPane(panes.itemSelection(inventory), dismissFn);
        break;
      default:
        break;
    }
  }
}
function onActionDetailSelected(e: any) {
  console.log("onActionDetailSelected", e);
  // currentActionData.actionDetail =
}
function onActionTargetSelected(e: any) {
  console.log("onActionTargetSelected", e);
  // currentActionData.actionName =

  // processAction()
}

// function processAction() {
//   console.log("processAction", { currentActionData });
// }

function startTurn(turn: Turn) {
  console.log("startTurn", turn);

  if (turn.type !== "status") {
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
  console.log("updateTimeline");
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

  console.log(
    "\n prevTimeline \n",
    prevTimeline,
    "\n timeline \n",
    timeline.slice()
  );

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
  await initializeTimeline();
  await wait(1000);
  await updateTimeline();
}

main();

// // startTurn -> updateTimeline -> startTurn -> updateTimeline -> etc....

// export { getTimeline, getCharacterById };
