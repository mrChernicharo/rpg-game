// import { drawBottomPane } from "./draw";
// import { BattleState, PlayerAction } from "./enums";
// import {
//   setBattleState,
//   setPlayerAction,
//   setSelectedItem,
//   inventory,
//   getCurrentCharacter,
// } from "./globals";
// import { Character, InventoryItem, PaneInfo } from "./types";

import { ActionName, InventoryItemType } from "./enums";
import { Character, InventoryItem, PaneInfo } from "./types";

const inventoryItems = (itemList: InventoryItem[]) =>
  itemList
    .filter((item) => item.type === InventoryItemType.Consumable)
    .map((item) => ({
      text: `${item.name} x${item.quantity}`,
      action: () => {
        console.log("item selected", item);

        window.dispatchEvent(
          new CustomEvent("action-detail-selected", { detail: item.name })
        );
      },
    }));

const heroActionDetailItems = (hero: Character, actionName: ActionName) => {
  switch (actionName) {
    case ActionName.Attack:
    case ActionName.Magic:
    case ActionName.Summon:
    case ActionName.Invoke:
      return hero.skills[actionName]!.map((skill) => ({
        text: skill,
        action: () => {
          console.log("action detail selected", skill);

          window.dispatchEvent(
            new CustomEvent("action-detail-selected", { detail: skill })
          );
        },
      }));
    default:
      return [];
  }
};

const heroActionItems = (hero: Character) => {
  return hero.actions.map((action) => ({
    text: action,
    action: () => {
      window.dispatchEvent(
        new CustomEvent("action-selected", { detail: action })
      );
    },
  }));
};

// const heroActionItems = (hero: Character) => [
//   {
//     text: "attack",
//     action: () => {
//       console.log("clicked attack");

//       // setBattleState(BattleState.AttackTargetSelection);
//       // drawBottomPane(panes.text(`Select Target`), true);

//       // now hero needs to select a target to complete attack action
//       // or dismiss attack action
//     },
//   },
//   {
//     text: "defend",
//     action: () => {
//       console.log("clicked defend");

//       // const hero = getCurrentCharacter();

//       // window.dispatchEvent(
//       //   new CustomEvent("hero-defense", {
//       //     detail: { hero },
//       //   })
//       // );
//     },
//   },
//   {
//     text: "item",
//     action: () => {
//       console.log("clicked item");

//       // setPlayerAction(PlayerAction.Item);

//       // setBattleState(BattleState.ItemSelection);
//       // drawBottomPane(panes.itemSelection(inventory), true);

//       // now hero needs to select an item to complete item action
//       // or dismiss item action
//     },
//   },
// ];

export type Panes = {
  heroActions: (hero: Character) => PaneInfo;
  heroActionDetail: (hero: Character, action: ActionName) => PaneInfo;
  itemSelection: (args: InventoryItem[]) => PaneInfo;
  text: (message: string) => PaneInfo;
};

// prettier-ignore
const panes: Panes = {
  text: (message: string) => ({ type: 'text', content: message}),
  heroActions: (hero: Character) => ({ type: "list", content: heroActionItems(hero) }),
  heroActionDetail: (hero: Character, actionName: ActionName) => ({ type: "list", content: heroActionDetailItems(hero, actionName) }),
  itemSelection: (itemList: InventoryItem[]) => ({ type: "list", content: inventoryItems(itemList) }),
};

export { panes };
