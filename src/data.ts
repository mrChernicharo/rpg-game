import { Status } from "./types";
import { idMaker } from "./utils";

const ENEMY_LIST = [
  {
    id: idMaker(),
    name: "Skeleton",
    type: "enemy",
    hp: 120,
    speed: 70,
    imgUrl: "/sprites/sprite-70.webp",
    position: {
      lane: "front",
      col: "left",
    },
    statuses: [],
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
    statuses: [],
    actions: {
      attack: { type: "melee", power: 55 },
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
      col: "center",
    },
    statuses: [],
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
    statuses: [],
    actions: {
      attack: { type: "ranged", power: 30 },
    },
  },
];

const HERO_LIST = [
  // {
  //   id: idMaker(),
  //   name: "Squall",
  //   type: "hero",
  //   // hp: 20,
  //   hp: 520,
  //   speed: 64,
  //   imgUrl: "/sprites/sprite-01.webp",
  //   position: {
  //     lane: "front",
  //     col: "center",
  //   },
  // },
  {
    id: idMaker(),
    name: "Abigail",
    type: "hero",
    // hp: 20,
    hp: 520,
    speed: 54,
    imgUrl: "/sprites/sprite-09.webp",
    position: {
      lane: "back",
      col: "center",
    },
    statuses: [],
    actions: {
      attack: { type: "melee", power: 40 },
    },
  },
  {
    id: idMaker(),
    name: "Savannah",
    type: "hero",
    // hp: 70,
    hp: 570,
    speed: 62,
    imgUrl: "/sprites/sprite-04.webp",
    position: {
      lane: "front",
      col: "left",
    },
    statuses: [],
    actions: {
      attack: { type: "melee", power: 60 },
    },
  },
  {
    id: idMaker(),
    name: "Turok",
    type: "hero",
    // hp: 40,
    hp: 640,
    speed: 45,
    imgUrl: "/sprites/sprite-27.webp",
    position: {
      lane: "front",
      col: "right",
    },
    statuses: [],
    actions: {
      attack: { type: "melee", power: 76 },
    },
  },
];

const STATUS_LIST: Status[] = [
  {
    id: idMaker(),
    characterId: HERO_LIST[0].id,
    name: "Poison",
    // speed: 60,
    speed: 90,
    power: 12,
    turnsPlayed: 0,
    turnCount: 4,
  },
  {
    id: idMaker(),
    characterId: HERO_LIST[1].id,
    name: "Poison",
    // speed: 60,
    speed: 80,
    power: 16,
    turnsPlayed: 0,
    turnCount: 2,
  },
  {
    id: idMaker(),
    characterId: HERO_LIST[2].id,
    name: "Poison",
    // speed: 60,
    speed: 70,
    power: 16,
    turnsPlayed: 0,
    turnCount: 1,
  },
];

export { ENEMY_LIST, HERO_LIST, STATUS_LIST };
