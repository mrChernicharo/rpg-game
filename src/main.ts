import "./style.css";
import { getSlotOverlayElementById, slots, dismissBtn } from "./dom";
import { calculateNextTurnTime, wait } from "./utils";
import {
  battleState,
  timeline,
  playerAction,
  turnCount,
  allCharacters,
  heroes,
  panes,
  setBattleState,
  setPlayerAction,
  incrementTurnCount,
  initializeTimeline,
  setCurrentTurn,
  selectedItem,
  cleanupSelectedItem,
  subtractFromInventory,
  enemies,
} from "./globals";
import { BattleState, PlayerAction, Character } from "./types";
import {
  drawTimeline,
  drawSelectedCharacterOutline,
  drawAttackEffect,
  drawCharacters,
  drawTurnCount,
  drawDefenseEffect,
  drawBottomPane,
  drawItemEffect,
} from "./draw";

window.addEventListener(
  "hero-attack-target-selected",
  onHeroAttackTargetSelected
);
window.addEventListener("hero-defense", onHeroDefense);
window.addEventListener("item-target-selected", onItemTargetSelected);

slots.forEach((slot) => {
  slot.addEventListener("click", onSlotClick);
});

dismissBtn.addEventListener("click", (e: MouseEvent) => {
  setBattleState(BattleState.HeroAction);
  const hero = getCharacterById(timeline[0].entity.id);
  drawBottomPane(panes.heroActions(hero));
});

export function getCharacterById(id: string): Character | undefined {
  return allCharacters.find((c) => c.id === id);
}

function onSlotClick(e: MouseEvent) {
  const slot = (e.target as HTMLElement).closest(".lane-slot") as HTMLLIElement;
  const selectedCharacter = getCharacterById(slot.id);
  console.log(":::onSlotClick", slot, selectedCharacter, battleState);

  if (battleState === BattleState.TargetSelection) {
    setPlayerAction(PlayerAction.Attack);
    window.dispatchEvent(
      new CustomEvent("hero-attack-target-selected", {
        detail: { selectedCharacter },
      })
    );
  }

  if (battleState === BattleState.ItemTargetSelect) {
    setPlayerAction(PlayerAction.Item);
    // @TODO: add item info to event payload
    window.dispatchEvent(
      new CustomEvent("item-target-selected", {
        detail: { selectedCharacter },
      })
    );
  }
}

async function onHeroDefense(data: any) {
  const { hero } = data.detail;
  console.log("onHeroDefense", hero);

  await drawDefenseEffect(hero);

  setPlayerAction(PlayerAction.None);

  updateTimeline();
}

async function onHeroAttackTargetSelected(data: any) {
  const { selectedCharacter: target } = data.detail;
  const hero = getCharacterById(timeline[0].entity.id)!;

  console.log("onHeroAttackTargetSelected", {
    target,
    hero,
    playerAction,
  });

  drawBottomPane(panes.heroAttack(`${hero.name} attacks ${target.name}`));
  await handleAttack(hero, target);
  setPlayerAction(PlayerAction.None);
  updateTimeline();
}

async function onItemTargetSelected(data: any) {
  const { selectedCharacter: target } = data.detail;
  const hero = getCharacterById(timeline[0].entity.id)!;

  console.log("onItemTargetSelected", {
    target,
    hero,
    playerAction,
  });

  const message = `${target.name} received ${selectedItem?.name}`;

  setBattleState(BattleState.ItemUse);
  drawBottomPane(panes.itemUse(message));
  const item = cleanupSelectedItem();
  subtractFromInventory(item);
  await drawItemEffect(hero, target);
  setPlayerAction(PlayerAction.None);
  updateTimeline();
}

function chooseTargetForEnemy(enemy: Character): Character {
  let possibleTargets: Character[];

  if (enemy.actions.attack.type === "ranged") {
    possibleTargets = [...heroes].filter((h) => h.hp > 0);
  } else if (enemy.actions.attack.type === "melee") {
    const [heroesInTheFront, heroesInTheBack] = [
      heroes.filter((h) => h.position.lane === "front" && h.hp > 0),
      heroes.filter((h) => h.position.lane === "back" && h.hp > 0),
    ];
    if (heroesInTheFront.length > 0) {
      possibleTargets = [...heroesInTheFront];
    } else {
      possibleTargets = [...heroesInTheBack];
    }
  } else {
    possibleTargets = [...heroes].filter((h) => h.hp > 0);
  }

  const idx = Math.floor(Math.random() * possibleTargets.length);
  return possibleTargets[idx];
}

