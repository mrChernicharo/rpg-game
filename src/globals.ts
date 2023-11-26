// function getCurrentCharacter() {
//   const timelineCharacters = timeline.filter(
//     (event) => event.type === "character"
//   );

//   const currentCharacter = allCharacters.find(
//     (c) => c.id === timelineCharacters[0].entity.id
//   )!;
//   console.log("currentCharacter", currentCharacter.name, allCharacters);

//   return currentCharacter;
// }

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

// function cleanupSelectedItem() {
//   const temp = { ...selectedItem };
//   selectedItem = null;
//   return temp as InventoryItem;
// }

// function subtractFromInventory(item: InventoryItem) {
//   const itemIdx = inventory.findIndex((obj) => obj.id === item.id)!;
//   const inventoryItem = inventory[itemIdx];

//   if (inventoryItem?.quantity === 1) {
//     inventory.splice(itemIdx, 1);
//   } else {
//     inventoryItem.quantity--;
//   }

//   console.log("inventory", inventory);
// }

// function initializeStatuses() {
//   allStatuses = STATUS_LIST as Status[];
// }

// function initializeTimeline() {
//   const initialStatusTurns: StatusTurn[] = allStatuses.map((s) => ({
//     type: "status",
//     entity: { id: s.id, name: s.name, type: "status" },
//     turnDuration: calcTurnDuration(s.speed),
//     nextTurnAt: calcTurnDuration(s.speed),
//     turnsPlayed: 0,
//     characterId: s.characterId,
//     turnCount: s.turnCount,
//   }));

//   const initialCharacterTurns: CharacterTurn[] = allCharacters.map((c) => ({
//     type: "character",
//     entity: { id: c.id, name: c.name, type: getCharacterById(c.id)!.type },
//     turnDuration: calcTurnDuration(c.speed),
//     nextTurnAt: calcTurnDuration(c.speed),
//     turnsPlayed: 0,
//   }));

//   timeline = [...initialCharacterTurns, ...initialStatusTurns].sort(
//     (a, b) => a.nextTurnAt - b.nextTurnAt
//   );

//   drawTimeline();
// }

// async function startBattle() {
//   setBattleState(BattleState.Dormant);
//   setPlayerAction(PlayerAction.None);

//   initializeStatuses();
//   initializeCharacters();

//   drawCharacters();
//   drawBottomPane(panes.text("Battle Start!"));
//   await wait(1000);
//   drawBottomPane(panes.text("Get ready"));
//   await wait(1000);

//   initializeTimeline();

//   console.log({ timelineZero: timeline[0] });

//   if (timeline[0].type === "character") {
//     const character = getCurrentCharacter();
//     await handleCharacterTurn(character);
//   } else if (timeline[0].type === "status") {
//     const status = allStatuses.find((s) => s.id === timeline[0].entity.id)!;
//     const character = getCharacterById(status?.characterId)!;
//     await handleStatusTurn(status, character);
//   }
// }

// function setBattleState(state: BattleState) {
//   battleState = state;
//   console.log(`%cBattleState ::: ${battleState}`, "color: lightgreen");
// }

// function setPlayerAction(action: PlayerAction) {
//   playerAction = action;
//   // console.trace("setPlayerAction");
//   console.log(`%cPlayerAction ::: ${playerAction}`, "color: lightblue");
// }

// function setSelectedItem(item: InventoryItem) {
//   selectedItem = item;
// }
