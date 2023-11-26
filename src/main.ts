// import { startBattle } from "./globals";

import { ENEMY_LIST, HERO_LIST } from "./data";
import { InventoryItemName, InventoryItemType } from "./enums";
import {
  StatusTurn,
  CharacterTurn,
  Character,
  InventoryItem,
  Turn,
} from "./types";
import { calcTurnDuration, idMaker } from "./utils";

let turnCount = 0;
let allCharacters: Character[] = [...ENEMY_LIST, ...HERO_LIST] as Character[];
let timeline: Turn[] = [];
let inventory: InventoryItem[] = [
  {
    id: idMaker(),
    name: InventoryItemName.Potion,
    type: InventoryItemType.Consumable,
    quantity: 3,
  },
  {
    id: idMaker(),
    name: InventoryItemName.Ether,
    type: InventoryItemType.Consumable,
    quantity: 2,
  },
  {
    id: idMaker(),
    name: InventoryItemName.PhoenixDown,
    type: InventoryItemType.Consumable,
    quantity: 4,
  },
  {
    id: idMaker(),
    name: InventoryItemName.ShortSword,
    type: InventoryItemType.Equipment,
    quantity: 1,
  },
];

function incrementTurnCount() {
  turnCount++;
}

function getAllHeroes() {
  const allHeroes = [];
  for (const char of allCharacters) {
    if (char.type === "hero") {
      allHeroes.push(char);
    }
  }
  return allHeroes;
}

function getAllEnemies() {
  const allEnemies = [];
  for (const char of allCharacters) {
    if (char.type === "enemy") {
      allEnemies.push(char);
    }
  }
  return allEnemies;
}

function getCharacterById(id: string): Character {
  return allCharacters.find((c) => c.id === id)!;
}

async function initializeTimeline() {
  const initialCharacterTurns: CharacterTurn[] = allCharacters.map((c) => ({
    type: "character",
    entity: { id: c.id, name: c.name, type: getCharacterById(c.id)!.type },
    turnDuration: calcTurnDuration(c.speed),
    nextTurnAt: calcTurnDuration(c.speed),
    turnsPlayed: 0,
  }));
  timeline = [...initialCharacterTurns].sort(
    (a, b) => a.nextTurnAt - b.nextTurnAt
  );

  console.log(timeline);
}
async function handleTimelineTurn() {}

async function main() {
  await initializeTimeline();
  await handleTimelineTurn();
}

main();
