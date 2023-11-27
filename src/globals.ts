import { ENEMY_LIST, HERO_LIST, INVENTORY_LIST } from "./data";
import { InventoryItemName, StatusName } from "./enums";
import { Character, Turn, InventoryItem, CurrentActionData, Status } from "./types";
import { rowDice } from "./utils";

export let turnCount = 0;
export let allCharacters: Character[] = [...ENEMY_LIST, ...HERO_LIST];
export let timeline: Turn[] = [];
export let inventory: InventoryItem[] = [...INVENTORY_LIST];
export let currentActionData: CurrentActionData = {
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
export function setShouldSelectTarget(targetSelectionActive: boolean) {
  shouldSelectTarget = targetSelectionActive;
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
