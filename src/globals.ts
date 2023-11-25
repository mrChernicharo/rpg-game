import { drawTimeline } from "./draw";
import {
  BattleState,
  PlayerAction,
  InventoryItemName,
  InventoryItemType,
} from "./enums";
import { Turn, InventoryItem, Character } from "./types";
import { getTurnDuration, idMaker } from "./utils";

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

const enemies = [
  {
    id: idMaker(),
    name: "Skeleton 01",
    type: "enemy",
    hp: 120,
    speed: 70,
    imgUrl: "/sprites/sprite-70.webp",
    position: {
      lane: "front",
      col: "left",
    },
    lastAction: "none",
    actions: {
      attack: { type: "melee", power: 40 },
    },
  },
  // {
  //   id: idMaker(),
  //   name: "Demon",
  //   type: "enemy",
  //   hp: 250,
  //   speed: 58,
  //   imgUrl: "/sprites/sprite-77.webp",
  //   position: {
  //     lane: "front",
  //     col: "center",
  //   },
  //   lastAction: "none",
  //   actions: {
  //     attack: { type: "melee", power: 55 },
  //   },
  // },
  // {
  //   id: idMaker(),
  //   name: "Skeleton 02",
  //   type: "enemy",
  //   hp: 120,
  //   speed: 70,
  //   imgUrl: "/sprites/sprite-70.webp",
  //   position: {
  //     lane: "front",
  //     col: "right",
  //   },
  //   lastAction: "none",
  //   actions: {
  //     attack: { type: "melee", power: 40 },
  //   },
  // },
  {
    id: idMaker(),
    name: "Ice Sorcerer",
    type: "enemy",
    hp: 20,
    // hp: 320,
    speed: 50,
    imgUrl: "/sprites/sprite-78.webp",
    position: {
      lane: "back",
      col: "center",
    },
    lastAction: "none",
    actions: {
      attack: { type: "ranged", power: 30 },
    },
  },
  {
    id: idMaker(),
    name: "Ice Sorcerer",
    type: "enemy",
    hp: 20,
    // hp: 320,
    speed: 50,
    imgUrl: "/sprites/sprite-78.webp",
    position: {
      lane: "back",
      col: "left",
    },
    lastAction: "none",
    actions: {
      attack: { type: "ranged", power: 30 },
    },
  },
];

const heroes = [
  {
    id: idMaker(),
    name: "Abigail",
    type: "hero",
    hp: 20,
    // hp: 520,
    speed: 54,
    imgUrl: "/sprites/sprite-09.webp",
    position: {
      lane: "back",
      col: "center",
    },
    lastAction: "none",
    actions: {
      attack: { type: "melee", power: 40 },
    },
  },
  {
    id: idMaker(),
    name: "Savannah",
    type: "hero",
    hp: 70,
    // hp: 570,
    speed: 62,
    imgUrl: "/sprites/sprite-04.webp",
    position: {
      lane: "front",
      col: "left",
    },
    lastAction: "none",
    actions: {
      attack: { type: "melee", power: 60 },
    },
  },
  {
    id: idMaker(),
    name: "Turok",
    type: "hero",
    hp: 40,
    // hp: 640,
    speed: 45,
    imgUrl: "/sprites/sprite-27.webp",
    position: {
      lane: "front",
      col: "right",
    },
    lastAction: "none",
    actions: {
      attack: { type: "melee", power: 76 },
    },
  },
];

const allCharacters = [...enemies, ...heroes];

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
};
