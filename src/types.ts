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

export type Position = {
  lane: Lane;
  col: Col;
};

export type Character = {
  id: string;
  name: string;
  type: "hero" | "enemy" | "npc";
  hp: number;
  mp: number;
  speed: number;
  imgUrl: string;
  position: Position;
  statuses: Status[];
  actions: ActionName[];
  skills: {
    [ActionName.Attack]: AttackName[];
    [ActionName.Magic]: MagicSpellName[];
    [ActionName.Invoke]?: string[];
    [ActionName.Summon]?: string[];
  };
};

export type ActionTarget = "self" | "single" | "vert" | "horiz" | "party" | "all";

// export type Spell = {
//   name: MagicSpellName;
//   power: number;
//   mpCost: number;
//   element?: Element;
// };

// export type Attack = {
//   name: AttackName;
//   power: number;
//   ranged?: boolean;
//   element?: Element;
// };

export type Action = (
  | {
      name: AttackName;
      type: "melee" | "ranged";
      power: number;
      ranged?: boolean;
      element?: Element;
    }
  | {
      name: MagicSpellName;
      type: "magical";
      mpCost: number;
      power?: number;
      effects?: StatusName[];
      element?: Element;
    }
  | {
      name: InventoryItemName;
      type: "item";
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
      name: string;
      type: "other";
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

export type InventoryItem = {
  id: string;
  name: InventoryItemName;
  type: InventoryItemType;
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

export type CurrentActionData = {
  character: Character | null;
  actionName: ActionName | null;
  actionDetail: string | null;
  isStatusAction: boolean;
  actionTarget: Character | null;
};
