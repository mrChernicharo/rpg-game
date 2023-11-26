import {
  ActionName,
  AttackName,
  Col,
  Element,
  InventoryItemName,
  InventoryItemType,
  Lane,
  MagicSpellName,
} from "./enums";

export type Position = {
  lane: Lane;
  col: Col;
};

export type ActionTarget =
  | "self"
  | "single"
  | "vert"
  | "horiz"
  | "party"
  | "all";

export type Spell = {
  name: MagicSpellName;
  power: number;
  mpCost: number;
  element?: Element;
};

export type Attack = {
  name: AttackName;
  power: number;
  ranged?: boolean;
  element?: Element;
};

export type Action =
  | (
      | { type: "other" }
      | { type: "physical"; attack: Attack }
      | { type: "magical"; spell: Spell }
    ) & {
      targets: ActionTarget;
    };

export type Character = {
  id: string;
  name: string;
  type: "hero" | "enemy" | "npc";
  hp: number;
  speed: number;
  imgUrl: string;
  position: Position;
  statuses: string[];
  actions: ActionName[];
  skills: {
    attack: AttackName[];
    magic: MagicSpellName[];
    invoke?: string[];
    summon?: string[];
  };
};

export type Status = {
  id: string;
  name: string;
  characterId: string;
  turnsPlayed: number;
  turnCount: number;
  speed: number;
  power: number;
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

export type InventoryItem = {
  id: string;
  name: InventoryItemName;
  type: InventoryItemType;
  quantity: number;
};

export type PaneInfo =
  | { type: "none"; content: undefined }
  | { type: "text"; content: string }
  | {
      type: "list";
      content: {
        text: string;
        action: (...args: any) => void;
      }[];
    };
