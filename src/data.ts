import {
  ActionName,
  AttackName,
  Col,
  Element,
  Lane,
  MagicSpellName,
} from "./enums";
import { Action, Character, Status } from "./types";
import { idMaker } from "./utils";

const ENEMY_LIST: Character[] = [
  {
    id: idMaker(),
    name: "Skeleton",
    type: "enemy",
    hp: 120,
    speed: 70,
    imgUrl: "/sprites/sprite-70.webp",
    position: {
      lane: Lane.Front,
      col: Col.Left,
    },
    statuses: [],
    actions: [ActionName.Attack],
    skills: {
      attack: [AttackName.Slash],
      magic: [MagicSpellName.Bio],
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
      lane: Lane.Front,
      col: Col.Center,
    },
    statuses: [],
    actions: [ActionName.Attack],
    skills: {
      attack: [AttackName.Bite, AttackName.Claws, AttackName.TailWhip],
      magic: [MagicSpellName.Fire, MagicSpellName.Bio],
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
      lane: Lane.Back,
      col: Col.Left,
    },
    statuses: [],
    actions: [ActionName.Attack],
    skills: {
      attack: [AttackName.IceBolt],
      magic: [MagicSpellName.Blizzard],
    },
  },
];

const HERO_LIST: Character[] = [
  {
    id: idMaker(),
    name: "Abigail",
    type: "hero",
    hp: 520, // hp: 20,
    speed: 54,
    imgUrl: "/sprites/sprite-09.webp",
    position: {
      lane: Lane.Back,
      col: Col.Center,
    },
    statuses: [],
    actions: [
      ActionName.Attack,
      ActionName.Defend,
      ActionName.Magic,
      ActionName.Summon,
      ActionName.Item,
      ActionName.Move,
    ],
    skills: {
      attack: [AttackName.Stab, AttackName.Arrow],
      magic: [MagicSpellName.Thunder, MagicSpellName.Cure],
      summon: ["DireWolf"],
    },
  },
  {
    id: idMaker(),
    name: "Savannah",
    type: "hero",
    hp: 570, // hp: 70,
    speed: 62,
    imgUrl: "/sprites/sprite-04.webp",
    position: {
      lane: Lane.Front,
      col: Col.Left,
    },
    statuses: [],
    actions: [
      ActionName.Attack,
      ActionName.Steal,
      ActionName.Defend,
      ActionName.Magic,
      ActionName.Invoke,
      ActionName.Item,
      ActionName.Move,
    ],
    skills: {
      attack: [AttackName.Stab],
      magic: [MagicSpellName.Water],
      invoke: ["DireWolf"],
    },
  },
  {
    id: idMaker(),
    name: "Turok",
    type: "hero",
    hp: 640, // hp: 40,
    speed: 45,
    imgUrl: "/sprites/sprite-27.webp",
    position: {
      lane: Lane.Front,
      col: Col.Right,
    },
    statuses: [],
    actions: [
      ActionName.Attack,
      ActionName.Defend,
      ActionName.Magic,
      ActionName.Item,
      ActionName.Move,
    ],
    skills: {
      attack: [AttackName.Slash],
      magic: [MagicSpellName.Quake],
    },
  },
];

// const STATUS_LIST: Status[] = [
//   {
//     id: idMaker(),
//     characterId: HERO_LIST[0].id,
//     name: "Poison",
//     // speed: 60,
//     speed: 90,
//     power: 12,
//     turnsPlayed: 0,
//     turnCount: 4,
//   },
//   {
//     id: idMaker(),
//     characterId: HERO_LIST[1].id,
//     name: "Poison",
//     // speed: 60,
//     speed: 80,
//     power: 16,
//     turnsPlayed: 0,
//     turnCount: 2,
//   },
//   {
//     id: idMaker(),
//     characterId: HERO_LIST[2].id,
//     name: "Poison",
//     // speed: 60,
//     speed: 70,
//     power: 16,
//     turnsPlayed: 0,
//     turnCount: 1,
//   },
// ];

export { ENEMY_LIST, HERO_LIST /*STATUS_LIST*/ };

// const actionDict: { [k in ActionName]?: Action } = {
//   [ActionName.Attack]: {
//     type: "physical",
//     attack: {
//       name: AttackName.Slash,
//       power: 65,
//     },
//     targets: "single",
//   },
//   [ActionName.Magic]: {
//     type: "magical",
//     spell: {
//       name: MagicSpellName.Thunder,
//       mpCost: 4,
//       power: 132,
//     },
//     targets: "single",
//   },
//   [ActionName.Defend]: {
//     type: "other",
//     targets: "self",
//   },
//   [ActionName.Item]: {
//     type: "other",
//     targets: "single",
//   },
//   [ActionName.Move]: {
//     type: "other",
//     targets: "single",
//   },
// };
