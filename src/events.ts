import { slots, dismissBtn, getSlotOverlayElementById } from "./dom";
import {
  drawAttackEffect,
  drawBottomPane,
  drawCharacters,
  drawDefenseEffect,
  drawItemEffect,
  drawSelectedCharacterOutline,
  drawTimeline,
  drawTurnCount,
} from "./draw";
import { PlayerAction, BattleState } from "./enums";
import {
  setBattleState,
  getCharacterById,
  timeline,
  battleState,
  cleanupSelectedItem,
  enemies,
  heroes,
  selectedItem,
  setPlayerAction,
  subtractFromInventory,
  chooseTargetForEnemy,
  incrementTurnCount,
  setCurrentTurn,
  turnCount,
  currentTurn,
} from "./globals";
import { panes } from "./infoPane";
import { Character, InventoryItem } from "./types";
import { calculateNextTurnTime, wait } from "./utils";

// prettier-ignore
window.addEventListener("hero-defense", onHeroDefense);
window.addEventListener("hero-attack-target-selected", onHeroAttack);
window.addEventListener("item-target-selected", onItemTargetSelected);

dismissBtn.addEventListener("click", onDismiss);

for (const slot of slots) {
  slot.addEventListener("click", onSlotClick);
}

async function onHeroDefense(data: any) {
  const { hero } = data.detail;
  console.log("onHeroDefense", hero);

  await drawDefenseEffect(hero);

  setPlayerAction(PlayerAction.None);
  handleUpdateTimeline();
}

async function onHeroAttack(data: any) {
  const { selectedCharacter: target } = data.detail;
  const hero = getCharacterById(timeline[0].entity.id)!;
  // console.log("onHeroAttack", {
  //   target,
  //   hero,
  //   playerAction,
  // });

  setPlayerAction(PlayerAction.Attack);
  setBattleState(BattleState.HeroAttack);
  drawBottomPane(panes.heroAttack(`${hero.name} attacks ${target.name}`));

  await handleAttack(hero, target);

  setPlayerAction(PlayerAction.None);
  handleUpdateTimeline();
}

async function onItemTargetSelected(data: any) {
  const { selectedCharacter: target } = data.detail;
  const hero = getCharacterById(timeline[0].entity.id)!;
  const message = `${target.name} received ${selectedItem?.name}`;
  // console.log("onItemTargetSelected", {
  //   target,
  //   hero,
  //   playerAction,
  // });

  setPlayerAction(PlayerAction.Item);
  setBattleState(BattleState.ItemUse);
  drawBottomPane(panes.itemUse(message));

  const item = cleanupSelectedItem();
  subtractFromInventory(item);

  await drawItemEffect(item, hero, target);

  handleItemEffect(item, target);

  setPlayerAction(PlayerAction.None);
  handleUpdateTimeline();
}

function onDismiss() {
  setBattleState(BattleState.HeroAction);
  const hero = getCharacterById(timeline[0].entity.id);
  drawBottomPane(panes.heroActions(hero));
}

function onSlotClick(e: MouseEvent) {
  const slot = (e.target as HTMLElement).closest(".lane-slot") as HTMLLIElement;
  const selectedCharacter = getCharacterById(slot.id);
  // console.log(":::onSlotClick", slot, selectedCharacter, battleState);

  if (battleState === BattleState.AttackTargetSelection) {
    window.dispatchEvent(
      new CustomEvent("hero-attack-target-selected", {
        detail: { selectedCharacter },
      })
    );
  }

  if (battleState === BattleState.ItemTargetSelect) {
    // @TODO: add item info to event payload
    window.dispatchEvent(
      new CustomEvent("item-target-selected", {
        detail: { selectedCharacter },
      })
    );
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
    setBattleState(BattleState.Ended);
    drawBottomPane(panes.battleWon());
    await wait(3000);
  }

  if (heroes.every((h) => h.hp <= 0)) {
    setBattleState(BattleState.Ended);
    drawBottomPane(panes.battleLost());
    await wait(3000);
  }
}

function handleUpdateTimeline(): void {
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

async function handleCharacterTurn(entity: Character): Promise<void> {
  console.log(currentTurn);
  console.log(`==========================================`);
  console.log(`It's ${entity.name.toUpperCase()}'s turn...`);
  console.log(`==========================================`);

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

    drawBottomPane({ type: "none", content: undefined });

    if (battleState === BattleState.Ended) return Promise.resolve();

    setBattleState(BattleState.Idle);
    await wait(800);

    handleUpdateTimeline();
    Promise.resolve();
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

function handleItemEffect(item: InventoryItem, target: Character) {
  switch (item.name) {
  }
}

export { handleUpdateTimeline, handleCharacterTurn };
