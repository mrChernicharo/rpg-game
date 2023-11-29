import { ActionName, InventoryItemType } from "../enums";
import { Character, InventoryItem, PaneInfo } from "../types";

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

const heroActionAbilityItems = (hero: Character, actionName: ActionName) => {
  switch (actionName) {
    case ActionName._Attack:
    case ActionName.Magic:
    case ActionName.Summon:
    case ActionName.Invoke:
      return hero.abilities[actionName]!.map((ability) => ({
        text: ability,
        action: () => {
          console.log("action detail selected", ability);
          window.dispatchEvent(new CustomEvent("action-detail-selected", { detail: ability }));
        },
      }));
    default:
      return [];
  }
};

const heroActionItems = (hero: Character) => {
  console.log(hero.actions);
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
  heroActionDetail: (hero: Character, actionName: ActionName) => ({ type: "list", content: heroActionAbilityItems(hero, actionName) }),
  itemSelection: (itemList: InventoryItem[]) => ({ type: "list", content: inventoryItems(itemList) }),
};

export { panes };
