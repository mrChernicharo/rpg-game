import {
  ActionName,
  AttackName,
  Col,
  Element,
  Lane,
  MagicSpellName,
  StatusName,
} from "./enums";
import { Action, Character } from "./types";
import { idMaker } from "./utils";

const ACTION_DICT: {
  [actionName in ActionName]?: { [skill: string]: Action };
} = {
  [ActionName.Attack]: {
    [AttackName.Stab]: {
      name: AttackName.Stab,
      type: "physical",
      power: 28,
      targets: "single",
    },
    [AttackName.Slash]: {
      name: AttackName.Slash,
      type: "physical",
      power: 32,
      targets: "single",
    },
    [AttackName.Arrow]: {
      name: AttackName.Arrow,
      type: "physical",
      power: 21,
      ranged: true,
      targets: "single",
    },
    [AttackName.StoneThrow]: {
      name: AttackName.StoneThrow,
      type: "physical",
      power: 15,
      ranged: true,
      targets: "single",
    },
    [AttackName.Claws]: {
      name: AttackName.Claws,
      type: "physical",
      power: 30,
      targets: "single",
    },
    [AttackName.Bite]: {
      name: AttackName.Bite,
      type: "physical",
      power: 24,
      targets: "single",
    },
    [AttackName.TailWhip]: {
      name: AttackName.TailWhip,
      type: "physical",
      power: 19,
      targets: "horiz",
    },
    [AttackName.IceBolt]: {
      name: AttackName.IceBolt,
      type: "physical",
      power: 27,
      ranged: true,
      element: Element.Ice,
      targets: "vert",
    },
  },
  [ActionName.Magic]: {
    [MagicSpellName.Fire]: {
      type: "magical",
      name: MagicSpellName.Fire,
      power: 125,
      element: Element.Fire,
      mpCost: 4,
      targets: "single",
    },
    [MagicSpellName.Thunder]: {
      type: "magical",
      name: MagicSpellName.Thunder,
      power: 125,
      element: Element.Lightning,
      mpCost: 4,
      targets: "single",
    },
    [MagicSpellName.Hydro]: {
      type: "magical",
      name: MagicSpellName.Hydro,
      power: 125,
      element: Element.Water,
      mpCost: 4,
      targets: "single",
    },
    [MagicSpellName.Bio]: {
      type: "magical",
      name: MagicSpellName.Bio,
      power: 110,
      element: Element.Poison,
      mpCost: 6,
      targets: "single",
      effects: [
        {
          name: StatusName.Poison,
          speed: 80,
          power: 15,
          turnCount: 6,
          turnsPlayed: 0,
        },
      ],
    },
    [MagicSpellName.Regen]: {
      type: "magical",
      name: MagicSpellName.Regen,
      power: 24,
      element: Element.Poison,
      mpCost: 14,
      targets: "single",
      effects: [
        {
          name: StatusName.Regen,
          speed: 100,
          power: 24,
          turnCount: 20,
          turnsPlayed: 0,
        },
      ],
    },
  },
};

const ENEMY_LIST: Character[] = [
  {
    id: idMaker(),
    name: "Skeleton",
    type: "enemy",
    hp: 120,
    mp: 50,
    speed: 70,
    imgUrl: "/sprites/sprite-70.webp",
    position: {
      lane: Lane.Front,
      col: Col.Left,
    },
    statuses: [],
    actions: [ActionName.Attack],
    skills: {
      [ActionName.Attack]: [AttackName.Slash],
      [ActionName.Magic]: [MagicSpellName.Bio],
    },
  },
  {
    id: idMaker(),
    name: "Demon",
    type: "enemy",
    hp: 250,
    mp: 50,
    speed: 58,
    imgUrl: "/sprites/sprite-77.webp",
    position: {
      lane: Lane.Front,
      col: Col.Center,
    },
    statuses: [],
    actions: [ActionName.Attack],
    skills: {
      [ActionName.Attack]: [
        AttackName.Bite,
        AttackName.Claws,
        AttackName.TailWhip,
      ],
      [ActionName.Magic]: [MagicSpellName.Fire, MagicSpellName.Bio],
    },
  },
  {
    id: idMaker(),
    name: "Ice Sorcerer",
    type: "enemy",
    hp: 20,
    // hp: 320,
    mp: 50,
    speed: 50,
    imgUrl: "/sprites/sprite-78.webp",
    position: {
      lane: Lane.Back,
      col: Col.Left,
    },
    statuses: [],
    actions: [ActionName.Attack],
    skills: {
      [ActionName.Attack]: [AttackName.IceBolt],
      [ActionName.Magic]: [MagicSpellName.Blizzard],
    },
  },
];

const HERO_LIST: Character[] = [
  {
    id: idMaker(),
    name: "Turok",
    type: "hero",
    hp: 640, // hp: 40,
    mp: 29,
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
      [ActionName.Attack]: [AttackName.Slash],
      [ActionName.Magic]: [MagicSpellName.Quake],
    },
  },
  {
    id: idMaker(),
    name: "Abigail",
    type: "hero",
    hp: 520, // hp: 20,
    mp: 50,
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
      [ActionName.Attack]: [AttackName.Stab, AttackName.Arrow],
      [ActionName.Magic]: [MagicSpellName.Thunder, MagicSpellName.Cure],
      [ActionName.Summon]: ["DireWolf"],
    },
  },
  {
    id: idMaker(),
    name: "Savannah",
    type: "hero",
    hp: 570,
    mp: 70,
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
      [ActionName.Attack]: [AttackName.Stab],
      [ActionName.Magic]: [MagicSpellName.Hydro],
      [ActionName.Invoke]: ["DireWolf"],
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

export { ENEMY_LIST, HERO_LIST, ACTION_DICT /*STATUS_LIST*/ };

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