function updateTimeline(): void {
  if (battleState === BattleState.Ended) return;

  const prevTimeline = timeline.slice();
  const currentTurn = timeline.shift()!;
  setCurrentTurn(currentTurn);

  const nextTurn = {
    ...currentTurn,
    nextTurnAt: calculateNextTurnTime(currentTurn),
    turnsPlayed: currentTurn.turnsPlayed + 1,
  };

  let insertionIdx = timeline.length;
  let smallestPositiveTimeDiff = Infinity;
  for (let i = 0; i < timeline.length; i++) {
    const timeDiff = timeline[i].nextTurnAt - nextTurn.nextTurnAt;

    if (timeDiff > 0 && timeDiff < smallestPositiveTimeDiff) {
      smallestPositiveTimeDiff = timeDiff;
      insertionIdx = i;
    }
  }

  timeline.splice(insertionIdx, 0, nextTurn);

  const character = getCharacterById(timeline[0].entity.id)!;

  console.log("timeline", { prev: prevTimeline, next: timeline.slice() });

  handleCharacterTurn(character);
  drawTimeline();
}

// character turn controller >>>
async function handleCharacterTurn(entity: Character): Promise<void> {
  console.log(`==========================================`);
  console.log(`it's ${entity.name.toUpperCase()}'s turn...`);

  incrementTurnCount();
  drawTurnCount(turnCount);

  if (entity.type === "enemy") {
    const targetHero = chooseTargetForEnemy(entity);

    setBattleState(BattleState.EnemyAction);
    drawBottomPane(panes.enemyAction(`${entity.name}'s turn`));

    await drawSelectedCharacterOutline(entity);
    await wait(750);

    setBattleState(BattleState.EnemyAttack);
    drawBottomPane(
      panes.enemyAttack(
        `${entity.name} performs a ${entity.actions.attack.type} attack against ${targetHero.name}`
      )
    );
    await handleAttack(entity, targetHero);

    return new Promise(async (resolve) => {
      setBattleState(BattleState.Idle);
      drawBottomPane({ type: "none", content: undefined });

      await wait(800);

      updateTimeline();
      resolve();
    });
  }
  //
  else if (entity.type === "hero") {
    // if was defending, cleanup defending UI
    const slotOverlay = getSlotOverlayElementById(entity.id)!;
    if (slotOverlay.classList.contains("defending")) {
      slotOverlay.classList.remove("defending");
    }

    setBattleState(BattleState.HeroAction);
    drawBottomPane(panes.heroActions(entity));

    await drawSelectedCharacterOutline(entity);
    await wait(700);
  }
}

async function handleAttack(
  attacker: Character,
  target: Character
): Promise<void> {
  const attackPower = attacker.actions.attack.power;

  await drawAttackEffect(attacker, target);

  target.hp -= attackPower;

  // handle character kill
  if (target.hp <= 0) {
    target.hp = 0;
    console.log(target.name, "died!");
    const timelineIdx = timeline.findIndex((o) => o.entity.id === target.id);
    timeline.splice(timelineIdx, 1);
  }

  drawCharacters();

  // handle battle over
  if (enemies.every((e) => e.hp <= 0)) {
    console.log("battle won!");
    setBattleState(BattleState.Ended);
    drawBottomPane(panes.battleWon());
    await wait(3000);
  }

  if (heroes.every((h) => h.hp <= 0)) {
    console.log("battle lost!");
    setBattleState(BattleState.Ended);
    drawBottomPane(panes.battleLost());
    await wait(3000);
  }
}

async function main() {
  setBattleState(BattleState.Dormant);
  setPlayerAction(PlayerAction.None);
  drawCharacters();

  drawBottomPane(panes.battleStart());
  await wait(1000);
  drawBottomPane(panes.getReady());
  await wait(1000);

  initializeTimeline();

  // run initial turn
  const firstToPlay = getCharacterById(timeline[0].entity.id)!;
  console.log({ firstToPlay });
  handleCharacterTurn(firstToPlay);
}

main();

// console.log({
//   // battleLanesUI,
//   // charDurations1: updateTurnSequence(),
//   // charDurations2: updateTurnSequence(),
//   // charDurations3: updateTurnSequence(),
//   // charDurations4: updateTurnSequence(),
//   // charDurations5: updateTurnSequence(),
//   // battleUI,
//   // slots,
//   // enemyBackSlots,
//   // enemyFrontSlots,
//   // heroFrontSlots,
//   // heroBackSlots,
// });

/*

1 sec == 4 ticks
1 tick == 0.25sec

speed: 100 - 10 ticks -> 2.5s  // mult -> 0.1, 0.4, 0.65, 
|----------|

speed: 50 - 20 ticks -> 5s
|----------|----------|

speed: 25 - 40 ticks -> 10s
|----------|----------|----------|----------|

*/
