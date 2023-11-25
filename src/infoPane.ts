import { drawBottomPane } from "./draw";
import { BattleState, PlayerAction } from "./enums";
import {
  setBattleState,
  setPlayerAction,
  setSelectedItem,
  inventory,
  getCurrentCharacter,
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
        drawBottomPane(panes.text(`who is getting the ${item.name}?`), true);
      },
    }));

const heroActionItems = () => [
  {
    text: "attack",
    action: () => {
      console.log("clicked attack");

      setBattleState(BattleState.AttackTargetSelection);
      drawBottomPane(panes.text(`Select Target`), true);

      // now hero needs to select a target to complete attack action
      // or dismiss attack action
    },
  },
  {
    text: "defend",
    action: () => {
      console.log("clicked defend");

      const hero = getCurrentCharacter();
      setPlayerAction(PlayerAction.Defend);
      drawBottomPane(panes.text(`${hero.name} raised its defenses`));

      window.dispatchEvent(
        new CustomEvent("hero-defense", {
          detail: { hero },
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
  heroActions: (hero: Character) => PaneInfo;
  itemSelection: (args: any) => PaneInfo;
  text: (message: string) => PaneInfo;
};

// prettier-ignore
const panes: Panes = {
  text: (message: string) => ({ type: 'text', content: message}),
  heroActions: () => ({ type: "list", content: heroActionItems() }),
  itemSelection: (args: any) => ({ type: "list", content: inventoryItems(args) }),
};

export { panes };
