import { STATUS_DICT, DETAILED_ACTION_DICT, SIMPLE_ACTION_DICT } from "./data";
import { slots } from "./dom";
import { drawBottomPane } from "./draw";
import { ActionName, StatusName } from "./enums";
import { getCharacterById, shouldSelectTarget, setShouldSelectTarget, currentActionData, inventory } from "./globals";
import { panes } from "./infoPane";
import { processAction, updateTimeline } from "./main";
import { Action, Status } from "./types";
import { wait } from "./utils";

// window.addEventListener("turn-start", onTurnStart);
window.addEventListener("character-action", onCharacterAction);
window.addEventListener("action-selected", onActionSelected);
window.addEventListener("action-detail-selected", onActionDetailSelected);
window.addEventListener("action-target-selected", onActionTargetSelected);

for (const slot of slots) {
  slot.onclick = onSlotClick;
}

export function onSlotClick(e: MouseEvent) {
  const el = e.target as HTMLElement;
  const slot = el.closest(".lane-slot")!;
  if (!slot.id) return;

  const targetCharacter = getCharacterById(slot.id);
  // console.log("onSlotClick", { slot, targetCharacter });

  if (shouldSelectTarget) {
    setShouldSelectTarget(false);
    // console.log("Target selected", { slot, targetCharacter });
    currentActionData.actionTarget = targetCharacter;
    window.dispatchEvent(new CustomEvent("action-target-selected"));
  }
}

export async function onCharacterAction(e: any) {
  const { characterId } = e.detail;
  const character = getCharacterById(characterId);
  currentActionData.character = character;

  // console.log("onCharacterAction", character.name);

  drawBottomPane(panes.text(`${character.name}'s turn`));
  await wait(1000);

  if (character.type === "enemy" || character.type === "npc") {
    // console.log("enemy", character);
    //  decideEnemyAction
    return updateTimeline();
  }

  if (character.type === "hero") {
    // draw actions pane
    drawBottomPane(panes.heroActions(character));
  }
}

export async function onActionSelected(e: any) {
  const actionName = e.detail;
  // console.log("onActionSelected", actionName);

  if (!currentActionData.character) {
    throw Error("no character data inside currentActionData");
  }
  currentActionData.actionName = actionName;
  const isHeroAction = currentActionData.character.type === "hero";

  if (!isHeroAction) {
    // selectActionDetail
    // selectTarget
  }

  if (isHeroAction) {
    const dismissFn = () => {
      console.log("dismiss");
      drawBottomPane(panes.heroActions(currentActionData.character!));
    };

    switch (actionName) {
      case ActionName.Attack:
      case ActionName.Magic:
      case ActionName.Invoke:
      case ActionName.Summon:
        drawBottomPane(panes.heroActionDetail(currentActionData.character, actionName), dismissFn);
        break;
      case ActionName.Item:
        drawBottomPane(panes.itemSelection(inventory), dismissFn);
        break;
      case ActionName.Defend:
        currentActionData.actionTarget = currentActionData.character;
        onActionTargetSelected();
        break;
      case ActionName.Steal:
        setShouldSelectTarget(true);
        break;
      default:
        break;
    }
  }
}

export function onActionDetailSelected(e: any) {
  const detail = e.detail;

  currentActionData.actionDetail = detail;
  setShouldSelectTarget(true);

  // console.log("onActionDetailSelected", { detail, currentActionData });
  drawBottomPane(panes.text("select target"));
}

export async function onActionTargetSelected() {
  const actionData = {
    actorId: currentActionData.character!.id,
    targetId: currentActionData.actionTarget!.id,
    action: createNewAction(
      currentActionData.actionName as ActionName,
      currentActionData.actionDetail || null
    ) as Action,
  };

  // RESET CURRENT ACTION DATA
  currentActionData.character = null;
  currentActionData.actionDetail = null;
  currentActionData.actionName = null;
  currentActionData.actionTarget = null;
  currentActionData.isStatusAction = false;

  // console.log("onActionTargetSelected", actionData);

  await processAction(actionData);
}

