import { drawBottomPane, drawTimeline } from "./draw";
import { getCharacterById } from "./main";
import {
  Turn,
  BattleState,
  PlayerAction,
  InventoryItem,
  PaneInfo,
} from "./types";
import { getTurnDuration, idMaker } from "./utils";

let timeline: Turn[] = [];
let currentTurn: Turn | null = null;
let turnCount = 0;
let battleStarted = false;
let battleState: BattleState;
let playerAction: PlayerAction;
let inventory: InventoryItem[] = [
  { id: idMaker(), name: "Potion", type: "consumable", quantity: 3 },
  { id: idMaker(), name: "Ether", type: "consumable", quantity: 2 },
  { id: idMaker(), name: "Short Sword", type: "equipment", quantity: 1 },
];

function setBattleState(state: BattleState) {
  battleState = state;
  console.log(`%cBattleState ::: ${battleState}`, "color: lightgreen");
}

function setPlayerAction(action: PlayerAction) {
  playerAction = action;
  console.log(`%cPlayerAction ::: ${playerAction}`, "color: lightblue");
}

function setCurrentTurn(turn: Turn) {
  currentTurn = turn;
}

function incrementTurnCount() {
  turnCount++;
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
  battleStarted = true;
}

export const heroActionItems = (...args: any) => [
  {
    text: "attack",
    action: () => {
      console.log("clicked attack", ...args);

      setBattleState(BattleState.TargetSelection);
      drawBottomPane(panes.targetSelection());

      // now hero needs to select a target to complete attack action
      // or dismiss attack action
    },
  },
  {
    text: "defend",
    action: () => {
      console.log("clicked defend", ...args);

      setPlayerAction(PlayerAction.Defend);

      window.dispatchEvent(
        new CustomEvent("hero-defense", {
          detail: { hero: getCharacterById(timeline[0].entity.id) },
        })
      );
    },
  },
  {
    text: "item",
    action: () => {
      console.log("clicked item", ...args);

      setPlayerAction(PlayerAction.Item);

      setBattleState(BattleState.ItemSelection);
      drawBottomPane(panes.itemSelection(inventory));

      // now hero needs to select an item to complete item action
      // or dismiss item action
    },
  },
];

export const inventoryItems = (itemList: InventoryItem[]) =>
  itemList
    .filter((item) => item.type === "consumable")
    .map((item) => ({
      text: item.name,
      extra: `x${item.quantity}`,
      action: () => {
        console.log("selected", item);
      },
    }));

export const panes: Record<any, any> = {
  battleStart: () => ({ type: "text", content: "get ready!" }),
  enemyAction: (message: string) => ({
    type: "text",
    content: message,
  }),
  enemyAttack: (message: string) => ({
    type: "text",
    content: message,
  }),
  heroActions: (args: any) => ({
    type: "list",
    content: heroActionItems(args),
  }),
  itemSelection: (args: any) => ({
    type: "list",
    content: inventoryItems(args),
  }),
  targetSelection: () => ({
    type: "text",
    content: `Select Target`,
  }),
  heroAttack: (message: string) => ({
    type: "text",
    content: message,
  }),
};

const enemies = [
  // {
  //   id: idMaker(),
  //   name: "Skeleton 01",
  //   type: "enemy",
  //   hp: 120,
  //   speed: 70,
  //   imgUrl: "/sprites/sprite-70.webp",
  //   position: {
  //     lane: "front",
  //     col: "left",
  //   },
  //   lastAction: "none",
  //   actions: {
  //     attack: { type: "melee", power: 40 },
  //   },
  // },
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
    hp: 320,
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
    hp: 320,
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
    hp: 520,
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
    hp: 570,
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
    hp: 640,
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
  battleStarted,
  battleState,
  playerAction,
  enemies,
  heroes,
  allCharacters,
  initializeTimeline,
  setCurrentTurn,
  setBattleState,
  setPlayerAction,
  incrementTurnCount,
};
