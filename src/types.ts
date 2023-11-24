import { allCharacters } from "./globals";

export enum BattleState {
  Dormant = "dormant",
  Idle = "idle",
  HeroAction = "hero-action",
  TargetSelection = "target-selection",
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

export type PaneInfo =
  | { type: "text"; content: string }
  | {
      type: "list";
      content: { text: string; action: (...args: any) => void }[];
    }
  | { type: "none"; content: undefined };
