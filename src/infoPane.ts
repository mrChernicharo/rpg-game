import { drawBottomPane } from "./draw";
import { BattleState, PlayerAction } from "./enums";
import {
  setBattleState,
  setPlayerAction,
  getCharacterById,
  timeline,
  setSelectedItem,
  inventory,
} from "./globals";
import { Character, InventoryItem, PaneInfo } from "./types";

const inventoryItems = (itemList: InventoryItem[]) =>
  itemList
    .filter((item) => item.type === "consumable")
    .map((item) => ({
      text: `${item.name} x${item.quantity}`,
      action: () => {
        console.log("item selected", item);

        setSelectedItem(item);
        setBattleState(BattleState.ItemTargetSelect);

        const message = `who is getting the ${item.name}?`;
        drawBottomPane(panes.itemTargetSelection(message), true);
      },
    }));

const heroActionItems = () => [
  {
    text: "attack",
    action: () => {
      console.log("clicked attack");

      setBattleState(BattleState.AttackTargetSelection);
      drawBottomPane(panes.attackTargetSelection(), true);

      // now hero needs to select a target to complete attack action
      // or dismiss attack action
    },
  },
  {
    text: "defend",
    action: () => {
      console.log("clicked defend");

      setPlayerAction(PlayerAction.Defend);

      window.dispatchEvent(
        new CustomEvent("hero-defense", {
          detail: { hero: getCharacterById(timeline[0].entity.id) },
        })
      );
    },
  },
  {
    text: "item",
    action: () => {
      console.log("clicked item");

      setPlayerAction(PlayerAction.Item);

      setBattleState(BattleState.ItemSelection);
      drawBottomPane(panes.itemSelection(inventory), true);

      // now hero needs to select an item to complete item action
      // or dismiss item action
    },
  },
];

export type Panes = {
  getReady: () => PaneInfo;
  battleStart: () => PaneInfo;
  enemyAction: (message: string) => PaneInfo;
  enemyAttack: (message: string) => PaneInfo;
  heroActions: (hero: Character) => PaneInfo;
  heroAttack: (message: string) => PaneInfo;
  attackTargetSelection: () => PaneInfo;
  itemSelection: (args: any) => PaneInfo;
  itemTargetSelection: (message: string) => PaneInfo;
  itemUse: (message: string) => PaneInfo;
  battleWon: () => PaneInfo;
  battleLost: () => PaneInfo;
};

const panes: Panes = {
  getReady: () => ({ type: "text", content: "Get Ready!" }),
  battleStart: () => ({ type: "text", content: "Battle Start!" }),
  battleWon: () => ({ type: "text", content: "Battle Won!" }),
  battleLost: () => ({ type: "text", content: "Battle Lost!" }),
  enemyAction: (message: string) => ({ type: "text", content: message }),
  enemyAttack: (message: string) => ({ type: "text", content: message }),
  heroActions: () => ({ type: "list", content: heroActionItems() }),
  itemSelection: (args: any) => ({
    type: "list",
    content: inventoryItems(args),
  }),
  itemTargetSelection: (message: string) => ({
    type: "text",
    content: message,
  }),
  itemUse: (message: string) => ({ type: "text", content: message }),
  attackTargetSelection: () => ({ type: "text", content: `Select Target` }),
  heroAttack: (message: string) => ({ type: "text", content: message }),
};

export { panes };