export function createNewAction(actionName: ActionName, actionDetail: string | null) {
  let action: Action | null = null;

  if (actionDetail) {
    if (actionName === "status") {
      action = {
        ...STATUS_DICT[actionDetail as StatusName]!,
        type: "status",
        targets: "single",
        turnsPlayed: 0,
      };
    } else {
      action = DETAILED_ACTION_DICT[actionName]![actionDetail];
    }
  } else {
    action = SIMPLE_ACTION_DICT[actionName]!;
  }

  console.log(":::createNewAction", { actionName, actionDetail, action: { ...action } });
  return action;
}

export function createNewStatus(statusName: StatusName) {
  const newStatus = {
    ...STATUS_DICT[statusName],
  } as Status;

  console.log({ newStatus });
  return newStatus;
}

// window.addEventListener("hero-defense", onHeroDefense);
// window.addEventListener("hero-attack-target-selected", onHeroAttack);
// window.addEventListener("item-target-selected", onItemTargetSelected);

// dismissBtn.addEventListener("click", onDismiss);

// for (const slot of slots) {
//   slot.addEventListener("click", onSlotClick);
// }

// async function onStatusActed(status: Status, character: Character) {
//   await drawStatusEffect(status, character.id);

//   const slot = getSlotElementById(character.id);

//   if (status.name === StatusName.Poison) {
//     const poisonExpired = status.turnsPlayed >= status.turnCount;

//     if (poisonExpired) {
//       const statusIdx = allStatuses.findIndex((s) => s.id === status.id);
//       const timelineIdx = timeline.findIndex((s) => s.entity.id === status.id);

//       allStatuses.splice(statusIdx, 1);
//       timeline.splice(timelineIdx, 1);
//       drawTimeline();

//       console.log("DELETED POISON RECORD", {
//         timeline: timeline.slice(),
//         allStatuses: allStatuses.slice(),
//       });

//       if (character.statuses.includes(StatusName.Poison)) {
//         character.statuses = character.statuses.filter(
//           (s) => s !== StatusName.Poison
//         );
//       }
//       if (slot.classList.contains("poisoned")) {
//         slot.classList.remove("poisoned");
//       }

//       setBattleState(BattleState.StatusExpired);
//       drawBottomPane(
//         panes.text(`${status.name} effect on ${character.name} has expired`)
//       );

//       await wait(1240);
//     } else if (!poisonExpired && !slot.classList.contains("poisoned")) {
//       slot.classList.add("poisoned");
//     }
//   }

//   setPlayerAction(PlayerAction.None);
//   handleUpdateTimeline();
// }

// async function onHeroDefense(data: any) {
//   const { hero: heroData } = data.detail;

//   setPlayerAction(PlayerAction.Defend);
//   drawBottomPane(panes.text(`${heroData.name} raised its defenses`));

//   await drawDefenseEffect(heroData);

//   const hero = getAllHeroes().find((c) => c.id === heroData.id);

//   hero?.statuses.push(StatusName.Defense);

//   await wait(500);

//   setPlayerAction(PlayerAction.None);
//   handleUpdateTimeline();
// }

// async function onHeroAttack(data: any) {
//   const { selectedCharacter: target } = data.detail;
//   const hero = getCurrentCharacter();
//   // console.log("onHeroAttack", {
//   //   target,
//   //   hero,
//   //   playerAction,
//   // });

//   setPlayerAction(PlayerAction.Attack);
//   setBattleState(BattleState.HeroAttack);
//   drawBottomPane(panes.text(`${hero.name} attacks ${target.name}`));

//   await handleAttack(hero, target);

//   setPlayerAction(PlayerAction.None);
//   handleUpdateTimeline();
// }

// async function onItemTargetSelected(data: any) {
//   const { selectedCharacter: target } = data.detail;
//   const hero = getCurrentCharacter();
//   const message = `${target.name} received ${selectedItem?.name}`;
//   // console.log("onItemTargetSelected", {
//   //   target,
//   //   hero,
//   //   playerAction,
//   // });

//   setPlayerAction(PlayerAction.Item);
//   setBattleState(BattleState.ItemUse);
//   drawBottomPane(panes.text(message));

//   const item = cleanupSelectedItem();
//   subtractFromInventory(item);

//   await drawItemEffect(item, hero, target);

//   handleItemEffect(item, target);

//   setPlayerAction(PlayerAction.None);
//   handleUpdateTimeline();
// }

// function onDismiss() {
//   setBattleState(BattleState.HeroAction);
//   const hero = getCurrentCharacter();
//   drawBottomPane(panes.heroActions(hero));
// }

