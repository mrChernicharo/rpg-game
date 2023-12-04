import { HERO_LIST } from "../../data/computed";
import { ENEMY_LIST, INVENTORY_LIST, DETAILED_ACTION_DICT, SIMPLE_ACTION_DICT } from "../../data/static";
import { battleUI, getSlotElementById, slots } from "../../shared/dom";
import { ActionName, InventoryItemName, Lane, StatusName } from "../../shared/enums";
import { Character, Turn, InventoryItem, TurnInfo, Status, Action, CharacterTurn } from "../../shared/types";
import { rowDice } from "../../shared/utils";

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
export function setTimeline(turns: Turn[]) {
  timeline = turns;
}
export function incrementTurnCount() {
  turnCount++;
}

export function getAllCharacters() {
  return allCharacters;
}
export function getAllCharactersAlive() {
  return allCharacters.filter((c) => c.hp > 0);
}

export function getAllHeroes() {
  const allHeroes = [];
  for (const char of getAllCharacters()) {
    if (char.type === "hero") {
      allHeroes.push(char);
    }
  }
  return allHeroes;
}
export function getAllHeroesAlive() {
  return getAllHeroes().filter((h) => h.hp > 0);
}

export function getAllEnemies() {
  const allEnemies: Character[] = [];
  for (const char of allCharacters) {
    if (char.type === "enemy") {
      allEnemies.push(char);
    }
  }
  return allEnemies;
}
export function getAllEnemiesAlive() {
  return getAllEnemies().filter((e) => e.hp > 0);
}

export function getAllDeadHeroes() {
  return getAllHeroes().filter((h) => h.hp <= 0);
}
export function getAllDeadEnemies() {
  return getAllEnemies().filter((e) => e.hp <= 0);
}

export function getShouldSelectTarget() {
  return shouldSelectTarget;
}
export function getPossibleTargets() {
  const { actionName, actionDetail, character } = currentTurnInfo;
  console.log("getPossibleTargets", { currentTurnInfo });

  let action: Action;

  if (!actionDetail) {
    action = SIMPLE_ACTION_DICT[actionName!]!;
  } else {
    action = DETAILED_ACTION_DICT[actionName!]![actionDetail];
  }

  const [aliveEnemiesInTheFront, aliveEnemiesInTheBack] = [
    getAllEnemiesAlive().filter((e) => e.position.lane === Lane.Front),
    getAllEnemiesAlive().filter((e) => e.position.lane === Lane.Back),
  ];

  switch (action.type) {
    case "melee":
      if (aliveEnemiesInTheFront.length > 0) {
        return [...aliveEnemiesInTheFront, ...getAllHeroesAlive()];
      } else {
        return [...aliveEnemiesInTheBack, ...getAllHeroesAlive()];
      }
    case "ranged":
    case "magical":
      return [...getAllEnemiesAlive(), ...getAllHeroesAlive()];
    case "item":
      if (actionDetail === "PhoenixDown") {
        return [...getAllDeadEnemies(), ...getAllDeadHeroes()];
      }

      return [...getAllEnemiesAlive(), ...getAllHeroesAlive()];
    case "defend":
    case "move":
      return [character!];
    case "steal":
      if (aliveEnemiesInTheFront.length > 0) {
        return [...aliveEnemiesInTheFront];
      } else {
        return [...aliveEnemiesInTheBack];
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

export function getCharacterById(id: string): Character {
  return getAllCharacters().find((c) => c.id === id)!;
}
export function getCharacterStatusIdxByName(characterId: string, statusName: StatusName) {
  const character = getAllCharacters().find((char) => char.id === characterId);
  if (!character) throw Error(`should've been able to find the user`);
  return character.statuses.findIndex((s) => s.name === statusName);
}

export function subtractFromInventory(itemName: InventoryItemName) {
  const itemIdx = inventory.findIndex((obj) => obj.name === itemName)!;
  const inventoryItem = inventory[itemIdx];

  // console.log("subtractFromInventory", inventoryItem, inventory);

  if (inventoryItem?.quantity === 1) {
    inventory.splice(itemIdx, 1);
  } else {
    inventoryItem.quantity--;
  }
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
