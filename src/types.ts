import { Col, InventoryItemName, InventoryItemType, Lane } from "./enums";

export type Position = {
  lane: Lane;
  col: Col;
};

export type Character = {
  id: string;
  name: string;
  type: "hero" | "enemy" | "npc";
  hp: number;
  speed: number;
  imgUrl: string;
  position: Position;
  actions: {
    attack: { type: string; power: number };
  };
  statuses: string[];
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
  type: string; // "hero" | "enemy" | "status";
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
