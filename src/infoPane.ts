import { drawBottomPane } from "./draw";
import {
  setBattleState,
  setPlayerAction,
  getCharacterById,
  timeline,
  setSelectedItem,
  inventory,
} from "./globals";
import { InventoryItem, BattleState, PlayerAction, PaneInfo } from "./types";

const inventoryItems = (itemList: InventoryItem[]) =>
  itemList
    .filter((item) => item.type === "consumable")
    .map((item) => ({
      text: `${item.name} x${item.quantity}`,
      action: () => {
        console.log("item selected", item);
        setSelectedItem(item);

        setBattleState(BattleState.ItemTargetSelect);
        drawBottomPane(panes.itemTargetSelection(item.name), true);
      },
    }));

const heroActionItems = (...args: any) => [
  {
    text: "attack",
    action: () => {
      console.log("clicked attack", ...args);

      setBattleState(BattleState.AttackTargetSelection);
      drawBottomPane(panes.attackTargetSelection(), true);

      // now hero needs to select a target to complete attack action
      // or dismiss attack action
    },
  },
  {
    text: "defend",
    action: () => {
      console.log("clicked defend", ...args);

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
      console.log("clicked item", ...args);

      setPlayerAction(PlayerAction.Item);

      setBattleState(BattleState.ItemSelection);
      drawBottomPane(panes.itemSelection(inventory), true);

      // now hero needs to select an item to complete item action
      // or dismiss item action
    },
  },
];

const panes: { [k: string]: (...args: any) => PaneInfo } = {
  getReady: () => ({ type: "text", content: "Get Ready!" }),
  battleStart: () => ({ type: "text", content: "Battle Start!" }),
  battleWon: () => ({ type: "text", content: "Battle Won!" }),
  battleLost: () => ({ type: "text", content: "Battle Lost!" }),
  enemyAction: (message: string) => ({
    type: "text",
    content: message,
  }),
  enemyAttack: (message: string) => ({
    type: "text",
    content: message,
  }),
  heroActions: (args: any) => ({
    type: "list",
    content: heroActionItems(args),
  }),
  itemSelection: (args: any) => ({
    type: "list",
    content: inventoryItems(args),
  }),
  itemAttackTargetSelection: (itemName: string) => ({
    type: "text",
    content: `who is getting the ${itemName}?`,
  }),
  itemUse: (message: string) => ({
    type: "text",
    content: message,
  }),
  attackTargetSelection: () => ({
    type: "text",
    content: `Select Target`,
  }),
  heroAttack: (message: string) => ({
    type: "text",
    content: message,
  }),
};

export { panes };
