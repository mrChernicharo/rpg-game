import { allCharacters } from "./globals";

export enum BattleState {
  Dormant = "dormant",
  Idle = "idle",
  HeroAction = "hero-action",
  AttackTargetSelection = "attack-target-selection",
  HeroAttack = "hero-attack",
  ItemSelection = "item-selection",
  ItemTargetSelect = "item-target-selection",
  ItemUse = "item-use",
  EnemyAction = "enemy-action",
  EnemyAttack = "enemy-attack",
  Paused = "paused",
  Ended = "ended",
}

export enum PlayerAction {
  Attack = "attack",
  Item = "item",
  Defend = "defend",
  None = "none",
}

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
  name: string;
  type: "equipment" | "consumable";
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
