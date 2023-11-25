import {
  slots,
  dismissBtn,
  getSlotOverlayElementById,
  getSlotElementById,
} from "./dom";
import {
  drawAttackEffect,
  drawBottomPane,
  drawCharacters,
  drawDefenseEffect,
  drawItemEffect,
  drawSelectedCharacterOutline,
  drawStatusEffect,
  drawTimeline,
  drawTurnCount,
} from "./draw";
import { PlayerAction, BattleState, StatusEffectName } from "./enums";
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
  turnCount,
  getCurrentCharacter,
  allCharacters,
  allStatuses,
} from "./globals";
import { panes } from "./infoPane";
import { Character, InventoryItem, Status, StatusTurn, Turn } from "./types";
import { calculateNextTurnTime, wait } from "./utils";

window.addEventListener("hero-defense", onHeroDefense);
window.addEventListener("hero-attack-target-selected", onHeroAttack);
window.addEventListener("item-target-selected", onItemTargetSelected);

dismissBtn.addEventListener("click", onDismiss);

for (const slot of slots) {
  slot.addEventListener("click", onSlotClick);
}

async function onStatusActed(status: Status, character: Character) {
  await drawStatusEffect(status, character.id);

  const slot = getSlotElementById(character.id);

  if (status.name === StatusEffectName.Poison) {
    const poisonExpired = status.turnsPlayed >= status.turnCount;

    if (poisonExpired) {
      const statusIdx = allStatuses.findIndex((s) => s.id === status.id);
      const timelineIdx = timeline.findIndex((s) => s.entity.id === status.id);

      allStatuses.splice(statusIdx, 1);
      timeline.splice(timelineIdx, 1);
      drawTimeline();

      console.log("DELETED POISON RECORD", {
        timeline: timeline.slice(),
        allStatuses: allStatuses.slice(),
      });

      if (slot.classList.contains("poisoned")) {
        slot.classList.remove("poisoned");
      }

      setBattleState(BattleState.StatusExpired);
      drawBottomPane(
        panes.statusExpired(
          `${status.name} effect on ${character.name} has expired`
        )
      );

      await wait(1240);
    } else if (!poisonExpired && !slot.classList.contains("poisoned")) {
      slot.classList.add("poisoned");
    }
  }

  setPlayerAction(PlayerAction.None);
  handleUpdateTimeline();
}

async function onHeroDefense(data: any) {
  const { hero } = data.detail;

  await drawDefenseEffect(hero);

  await wait(500);

  setPlayerAction(PlayerAction.None);
  handleUpdateTimeline();
}

async function onHeroAttack(data: any) {
  const { selectedCharacter: target } = data.detail;
  const hero = getCurrentCharacter();
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
  const hero = getCurrentCharacter();
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
  const hero = getCurrentCharacter();
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
  drawBottomPane(
    panes.characterDamaged(`${target.name} suffered ${attackPower} of damage`)
  );
  await wait(1020);

  // handle character kill
  if (target.hp <= 0) {
    target.hp = 0;
    console.log(target.name, "died!");
    const timelineIdx = timeline.findIndex((o) => o.entity.id === target.id);
    console.log("DELETED character entry from timeline", timeline.slice());
    timeline.splice(timelineIdx, 1);
    drawTimeline();

    setBattleState(BattleState.CharacterKilled);
    drawBottomPane(
      panes.characterKilled(`${attacker.name} has slain ${target.name}`)
    );
    await wait(1220);
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

  incrementTurnCount();
  drawTurnCount(turnCount);

  const prevTimeline = timeline.slice();
  const currentTurn = timeline.shift()!;

  const nextTurn = {
    ...currentTurn,
    nextTurnAt: calculateNextTurnTime(currentTurn),
    // turnsPlayed: currentTurn!.turnsPlayed + 1,
  } as Turn;

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
  drawTimeline();

  console.log("timeline", {
    prev: prevTimeline,
    next: timeline.slice(),
    // nextTurn,
    // currentTurn,
    curr: timeline[0],
  });

  if (timeline[0].type === "status") {
    const status = allStatuses.find(
      (s) => s.id === (timeline[0] as StatusTurn).entity.id
    )!;
    const character = allCharacters.find(
      (c) => c.id === (timeline[0] as StatusTurn).characterId
    )!;

    handleStatusTurn(status, character);
  } else if (timeline[0].type === "character") {
    const character = getCurrentCharacter();

    handleCharacterTurn(character);
  }
}

async function handleStatusTurn(status: Status, character: Character) {
  status.turnsPlayed++;

  setBattleState(BattleState.StatusAction);
  drawBottomPane(
    panes.statusTurn(
      `${character.name} received ${status.power} damage from poison`
    )
  );

  switch (status.name) {
    case StatusEffectName.Poison:
      character.hp -= status.power;

      // await drawPoisonEffect(character.id)
      break;
    default:
      break;
  }

  drawCharacters();

  await onStatusActed(status, character);
}

async function handleCharacterTurn(entity: Character): Promise<void> {
  console.log("handleCurrentCharacter", { entity });
  console.log(`==========================================`);
  console.log(`It's ${entity.name.toUpperCase()}'s turn...`);
  console.log(`==========================================`);

  console.log(entity.type);

  if (entity.type === "enemy") {
    const targetHero = chooseTargetForEnemy(entity);

    setBattleState(BattleState.EnemyAction);
    drawBottomPane(panes.enemyAction(`${entity.name}'s turn`));

    await drawSelectedCharacterOutline(entity);
    await wait(750);

    setBattleState(BattleState.EnemyAttack);
    drawBottomPane(
      panes.enemyAttack(`${entity.name} attacked ${targetHero.name}`)
    );

    await handleAttack(entity, targetHero);

    drawBottomPane({ type: "none", content: undefined });

    if (battleState === BattleState.Ended) return Promise.resolve();

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

export { handleUpdateTimeline, handleCharacterTurn, handleStatusTurn };