// function onSlotClick(e: MouseEvent) {
//   const slot = (e.target as HTMLElement).closest(".lane-slot") as HTMLLIElement;
//   const selectedCharacter = getCharacterById(slot.id);
//   // console.log(":::onSlotClick", slot, selectedCharacter, battleState);

//   if (battleState === BattleState.AttackTargetSelection) {
//     window.dispatchEvent(
//       new CustomEvent("hero-attack-target-selected", {
//         detail: { selectedCharacter },
//       })
//     );
//   }

//   if (battleState === BattleState.ItemTargetSelect) {
//     // @TODO: add item info to event payload
//     window.dispatchEvent(
//       new CustomEvent("item-target-selected", {
//         detail: { selectedCharacter },
//       })
//     );
//   }
// }

// async function handleAttack(
//   attacker: Character,
//   target: Character
// ): Promise<void> {
//   const attackPower = attacker.actions.attack.power;

//   await drawAttackEffect(attacker, target);

//   if (target.statuses.includes(StatusName.Defense)) {
//     const halfPowerAttack = Math.ceil(attackPower / 2);
//     console.log("HIT DEFENDING HERO!", { attackPower, halfPowerAttack });

//     target.hp -= halfPowerAttack;
//     drawBottomPane(
//       panes.text(`${target.name} suffered ${halfPowerAttack} of damage`)
//     );
//   } else {
//     console.log("HIT!", { attackPower });

//     target.hp -= attackPower;
//     drawBottomPane(
//       panes.text(`${target.name} suffered ${attackPower} of damage`)
//     );
//   }
//   await wait(1020);

//   // handle character kill
//   if (target.hp <= 0) {
//     target.hp = 0;
//     console.log(target.name, "died!");
//     const timelineIdx = timeline.findIndex((o) => o.entity.id === target.id);
//     console.log("DELETED character entry from timeline", timeline.slice());
//     timeline.splice(timelineIdx, 1);
//     drawTimeline();

//     setBattleState(BattleState.CharacterKilled);
//     drawBottomPane(panes.text(`${attacker.name} has slain ${target.name}`));
//     await wait(1220);
//   }

//   drawCharacters();

//   // handle battle over
//   if (getAllEnemies().every((e) => e.hp <= 0)) {
//     setBattleState(BattleState.Ended);
//     drawBottomPane(panes.text("Battle Won!"));
//     await wait(3000);
//   }

//   if (getAllHeroes().every((h) => h.hp <= 0)) {
//     setBattleState(BattleState.Ended);
//     drawBottomPane(panes.text("Battle Lost!"));
//     await wait(3000);
//   }
// }

// async function handleCharacterTurn(entity: Character): Promise<void> {
//   console.log("handleCurrentCharacter", { entity });
//   console.log(`==========================================`);
//   console.log(`It's ${entity.name.toUpperCase()}'s turn...`);
//   console.log(`==========================================`);

//   console.log(":::", entity.name, entity.type, allCharacters);

//   if (entity.type === "enemy") {
//     const targetHero = chooseTargetForEnemy(entity);

//     setBattleState(BattleState.EnemyAction);
//     drawBottomPane(panes.text(`${entity.name}'s turn`));

//     await drawSelectedCharacterOutline(entity);
//     await wait(750);

//     setBattleState(BattleState.EnemyAttack);
//     drawBottomPane(panes.text(`${entity.name} attacked ${targetHero.name}`));

//     await handleAttack(entity, targetHero);

//     drawBottomPane({ type: "none", content: undefined });

//     if (battleState === BattleState.Ended) return Promise.resolve();

//     handleUpdateTimeline();
//     Promise.resolve();
//   }
//   //
//   else if (entity.type === "hero") {
//     // if was defending, cleanup defending UI
//     const slotOverlay = getSlotEfxOverlayById(entity.id)!;
//     if (slotOverlay.classList.contains("defending")) {
//       slotOverlay.classList.remove("defending");
//     }

//     setBattleState(BattleState.HeroAction);
//     drawBottomPane(panes.heroActions(entity));

//     await drawSelectedCharacterOutline(entity);
//     await wait(700);
//   }
// }

// function handleItemEffect(item: InventoryItem, target: Character) {
//   switch (item.name) {
//   }
// }

// export { handleUpdateTimeline, handleCharacterTurn, handleStatusTurn };
