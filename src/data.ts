import {
  ActionName,
  AttackName,
  Col,
  Element,
  InventoryItemName,
  InventoryItemType,
  Lane,
  MagicSpellName,
  StatusName,
} from "./enums";
import { Action, Character, InventoryItem, Status } from "./types";
import { idMaker } from "./utils";

const STATUS_ICONS: Record<StatusName, string> = {
  [StatusName.Poison]: "🧪",
  [StatusName.Regen]: "⭐️",
  [StatusName.Defense]: "🛡",
  [StatusName.Silence]: "🤫",
  [StatusName.Petrify]: "🗿",
  [StatusName.Slow]: "🕐",
  [StatusName.Stop]: "🛑",
  [StatusName.Confuse]: "😖",
  [StatusName.Sleep]: "💤",
  [StatusName.Berserk]: "😡",
  [StatusName.Blind]: "🕶",
  [StatusName.Mini]: "👶",
  [StatusName.DeathSentence]: "☠️",
  [StatusName.Haste]: "🏎",
  [StatusName.Barrier]: "🧱",
  [StatusName.MagiBarrier]: "🐚",
};

const INVENTORY_LIST: InventoryItem[] = [
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

const HERO_LIST: Character[] = [
  {
    id: idMaker(),
    name: "Otto",
    type: "hero",
    hp: 490, // hp: 40,
    mp: 65,
    speed: 62,
    imgUrl: "/sprites/sprite-01.webp",
    position: {
      lane: Lane.Front,
      col: Col.Center,
    },
    statuses: [],
    actions: [
      ActionName.Attack,
      ActionName._Attack,
      ActionName.Steal,
      ActionName.Defend,
      ActionName.Magic,
      ActionName.Item,
    ],
    skills: {
      [ActionName.Attack]: [AttackName.Slash, AttackName.Arrow],
      [ActionName.Magic]: [
        MagicSpellName.Bio,
        MagicSpellName.Regen,
        MagicSpellName.Aero,
        MagicSpellName.Cure,
        MagicSpellName.Drain,
        MagicSpellName.Haste,
      ],
    },
  },
  // {
  //   id: idMaker(),
  //   name: "Turok",
  //   type: "hero",
  //   hp: 640, // hp: 40,
  //   mp: 29,
  //   speed: 45,
  //   imgUrl: "/sprites/sprite-27.webp",
  //   position: {
  //     lane: Lane.Front,
  //     col: Col.Right,
  //   },
  //   statuses: [],
  //   actions: [ActionName._Attack, ActionName.Defend, ActionName.Magic, ActionName.Item, ActionName.Move],
  //   skills: {
  //  // [ActionName.Attack]: [AttackName.Slash],
  //     [ActionName.Magic]: [MagicSpellName.Quake],
  //   },
  // },
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
      col: Col.Right,
    },
    statuses: [],
    actions: [
      ActionName._Attack,
      ActionName.Attack,
      ActionName.Defend,
      ActionName.Magic,
      ActionName.Summon,
      ActionName.Item,
      ActionName.Move,
    ],
    skills: {
      [ActionName.Attack]: [AttackName.Arrow],
      [ActionName.Magic]: [MagicSpellName.Thunder, MagicSpellName.Bio, MagicSpellName.Cure],
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
      ActionName._Attack,
      ActionName.Steal,
      ActionName.Defend,
      ActionName.Magic,
      ActionName.Invoke,
      ActionName.Item,
      ActionName.Move,
    ],
    skills: {
      // [ActionName.Attack]: [AttackName.Stab, AttackName.Arrow],
      [ActionName.Magic]: [MagicSpellName.Hydro, MagicSpellName.Bio],
      [ActionName.Invoke]: ["DireWolf"],
    },
  },
];

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
    hp: 1450,
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
      [ActionName.Attack]: [AttackName.Bite, AttackName.Claws, AttackName.TailWhip],
      [ActionName.Magic]: [MagicSpellName.Fire, MagicSpellName.Bio],
    },
  },
  {
    id: idMaker(),
    name: "Ice Sorcerer",
    type: "enemy",
    hp: 2620,
    // hp: 320,
    mp: 50,
    speed: 52,
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

const STATUS_DICT: { [k in StatusName]?: Status } = {
  [StatusName.Poison]: {
    name: StatusName.Poison,
    speed: 78,
    power: 12,
    turnsPlayed: 0,
    turnCount: 3,
  },
  [StatusName.Regen]: {
    name: StatusName.Regen,
    speed: 160,
    power: 24,
    turnCount: 20,
    turnsPlayed: 0,
  },
  [StatusName.Defense]: {
    name: StatusName.Defense,
    turnCount: 1,
    turnsPlayed: 0,
  },
};

const DETAILED_ACTION_DICT: {
  [actionName in ActionName]?: { [skill: string]: Action };
} = {
  // attacks
  [ActionName.Attack]: {
    [AttackName.Punch]: {
      name: AttackName.Punch,
      type: "melee",
      power: 10,
      targets: "single",
    },
    [AttackName.Stab]: {
      name: AttackName.Stab,
      type: "melee",
      power: 28,
      targets: "single",
    },
    [AttackName.Slash]: {
      name: AttackName.Slash,
      type: "melee",
      power: 32,
      targets: "single",
    },
    [AttackName.Arrow]: {
      name: AttackName.Arrow,
      type: "ranged",
      power: 21,
      ranged: true,
      targets: "single",
    },
    [AttackName.StoneThrow]: {
      name: AttackName.StoneThrow,
      type: "melee",
      power: 15,
      ranged: true,
      targets: "single",
    },
    [AttackName.Claws]: {
      name: AttackName.Claws,
      type: "melee",
      power: 30,
      targets: "single",
    },
    [AttackName.Bite]: {
      name: AttackName.Bite,
      type: "melee",
      power: 24,
      targets: "single",
    },
    [AttackName.TailWhip]: {
      name: AttackName.TailWhip,
      type: "melee",
      power: 19,
      targets: "horiz",
    },
    [AttackName.IceBolt]: {
      name: AttackName.IceBolt,
      type: "ranged",
      power: 27,
      ranged: true,
      element: Element.Ice,
      targets: "vert",
    },
  },
  // magic
  [ActionName.Magic]: {
    [MagicSpellName.Fire]: {
      type: "magical",
      name: MagicSpellName.Fire,
      power: 125,
      element: Element.Fire,
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
    [MagicSpellName.Aero]: {
      type: "magical",
      name: MagicSpellName.Aero,
      power: 125,
      element: Element.Wind,
      mpCost: 4,
      targets: "single",
    },
    [MagicSpellName.Quake]: {
      type: "magical",
      name: MagicSpellName.Quake,
      power: 125,
      element: Element.Earth,
      mpCost: 10,
      targets: "party",
    },
    [MagicSpellName.Thunder]: {
      type: "magical",
      name: MagicSpellName.Thunder,
      power: 125,
      element: Element.Lightning,
      mpCost: 4,
      targets: "single",
    },
    [MagicSpellName.Blizzard]: {
      type: "magical",
      name: MagicSpellName.Blizzard,
      power: 125,
      element: Element.Ice,
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
      effects: [StatusName.Poison],
    },
    [MagicSpellName.Meteor]: {
      type: "magical",
      name: MagicSpellName.Meteor,
      power: 1000,
      mpCost: 42,
      targets: "party",
      effects: [StatusName.Poison],
    },
    [MagicSpellName.Demi]: {
      type: "magical",
      name: MagicSpellName.Demi,
      mpCost: 16,
      targets: "single",
    },
    [MagicSpellName.Drain]: {
      type: "magical",
      name: MagicSpellName.Drain,
      power: 200,
      mpCost: 10,
      targets: "single",
    },
    [MagicSpellName.Cure]: {
      type: "magical",
      name: MagicSpellName.Cure,
      power: 150,
      mpCost: 6,
      targets: "single",
    },
    [MagicSpellName.Haste]: {
      type: "magical",
      name: MagicSpellName.Regen,
      mpCost: 9,
      targets: "single",
      effects: [StatusName.Haste],
    },
    [MagicSpellName.Detox]: {
      type: "magical",
      name: MagicSpellName.Detox,
      mpCost: 3,
      targets: "single",
    },
    [MagicSpellName.Regen]: {
      type: "magical",
      name: MagicSpellName.Regen,
      power: 24,
      element: Element.Poison,
      mpCost: 14,
      targets: "single",
      effects: [StatusName.Regen],
    },
    [MagicSpellName.Remedy]: {
      type: "magical",
      name: MagicSpellName.Remedy,
      mpCost: 8,
      targets: "single",
    },
    [MagicSpellName.Cleanse]: {
      type: "magical",
      name: MagicSpellName.Cleanse,
      mpCost: 12,
      targets: "single",
    },
    [MagicSpellName.Protect]: {
      type: "magical",
      name: MagicSpellName.Protect,
      mpCost: 10,
      targets: "single",
    },
    [MagicSpellName.Shell]: {
      type: "magical",
      name: MagicSpellName.Shell,
      mpCost: 10,
      targets: "single",
    },
    [MagicSpellName.Slow]: {
      type: "magical",
      name: MagicSpellName.Slow,
      mpCost: 7,
      targets: "single",
    },
    [MagicSpellName.Silence]: {
      type: "magical",
      name: MagicSpellName.Silence,
      mpCost: 6,
      targets: "single",
    },
    [MagicSpellName.Confuse]: {
      type: "magical",
      name: MagicSpellName.Confuse,
      mpCost: 8,
      targets: "single",
    },
    [MagicSpellName.Sleep]: {
      type: "magical",
      name: MagicSpellName.Sleep,
      mpCost: 10,
      targets: "single",
    },
    [MagicSpellName.Dispel]: {
      type: "magical",
      name: MagicSpellName.Dispel,
      mpCost: 14,
      targets: "single",
    },
  },
  // item
  [ActionName.Item]: {
    [InventoryItemName.Potion]: {
      name: InventoryItemName.Potion,
      type: "item",
      targets: "single",
    },
    [InventoryItemName.Ether]: {
      name: InventoryItemName.Ether,
      type: "item",
      targets: "single",
    },
    [InventoryItemName.Antidote]: {
      name: InventoryItemName.Antidote,
      type: "item",
      targets: "single",
    },
    [InventoryItemName.PhoenixDown]: {
      name: InventoryItemName.PhoenixDown,
      type: "item",
      targets: "single",
    },
  },
  [ActionName.Invoke]: {
    // [NPCName]
  },
  // [ActionName.Summon]: {},
};

const SIMPLE_ACTION_DICT: { [actionName in ActionName]?: Action } = {
  // other
  [ActionName._Attack]: {
    name: ActionName._Attack,
    type: "melee",
    targets: "single",
  },
  [ActionName.Steal]: {
    name: ActionName.Steal,
    type: "steal",
    targets: "single",
  },
  [ActionName.Move]: {
    name: ActionName.Move,
    type: "move",
    targets: "self",
  },
  [ActionName.Hide]: {
    name: ActionName.Hide,
    type: "hide",
    targets: "self",
  },
  [ActionName.Defend]: {
    name: ActionName.Defend,
    type: "defend",
    targets: "self",
  },
};

export { INVENTORY_LIST, ENEMY_LIST, HERO_LIST, STATUS_DICT, DETAILED_ACTION_DICT, SIMPLE_ACTION_DICT, STATUS_ICONS };
