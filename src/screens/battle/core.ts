import { getSlotElementById } from "../../shared/dom";
import { ActionName, MagicSpellName, InventoryItemName, StatusName } from "../../shared/enums";
import { Action, Character } from "../../shared/types";
import { wait } from "../../shared/utils";
import {
  drawActionPane,
  drawCharacters,
  drawAttackEffect,
  drawItemEffect,
  drawAMagicEffect,
  drawStatusEffect,
  drawStealEffect,
  drawBottomPane,
  drawDefenseEffect,
  drawNumber,
} from "./draw";
import { createNewStatus } from "./events";
import {
  getCharacterById,
  getDefenseStatusIdx,
  subtractFromInventory,
  performStealAttempt,
  addInventoryItem,
} from "./globals";
import { panes } from "./infoPane";
import {
  insertStatusTurn,
  removeDeadTargetFromTimeline,
  resurrectTarget,
  updateStatusTurn,
  updateTimeline,
} from "./timeline";

export async function processAction(actionData: { actorId: string; targetId: string; action: Action }) {
  const { action, actorId, targetId } = actionData;
  const actor = getCharacterById(actorId);
  const target = getCharacterById(targetId);

  console.log("PROCESSING ACTION!!!", {
    actionData,
    action: { ...action },
    actor: { ...actor },
    target: { ...target },
  });

  await computeEntityChanges(action, actor, target);

  await drawActionPane(action, actor, target);

  await handleActionEfx(action, actor, target);

  drawCharacters(); // to reflect the updated hp values, statuses etc

  await updateTimeline();
}

export async function computeEntityChanges(action: Action, actor: Character, target: Character) {
  // console.log("COMPUTE ENTITY CHANGES", {
  //   action: { ...action },
  //   actor: { ...actor },
  //   target: { ...target },
  //   targetStatuses: { ...target.statuses },
  //   // targetStatuses: target.statuses[getCharacterStatusIdxByName(target.id, StatusName.Poison)],
  // });

  if (actor.type === "hero") {
    if (["melee", "ranged"].includes(action.type)) {
      let attackPower = 0;

      if (action.name === ActionName.MeleeAttack) {
        attackPower = (actor.equipment.weapon?.power || 0) + actor.attributes.strength * 0.5;
        action.power = attackPower;
      } else if (action.name === ActionName.RangedAttack) {
        attackPower = (actor.equipment.weapon?.power || 0) + actor.attributes.dexterity * 0.5;
        action.power = attackPower;
      } else if (action.power) {
        attackPower = action.power;
      }

      if (getDefenseStatusIdx(target.statuses) > -1) {
        attackPower *= 0.5;
      }

      attackPower = Math.ceil(attackPower);
      action.power = attackPower; // do this so drawNumber gets called in handleEfx

      target.hp -= attackPower;
    }

    if (action.type === "magical") {
      actor.mp -= action.mpCost;

      if (action.effects?.length) {
        for (const statusName of action.effects) {
          if (target.statuses.some((s) => s.name === statusName)) {
            // console.log("UPDATE EXISTING STATUS");
            updateStatusTurn(statusName, target);
          } else {
            const newStatus = createNewStatus(statusName);
            target.statuses.push(newStatus);
            // console.log("ADD STATUS TURN", newStatus);
            insertStatusTurn(newStatus, target);
          }
        }
      }

      if (action.power) {
        if (
          [MagicSpellName.Cure, MagicSpellName.Regen, MagicSpellName.Protect].includes(action.name as MagicSpellName)
        ) {
          target.hp += action.power;
        } else {
          target.hp -= action.power;
        }
      }
    }

    if (action.type === "item") {
      subtractFromInventory(action.name);

      switch (action.name) {
        case InventoryItemName.Potion:
          if (target.hp > 0) {
            target.hp += 100;
            if (target.hp > target.maxHp) target.hp = target.maxHp;
          }
          break;
        case InventoryItemName.Ether:
          if (target.hp > 0) {
            target.mp += 50;
            if (target.mp > target.maxMp) target.mp = target.maxMp;
          }
          break;
        case InventoryItemName.PhoenixDown:
          if (target.hp <= 0) {
            resurrectTarget(target);
          }
          break;
      }
    }
  }

  if (action.type === "status") {
    if (action.name === StatusName.Poison) {
      target.hp -= action.power!;
    }
    if (action.name === StatusName.Regen) {
      target.hp += action.power!;
    }
  }

  if (target.hp < 0) {
    target.hp = 0;
    removeDeadTargetFromTimeline(target);
  }
  if (actor.mp < 0) {
    actor.mp = 0;
  }
}

export async function handleActionEfx(action: Action, actor: Character, target: Character) {
  console.log("handleActionEfx", action);
  switch (action.type) {
    case "melee":
    case "ranged":
      await drawAttackEffect(actor, target, action);
      break;
    case "item":
      await drawItemEffect(actor, target);
      break;
    case "magical":
      await drawAMagicEffect(actor, target, action);
      break;
    case "status":
      await drawStatusEffect(action.name, target.id);
      break;
    case "steal":
      await drawStealEffect(actor, target, action);
      const itemName = performStealAttempt(actor, target);
      if (itemName) {
        addInventoryItem(itemName);
        drawBottomPane({ type: "text", content: `stolen ${itemName} from ${target.name}!` });
      } else {
        drawBottomPane({ type: "text", content: `failed to steal` });
      }
      await wait(1000);
      break;
    case "defend":
      if (action.name === ActionName.Defend) {
        actor.statuses.push({
          name: StatusName.Defense,
          turnCount: 1,
          turnsPlayed: 0,
        });
        await drawDefenseEffect(actor);
        drawBottomPane(panes.text(`${actor.name} raised its defenses`));
        await wait(800);
      }
      break;
    default:
      break;
  }

  const slot = getSlotElementById(target.id);
  const isPoisoned = target.statuses.some((s) => s.name === StatusName.Poison);

  if (isPoisoned && !slot.classList.contains("poisoned")) {
    slot.classList.add("poisoned");
  }

  if (slot.classList.contains("poisoned") && !isPoisoned) {
    slot.classList.remove("poisoned");
  }

  const actionPow = (action as any)?.power;
  if (actionPow) {
    if ([MagicSpellName.Cure, MagicSpellName.Regen].includes((action as any).name)) {
      drawNumber(target.id, actionPow, "lightgreen");
    } else {
      drawNumber(target.id, actionPow);
    }
  }
}
