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
} from "./enums";

export type Position = {
  lane: Lane;
  col: Col;
};

export type MenuState = {
  selectedHero: Character | null;
};

export type HeroAttributes = {
  strength: number; // melee attack
  dexterity: number; // ranged attack
  intelligence: number; // magic attack
  agility: number; // speed
  vigor: number; // physical defense
  wisdom: number; // magic defense
  luck: number;
};

export type HeroEquipment = {
  head: EquipmentItem | null;
  weapon: EquipmentItem | null;
  shield: EquipmentItem | null;
  body: EquipmentItem | null;
  feet: EquipmentItem | null;
  accessory: EquipmentItem | null;
  accessory2: EquipmentItem | null;
};

export type Character = {
  id: string;
  name: string;
  level: number;
  hp: number;
  mp: number;
  speed: number;
  imgUrl: string;
  position: Position;
  statuses: Status[];
  actions: ActionName[];
  abilities: {
    [ActionName.Magic]?: MagicSpellName[];
    [ActionName._Attack]?: _AttackName[];
    [ActionName.Invoke]?: string[];
    [ActionName.Summon]?: string[];
  };
} & (
  | { type: "hero"; xp: number; attributes: HeroAttributes; equipment: HeroEquipment }
  | { type: "enemy" }
  | { type: "npc" }
);

export type ActionTarget = "self" | "single" | "vert" | "horiz" | "party" | "all";

export type Action = (
  | {
      name: MagicSpellName;
      type: "magical";
      mpCost: number;
      power?: number;
      effects?: StatusName[];
      element?: Element;
    }
  | {
      type: "status";
      name: StatusName;
      turnsPlayed: number;
      turnCount: number;
      speed?: number;
      power?: number;
    }
  | {
      name: InventoryItemName;
      type: "item";
    }
  | {
      name: ActionName.Attack;
      type: "melee" | "ranged";
    }
  | {
      name: ActionName.Steal;
      type: "steal";
    }
  | {
      name: ActionName.Defend;
      type: "defend";
    }
  | {
      name: ActionName.Hide;
      type: "hide";
    }
  | {
      name: ActionName.Move;
      type: "move";
    }
  | {
      name: _AttackName;
      type: "melee" | "ranged";
      power: number;
      element?: Element;
    }
) & {
  targets: ActionTarget;
};

export type Status = {
  name: StatusName;
  turnsPlayed: number;
  turnCount: number;
  speed?: number;
  power?: number;
};

export type TurnEntity = {
  id: string;
  name: string;
  type: "hero" | "enemy" | "npc" | "status";
};

export type TurnBase = {
  entity: TurnEntity;
  turnDuration: number;
  nextTurnAt: number;
  turnsPlayed: number;
};
export type CharacterTurnBase = {
  type: "character";
};
export type StatusTurnBase = {
  type: "status";
  turnCount: number;
  characterId: string;
};

export type CharacterTurn = TurnBase & CharacterTurnBase;
export type StatusTurn = TurnBase & StatusTurnBase;
export type Turn = CharacterTurn | StatusTurn;

export type ConsumableItem = {
  id: string;
  name: InventoryItemName;
  type: InventoryItemType.Consumable;
  imgURL: string;
};

export type EquipmentItem = {
  id: string;
  name: InventoryItemName;
  type: InventoryItemType.Equipment;
  imgURL: string;
  slot: EquipmentSlot;
};

export type EquipmentItemWithQuantity = EquipmentItem & { quantity: number };

export type KeyItem = {
  id: string;
  name: InventoryItemName;
  type: InventoryItemType.Key;
  imgURL: string;
};

export type InventoryItem = (ConsumableItem | EquipmentItem | KeyItem) & {
  quantity: number;
};

export type PaneInfo =
  | { type: "none" }
  | { type: "text"; content: string }
  | {
      type: "list";
      content: {
        text: string;
        action: (...args: any) => void;
      }[];
    };

export type TurnInfo = {
  character: Character | null;
  actionName: ActionName | null;
  actionDetail: string | null;
  isStatusAction: boolean;
  actionTarget: Character | null;
};
