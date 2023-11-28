import { STATUS_DICT, DETAILED_ACTION_DICT, SIMPLE_ACTION_DICT } from "./data";
import { battleUI, slots } from "./dom";
import { drawBottomPane } from "./draw";
import { ActionName, StatusName } from "./enums";
import { getCharacterById, shouldSelectTarget, setShouldSelectTarget, currentActionData, inventory } from "./globals";
import { panes } from "./infoPane";
import { processAction, updateTimeline } from "./main";
import { Action, Status } from "./types";
import { wait } from "./utils";

// window.onclick = () => {
//   console.log(currentActionData);
// };
window.addEventListener("character-action", onCharacterAction);
window.addEventListener("action-selected", onActionSelected);
window.addEventListener("action-detail-selected", onActionDetailSelected);
window.addEventListener("action-target-selected", onActionTargetSelected);

for (const slot of slots) {
  slot.onclick = onSlotClick;
}

export const dismissFn = () => {
  console.log("dismiss");
  battleUI?.classList.remove(`ready-to-act`);
  slots.forEach((s) => {
    if (s.classList.contains("selectable-target")) {
      s.classList.remove("selectable-target");
    }
  });
  drawBottomPane(panes.heroActions(currentActionData.character!));
  resetActionData("soft");
};

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
        drawBottomPane(panes.text(`Select target to Steal`), dismissFn);
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
  drawBottomPane(panes.text("select target"), dismissFn);
}

function resetActionData(mode: "soft" | "hard") {
  // RESET CURRENT ACTION DATA

  if (mode === "hard") {
    currentActionData.character = null;
  }
  currentActionData.actionDetail = null;
  currentActionData.actionName = null;
  currentActionData.actionTarget = null;
  currentActionData.isStatusAction = false;
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
  resetActionData("hard");

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
