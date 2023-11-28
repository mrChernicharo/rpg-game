import { ActionName, InventoryItemType } from "./enums";
import { Character, InventoryItem, PaneInfo } from "./types";

const inventoryItems = (itemList: InventoryItem[]) =>
  itemList
    .filter((item) => item.type === InventoryItemType.Consumable)
    .map((item) => ({
      text: `${item.name} x${item.quantity}`,
      action: () => {
        console.log("", item);

        window.dispatchEvent(new CustomEvent("action-detail-selected", { detail: item.name }));
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

          window.dispatchEvent(new CustomEvent("action-detail-selected", { detail: skill }));
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
      window.dispatchEvent(new CustomEvent("action-selected", { detail: action }));
    },
  }));
};

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
