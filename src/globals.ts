import { ENEMY_LIST, HERO_LIST, INVENTORY_LIST, DETAILED_ACTION_DICT, SIMPLE_ACTION_DICT } from "./data";
import { battleUI, getSlotElementById, slots } from "./dom";
import { ActionName, InventoryItemName, StatusName } from "./enums";
import { Character, Turn, InventoryItem, TurnInfo, Status, Action } from "./types";
import { rowDice } from "./utils";

export let turnCount = 0;
export let allCharacters: Character[] = [...ENEMY_LIST, ...HERO_LIST];
export let timeline: Turn[] = [];
export let inventory: InventoryItem[] = [...INVENTORY_LIST];
export let currentTurnInfo: TurnInfo = {
  character: null,
  actionDetail: null, // stab | fire | potion | poison
  actionName: null, // attack | magic | steal | status
  actionTarget: null,
  isStatusAction: false,
};
export let shouldSelectTarget = false;

export function getTimeline() {
  return timeline;
}
export function getAllCharacters() {
  return allCharacters;
}
export function incrementTurnCount() {
  turnCount++;
}
export function getShouldSelectTarget() {
  return shouldSelectTarget;
}
export function getPossibleTargets() {
  const { actionName, actionDetail, character } = currentTurnInfo;
  console.log("getPossibleTargets", { currentTurnInfo });

  let action: Action;

  if (actionName === ActionName.Attack || !actionDetail) {
    action = SIMPLE_ACTION_DICT[actionName!]!;
  } else {
    action = DETAILED_ACTION_DICT[actionName!]![actionDetail];
  }

  const [enemiesInTheFront, enemiesInTheBack, allHeroesButMe] = [
    getAllEnemies().filter((e) => e.position.lane === "front" && e.hp > 0),
    getAllEnemies().filter((e) => e.position.lane === "back" && e.hp > 0),
    getAllHeroes().filter((h) => h.id !== character!.id && h.hp > 0),
  ];

  switch (action.type) {
    case "melee":
      if (enemiesInTheFront.length > 0) {
        return [...enemiesInTheFront, ...getAllHeroes()];
      } else {
        return [...enemiesInTheBack, ...getAllHeroes()];
      }
    case "ranged":
    case "item":
    case "magical":
      return [...enemiesInTheFront, ...enemiesInTheBack, ...getAllHeroes()];
    case "defend":
    case "move":
      return [character!];
    case "steal":
      if (enemiesInTheFront.length > 0) {
        return [...enemiesInTheFront];
      } else {
        return [...enemiesInTheBack];
      }
    // case "invoke":
    // case "summon":
    default:
      return getAllCharacters();
  }
}

// function chooseTargetForEnemy(enemy: Character): Character {
//   let possibleTargets: Character[];
//   const heroes = getAllHeroes();

//   if (enemy.actions.attack.type === "ranged") {
//     possibleTargets = [...heroes].filter((h) => h.hp > 0);
//   } else if (enemy.actions.attack.type === "melee") {
//     const [heroesInTheFront, heroesInTheBack] = [
//       heroes.filter((h) => h.position.lane === "front" && h.hp > 0),
//       heroes.filter((h) => h.position.lane === "back" && h.hp > 0),
//     ];
//     if (heroesInTheFront.length > 0) {
//       possibleTargets = [...heroesInTheFront];
//     } else {
//       possibleTargets = [...heroesInTheBack];
//     }
//   } else {
//     possibleTargets = [...heroes].filter((h) => h.hp > 0);
//   }

//   const idx = Math.floor(Math.random() * possibleTargets.length);
//   return possibleTargets[idx];
// }

export function setShouldSelectTarget(targetSelectionActive: boolean) {
  shouldSelectTarget = targetSelectionActive;

  if (shouldSelectTarget) {
    battleUI?.classList.add(`ready-to-act`);
    const possibleTargets = getPossibleTargets();

    possibleTargets.forEach((char) => {
      const slot = getSlotElementById(char.id);
      slot.classList.add("selectable-target");
    });
  } else {
    battleUI?.classList.remove(`ready-to-act`);
    slots.forEach((s) => {
      if (s.classList.contains("selectable-target")) {
        s.classList.remove("selectable-target");
      }
    });
  }
}
export function setTimeline(turns: Turn[]) {
  timeline = turns;
}
export function getCharacterById(id: string): Character {
  return getAllCharacters().find((c) => c.id === id)!;
}
export function getCharacterStatusIdxByName(characterId: string, statusName: StatusName) {
  const character = getAllCharacters().find((char) => char.id === characterId);
  if (!character) throw Error(`should've been able to find the user`);
  return character.statuses.findIndex((s) => s.name === statusName);
}
export function getAllHeroes() {
  const allHeroes = [];
  for (const char of allCharacters) {
    if (char.type === "hero") {
      allHeroes.push(char);
    }
  }
  return allHeroes;
}
export function getAllEnemies() {
  const allEnemies = [];
  for (const char of allCharacters) {
    if (char.type === "enemy") {
      allEnemies.push(char);
    }
  }
  return allEnemies;
}
export function subtractFromInventory(itemName: InventoryItemName) {
  const itemIdx = inventory.findIndex((obj) => obj.name === itemName)!;
  const inventoryItem = inventory[itemIdx];

  if (inventoryItem?.quantity === 1) {
    inventory.splice(itemIdx, 1);
  } else {
    inventoryItem.quantity--;
  }

  console.log("inventory", inventory);
}
export function addInventoryItem(itemName: InventoryItemName) {
  const itemIdx = inventory.findIndex((obj) => obj.name === itemName)!;
  const inventoryItem = inventory[itemIdx];

  if (inventoryItem?.quantity > -1) {
    inventoryItem.quantity++;
    // inventory.splice(itemIdx, 1);
  } else {
    const newInventoryItem = INVENTORY_LIST.find((item) => item.name === itemName)!;
    inventory.push({ ...newInventoryItem });
  }
}
export function performStealAttempt(actor: Character, target: Character) {
  const result = rowDice(20);

  if (result <= 10) return null;
  else if (result > 10 && result <= 14) return INVENTORY_LIST[0].name;
  else if (result > 14 && result <= 17) return INVENTORY_LIST[1].name;
  else return INVENTORY_LIST[2].name;
}
export function getDefenseStatusIdx(statusList: Status[]) {
  const defenseStatusIdx = statusList.findIndex((s) => s.name === StatusName.Defense);
  return defenseStatusIdx;
}
