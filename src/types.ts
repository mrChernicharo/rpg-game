import { InventoryItemName, InventoryItemType } from "./enums";
import { allCharacters } from "./globals";

export type Character = (typeof allCharacters)[0];

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
  | { type: "text"; content: string }
  | {
      type: "list";
      content: {
        text: string;
        action: (...args: any) => void;
      }[];
    }
  | { type: "none"; content: undefined };
