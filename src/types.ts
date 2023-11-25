import { Col, InventoryItemName, InventoryItemType, Lane } from "./enums";

export type Position = {
  lane: Lane;
  col: Col;
};

export type Character = {
  id: string;
  name: string;
  type: string;
  hp: number;
  speed: number;
  imgUrl: string;
  position: Position;
  lastAction: string;
  actions: {
    attack: { type: string; power: number };
  };
};

export type Turn = {
  entity: {
    id: string;
    name: string;
  };
  turnDuration: number;
  nextTurnAt: number;
  turnsPlayed: number;
};

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
