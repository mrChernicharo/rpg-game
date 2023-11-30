import {
  ActionName,
  _AttackName,
  Col,
  Element,
  InventoryItemName,
  InventoryItemType,
  Lane,
  MagicSpellName,
  StatusName,
  EquipmentSlot,
  AttributeName,
} from "./enums";
import { Action, Character, EquipmentItem, InventoryItem, Status } from "./types";
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

const HERO_LIST: Character[] = [
  {
    id: idMaker(),
    name: "Otto",
    type: "hero",
    hp: 490, // hp: 40,
    mp: 65,
    speed: 62,
    level: 7,
    xp: 4600,
    imgUrl: "/sprites/sprite-01.webp",
    attributes: {
      strength: 23,
      intelligence: 28,
      dexterity: 24,
      agility: 28,
      vigor: 24,
      wisdom: 25,
      luck: 30,
    },
    equipment: {
      head: null,
      body: null,
      shield: null,
      weapon: null,
      feet: null,
      accessory: null,
      accessory2: null,
    },
    position: {
      lane: Lane.Front,
      col: Col.Center,
    },
    statuses: [],
    actions: [
      ActionName.Attack,
      ActionName.Magic,
      ActionName.Steal,
      ActionName.Item,
      ActionName.Defend,
      ActionName._Attack,
    ],
    abilities: {
      [ActionName._Attack]: [_AttackName.Slash, _AttackName.Arrow],
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
  {
    id: idMaker(),
    name: "Turok",
    type: "hero",
    hp: 640, // hp: 40,
    mp: 29,
    speed: 45,
    level: 7,
    xp: 4600,
    imgUrl: "/sprites/sprite-27.webp",
    position: {
      lane: Lane.Front,
      col: Col.Right,
    },
    statuses: [],
    actions: [ActionName.Attack, ActionName.Magic, ActionName.Item, ActionName.Defend, ActionName.Move],
    abilities: {
      // [ActionName._Attack]: [_AttackName.Slash],
      [ActionName.Magic]: [MagicSpellName.Quake],
    },
    attributes: {
      strength: 34,
      intelligence: 18,
      dexterity: 22,
      agility: 24,
      vigor: 32,
      wisdom: 19,
      luck: 24,
    },
    equipment: {
      head: null,
      body: null,
      shield: null,
      weapon: null,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
  {
    id: idMaker(),
    name: "Abigail",
    type: "hero",
    hp: 520, // hp: 20,
    mp: 50,
    speed: 54,
    level: 7,
    xp: 4600,
    imgUrl: "/sprites/sprite-09.webp",
    position: {
      lane: Lane.Back,
      col: Col.Right,
    },
    statuses: [],
    actions: [
      ActionName.Attack,
      ActionName.Magic,
      ActionName.Summon,
      ActionName.Item,
      ActionName.Defend,
      ActionName.Move,
      ActionName._Attack,
    ],
    abilities: {
      [ActionName._Attack]: [_AttackName.Arrow, _AttackName.StoneThrow],
      [ActionName.Magic]: [MagicSpellName.Thunder, MagicSpellName.Bio, MagicSpellName.Cure],
      [ActionName.Summon]: ["DireWolf"],
    },
    attributes: {
      strength: 17,
      intelligence: 31,
      dexterity: 28,
      agility: 26,
      vigor: 20,
      wisdom: 30,
      luck: 19,
    },
    equipment: {
      head: null,
      body: null,
      shield: null,
      weapon: null,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
  {
    id: idMaker(),
    name: "Savannah",
    type: "hero",
    hp: 570,
    mp: 70,
    speed: 62,
    level: 7,
    xp: 4600,
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
    abilities: {
      // [ActionName.Attack]: [_AttackName.Stab, _AttackName.Arrow],
      [ActionName.Magic]: [MagicSpellName.Hydro, MagicSpellName.Bio],
      [ActionName.Invoke]: ["DireWolf"],
    },
    attributes: {
      strength: 25,
      intelligence: 24,
      dexterity: 23,
      agility: 29,
      vigor: 28,
      wisdom: 20,
      luck: 25,
    },
    equipment: {
      head: null,
      body: null,
      shield: null,
      weapon: null,
      feet: null,
      accessory: null,
      accessory2: null,
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
    level: 7,
    imgUrl: "/sprites/sprite-70.webp",
    position: {
      lane: Lane.Front,
      col: Col.Left,
    },
    statuses: [],
    actions: [ActionName._Attack],
    abilities: {
      [ActionName._Attack]: [_AttackName.Slash],
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
    level: 7,
    imgUrl: "/sprites/sprite-77.webp",
    position: {
      lane: Lane.Front,
      col: Col.Center,
    },
    statuses: [],
    actions: [ActionName._Attack],
    abilities: {
      [ActionName._Attack]: [_AttackName.Bite, _AttackName.Claws, _AttackName.TailWhip],
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
    level: 7,
    imgUrl: "/sprites/sprite-78.webp",
    position: {
      lane: Lane.Back,
      col: Col.Left,
    },
    statuses: [],
    actions: [ActionName._Attack],
    abilities: {
      [ActionName._Attack]: [_AttackName.IceBolt],
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
  [actionName in ActionName]?: { [ability: string]: Action };
} = {
  // attacks
  [ActionName._Attack]: {
    [_AttackName.Punch]: {
      name: _AttackName.Punch,
      type: "melee",
      power: 10,
      targets: "single",
    },
    [_AttackName.Stab]: {
      name: _AttackName.Stab,
      type: "melee",
      power: 28,
      targets: "single",
    },
    [_AttackName.Slash]: {
      name: _AttackName.Slash,
      type: "melee",
      power: 32,
      targets: "single",
    },
    [_AttackName.Arrow]: {
      name: _AttackName.Arrow,
      type: "ranged",
      power: 21,
      targets: "single",
    },
    [_AttackName.StoneThrow]: {
      name: _AttackName.StoneThrow,
      type: "ranged",
      power: 15,
      targets: "single",
    },
    [_AttackName.Claws]: {
      name: _AttackName.Claws,
      type: "melee",
      power: 30,
      targets: "single",
    },
    [_AttackName.Bite]: {
      name: _AttackName.Bite,
      type: "melee",
      power: 24,
      targets: "single",
    },
    [_AttackName.TailWhip]: {
      name: _AttackName.TailWhip,
      type: "melee",
      power: 19,
      targets: "horiz",
    },
    [_AttackName.IceBolt]: {
      name: _AttackName.IceBolt,
      type: "ranged",
      power: 27,
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
  [ActionName.Attack]: {
    name: ActionName.Attack,
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

const EQUIPMENT_ITEM_DICT: { [itemName in InventoryItemName]?: EquipmentItem } = {
  // weapon
  ShortSword: {
    id: idMaker(),
    slot: EquipmentSlot.Weapon,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/sword.webp",
    name: InventoryItemName.ShortSword,
    power: 15,
    effects: [],
  },
  LongSword: {
    id: idMaker(),
    slot: EquipmentSlot.Weapon,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/sword.webp",
    name: InventoryItemName.LongSword,
    power: 22,
    effects: [],
  },
  // DiamondSword: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.DiamondSword,
  // },
  // RuneBlade: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.RuneBlade,
  // },
  // MasamuneBlade: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.MasamuneBlade,
  // },
  // Deathbringer: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Deathbringer,
  // },
  // UltimaWeapon: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.UltimaWeapon,
  // },
  // Apocalypse: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Apocalypse,
  // },
  // Ragnarok: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Ragnarok,
  // },
  // Excalibur: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Excalibur,
  // },
  // CrystalSword: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.CrystalSword,
  // },
  // Excalipoor: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Excalipoor,
  // },
  // ApocalypseBlade: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.ApocalypseBlade,
  // },
  // Lionheart: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Lionheart,
  // },
  // Outsider: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Outsider,
  // },
  // Organics: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Organics,
  // },
  // ChaosBlade: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.ChaosBlade,
  // },
  // HeavenSword: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.HeavenSword,
  // },
  // ApocalypseEdge: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.ApocalypseEdge,
  // },
  // BraveBlade: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.BraveBlade,
  // },
  // RuneStaff: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.RuneStaff,
  // },
  // WizardRod: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.WizardRod,
  //   effects: [{ type: "attribute", attribute: AttributeName.Intelligence, power: 3 }],
  // },
  // Nirvana: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Nirvana,
  //   effects: [
  //     { type: "attribute", attribute: AttributeName.Intelligence, power: 4 },
  //     { type: "attribute", attribute: AttributeName.Wisdom, power: 4 },
  //     { type: "non-elemental", nature: "resist", power: 15, value: "magic" },
  //   ],
  // },
  // HolyLance: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.HolyLance,
  // },
  // Orichalcum: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Orichalcum,
  // },
  // Godhand: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Godhand,
  // },
  // PoisonKnuckles: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.PoisonKnuckles,
  // },
  // DeathSickle: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.DeathSickle,
  // },
  // WingedSword: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.WingedSword,
  // },
  // SaveTheQueen: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.SaveTheQueen,
  // },
  // Masamune: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.Masamune,
  // },
  // ZodiacSpear: {
  //   id: idMaker(),
  //   slot: EquipmentSlot.Weapon,
  //   type: InventoryItemType.Equipment,
  //   imgURL: "/public/icons/sword.webp",
  //   name: InventoryItemName.ZodiacSpear,
  // },

  // ranged
  HunterBow: {
    id: idMaker(),
    slot: EquipmentSlot.Weapon,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/arrow.webp",
    name: InventoryItemName.HunterBow,
    power: 12,
    effects: [],
  },
  CompositeBow: {
    id: idMaker(),
    slot: EquipmentSlot.Weapon,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/sword.webp",
    name: InventoryItemName.CompositeBow,
    power: 18,
    effects: [],
  },
  YoichiBow: {
    id: idMaker(),
    slot: EquipmentSlot.Weapon,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/arrow.webp",
    name: InventoryItemName.YoichiBow,
    power: 25,
    effects: [{ type: "attribute", attribute: AttributeName.Dexterity, power: 5 }],
  },
  ArtemisBow: {
    id: idMaker(),
    slot: EquipmentSlot.Weapon,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/arrow.webp",
    name: InventoryItemName.ArtemisBow,
    effects: [{ type: "element", element: Element.Lightning, nature: "damage", power: 12 }],
  },
  Revolver: {
    id: idMaker(),
    slot: EquipmentSlot.Weapon,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/sword.webp",
    name: InventoryItemName.Revolver,
  },

  // body
  LeatherArmor: {
    id: idMaker(),
    slot: EquipmentSlot.Body,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/armor.webp",
    name: InventoryItemName.LeatherArmor,
  },
  Chainmail: {
    id: idMaker(),
    slot: EquipmentSlot.Body,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/armor.webp",
    name: InventoryItemName.Chainmail,
  },
  PlateArmor: {
    id: idMaker(),
    slot: EquipmentSlot.Body,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/armor.webp",
    name: InventoryItemName.PlateArmor,
  },
  MysticRobe: {
    id: idMaker(),
    slot: EquipmentSlot.Body,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/armor.webp",
    name: InventoryItemName.MysticRobe,
  },
  PowerSuit: {
    id: idMaker(),
    slot: EquipmentSlot.Body,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/armor.webp",
    name: InventoryItemName.PowerSuit,
  },
  DragonScaleArmor: {
    id: idMaker(),
    slot: EquipmentSlot.Body,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/armor.webp",
    name: InventoryItemName.DragonScaleArmor,
    effects: [{ type: "element", element: Element.Fire, nature: "absorb", power: 10 }],
  },
  DarkCloak: {
    id: idMaker(),
    slot: EquipmentSlot.Body,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/armor.webp",
    name: InventoryItemName.DarkCloak,
  },
  BlackRobe: {
    id: idMaker(),
    slot: EquipmentSlot.Body,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/armor.webp",
    name: InventoryItemName.BlackRobe,
  },
  WhiteCape: {
    id: idMaker(),
    slot: EquipmentSlot.Body,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/armor.webp",
    name: InventoryItemName.WhiteCape,
  },

  // head
  MythrilHelm: {
    id: idMaker(),
    slot: EquipmentSlot.Head,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/helmet.webp",
    name: InventoryItemName.MythrilHelm,
  },
  WizardHat: {
    id: idMaker(),
    slot: EquipmentSlot.Head,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/helmet.webp",
    name: InventoryItemName.WizardHat,
    effects: [{ type: "attribute", attribute: AttributeName.Wisdom, power: 5 }],
  },

  // shield
  CrystalShield: {
    id: idMaker(),
    slot: EquipmentSlot.Shield,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/shieldplus.webp",
    name: InventoryItemName.CrystalShield,
  },

  // feet
  HunterBoots: {
    id: idMaker(),
    slot: EquipmentSlot.Feet,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/claws.webp",
    name: InventoryItemName.HunterBoots,
  },

  // accessory
  SoulPendant: {
    id: idMaker(),
    slot: EquipmentSlot.Accessory,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/pendant.webp",
    name: InventoryItemName.SoulPendant,
  },
  Grimoire: {
    id: idMaker(),
    slot: EquipmentSlot.Accessory,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/pendant.webp",
    name: InventoryItemName.Grimoire,
  },
  DiamondBracelet: {
    id: idMaker(),
    slot: EquipmentSlot.Accessory,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/pendant.webp",
    name: InventoryItemName.DiamondBracelet,
  },
  GoldenGauntlet: {
    id: idMaker(),
    slot: EquipmentSlot.Accessory,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/pendant.webp",
    name: InventoryItemName.GoldenGauntlet,
  },
  AngelWing: {
    id: idMaker(),
    slot: EquipmentSlot.Accessory,
    type: InventoryItemType.Equipment,
    imgURL: "/public/icons/pendant.webp",
    name: InventoryItemName.AngelWing,
  },
};

const INVENTORY_LIST: InventoryItem[] = [
  {
    id: idMaker(),
    name: InventoryItemName.Potion,
    type: InventoryItemType.Consumable,
    imgURL: "/public/icons/potion.webp",
    quantity: 3,
  },
  {
    id: idMaker(),
    name: InventoryItemName.Ether,
    type: InventoryItemType.Consumable,
    imgURL: "/public/icons/ether.webp",
    quantity: 2,
  },
  {
    id: idMaker(),
    name: InventoryItemName.PhoenixDown,
    type: InventoryItemType.Consumable,
    imgURL: "/public/icons/phoenixdown.webp",
    quantity: 4,
  },
  // { ...EQUIPMENT_ITEM_DICT[InventoryItemName.Potion]!, quantity: 5 },
  // { ...EQUIPMENT_ITEM_DICT[InventoryItemName.Ether]!, quantity: 2 },
  // { ...EQUIPMENT_ITEM_DICT[InventoryItemName.Grenade]!, quantity: 2 },
  // { ...EQUIPMENT_ITEM_DICT[InventoryItemName.PhoenixDown]!, quantity: 3 },
  { ...EQUIPMENT_ITEM_DICT[InventoryItemName.ShortSword]!, quantity: 2 },
  { ...EQUIPMENT_ITEM_DICT[InventoryItemName.HunterBow]!, quantity: 1 },
  { ...EQUIPMENT_ITEM_DICT[InventoryItemName.CrystalShield]!, quantity: 2 },
  { ...EQUIPMENT_ITEM_DICT[InventoryItemName.LeatherArmor]!, quantity: 2 },
  { ...EQUIPMENT_ITEM_DICT[InventoryItemName.MythrilHelm]!, quantity: 2 },
  { ...EQUIPMENT_ITEM_DICT[InventoryItemName.SoulPendant]!, quantity: 3 },
  { ...EQUIPMENT_ITEM_DICT[InventoryItemName.HunterBoots]!, quantity: 2 },
];

const DUNGEON_MAPS = [
  {
    name: "sandbox",
    map: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1],
    ],
  },
];

export {
  INVENTORY_LIST,
  ENEMY_LIST,
  HERO_LIST,
  STATUS_DICT,
  DETAILED_ACTION_DICT,
  SIMPLE_ACTION_DICT,
  STATUS_ICONS,
  EQUIPMENT_ITEM_DICT,
  DUNGEON_MAPS,
};
