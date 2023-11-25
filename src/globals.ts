import { ENEMY_LIST, HERO_LIST } from "./data";
import { drawBottomPane, drawCharacters, drawTimeline } from "./draw";
import {
  BattleState,
  PlayerAction,
  InventoryItemName,
  InventoryItemType,
} from "./enums";
import { handleCharacterTurn } from "./events";
import { panes } from "./infoPane";
import { Turn, InventoryItem, Character } from "./types";
import { getTurnDuration, idMaker, wait } from "./utils";

let timeline: Turn[] = [];
let currentTurn: Turn | null = null;
let turnCount = 0;
let battleState: BattleState;
let playerAction: PlayerAction;
let selectedItem: InventoryItem | null = null;
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
let enemies: Character[] = [];
let heroes: Character[] = [];
let allCharacters: Character[] = [];

function setBattleState(state: BattleState) {
  battleState = state;
  console.log(`%cBattleState ::: ${battleState}`, "color: lightgreen");
}

function setPlayerAction(action: PlayerAction) {
  playerAction = action;
  // console.trace("setPlayerAction");
  console.log(`%cPlayerAction ::: ${playerAction}`, "color: lightblue");
}

function setCurrentTurn(turn: Turn) {
  currentTurn = turn;
}

function setSelectedItem(item: InventoryItem) {
  selectedItem = item;
}

function incrementTurnCount() {
  turnCount++;
}

function getCharacterById(id: string): Character | undefined {
  return allCharacters.find((c) => c.id === id);
}

function chooseTargetForEnemy(enemy: Character): Character {
  let possibleTargets: Character[];

  if (enemy.actions.attack.type === "ranged") {
    possibleTargets = [...heroes].filter((h) => h.hp > 0);
  } else if (enemy.actions.attack.type === "melee") {
    const [heroesInTheFront, heroesInTheBack] = [
      heroes.filter((h) => h.position.lane === "front" && h.hp > 0),
      heroes.filter((h) => h.position.lane === "back" && h.hp > 0),
    ];
    if (heroesInTheFront.length > 0) {
      possibleTargets = [...heroesInTheFront];
    } else {
      possibleTargets = [...heroesInTheBack];
    }
  } else {
    possibleTargets = [...heroes].filter((h) => h.hp > 0);
  }

  const idx = Math.floor(Math.random() * possibleTargets.length);
  return possibleTargets[idx];
}

function cleanupSelectedItem() {
  const temp = { ...selectedItem };
  selectedItem = null;
  return temp as InventoryItem;
}

function subtractFromInventory(item: InventoryItem) {
  const itemIdx = inventory.findIndex((obj) => obj.id === item.id)!;
  const inventoryItem = inventory[itemIdx];

  if (inventoryItem?.quantity === 1) {
    inventory.splice(itemIdx, 1);
  } else {
    inventoryItem.quantity--;
  }

  console.log("inventory", inventory);
}

function intializeCharacters() {
  heroes = HERO_LIST as Character[];
  enemies = ENEMY_LIST as Character[];
  allCharacters = [...enemies, ...heroes];
}

function initializeTimeline() {
  timeline = allCharacters
    .map((c) => ({
      entity: { id: c.id, name: c.name },
      turnDuration: getTurnDuration(c.speed),
      nextTurnAt: getTurnDuration(c.speed),
      turnsPlayed: 0,
    }))
    .sort((a, b) => a.nextTurnAt - b.nextTurnAt);

  drawTimeline();
}

async function startBattle() {
  setBattleState(BattleState.Dormant);
  setPlayerAction(PlayerAction.None);

  intializeCharacters();
  drawCharacters();

  drawBottomPane(panes.battleStart());
  await wait(1000);
  drawBottomPane(panes.getReady());
  await wait(1000);

  initializeTimeline();

  const firstToPlay = getCharacterById(timeline[0].entity.id)!;
  handleCharacterTurn(firstToPlay);
}

export {
  timeline,
  currentTurn,
  turnCount,
  battleState,
  playerAction,
  selectedItem,
  inventory,
  enemies,
  heroes,
  allCharacters,
  getCharacterById,
  initializeTimeline,
  setCurrentTurn,
  setBattleState,
  setPlayerAction,
  incrementTurnCount,
  cleanupSelectedItem,
  subtractFromInventory,
  chooseTargetForEnemy,
  setSelectedItem,
  startBattle,
};
