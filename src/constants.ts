import { PaneInfo } from "./main";
import { idMaker } from "./utils";

export const battleUI = document.querySelector("#battle-ui");

export const battleLanesUI = Array.from(
  document.querySelectorAll(".battle-lane")
);
export const turnSequenceUI = document.querySelector("#turn-sequence")!;

export const bottomSection = {
  text: document.querySelector("#bottom-lane > #text-content")!,
  list: document.querySelector("#bottom-lane > #list-content")!,
};
export const testBtn = document.querySelector("#test-btn") as HTMLButtonElement;
export const testBtn2 = document.querySelector(
  "#test-btn-2"
) as HTMLButtonElement;

export const slots = Array.from(document.querySelectorAll(".lane-slot"));

export const [enemyBackSlots, enemyFrontSlots, heroFrontSlots, heroBackSlots] =
  [
    battleLanesUI[0].children,
    battleLanesUI[1].children,
    battleLanesUI[2].children,
    battleLanesUI[3].children,
  ].map((HTMLels) => Array.from(HTMLels));

const heroActionItems = (...args: any) => [
  {
    text: "attack",
    action: () => {
      console.log("clicked attack", ...args);

      // @TODO
      // export const targetEnemy = await aimToTarget(entity);
    },
  },
  {
    text: "defend",
    action: () => {
      console.log("clicked defend", ...args);
    },
  },
  {
    text: "item",
    action: () => {
      console.log("clicked item", ...args);
    },
  },
];

export const panes: Record<string, (...args: any) => PaneInfo> = {
  battleStart: () => ({ type: "text", content: "get ready!" }),
  enemyAction: (message: string) => ({
    type: "text",
    content: message,
  }),
  heroActions: (args) => ({
    type: "list",
    content: heroActionItems(args),
  }),
};

export const enemies = [
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
    actions: {
      attack: { type: "melee", power: 40 },
    },
  },
  {
    id: idMaker(),
    name: "Demon",
    type: "enemy",
    hp: 250,
    speed: 58,
    imgUrl: "/sprites/sprite-77.webp",
    position: {
      lane: "front",
      col: "center",
    },
    actions: {
      attack: { type: "melee", power: 55 },
    },
  },
  {
    id: idMaker(),
    name: "Skeleton 02",
    type: "enemy",
    hp: 120,
    speed: 70,
    imgUrl: "/sprites/sprite-70.webp",
    position: {
      lane: "front",
      col: "right",
    },
    actions: {
      attack: { type: "melee", power: 40 },
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
      col: "center",
    },
    actions: {
      attack: { type: "ranged", power: 30 },
    },
  },
];

export const heroes = [
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
    actions: {
      attack: { type: "melee", power: 76 },
    },
  },
];

export const allCharacters = [...enemies, ...heroes];
