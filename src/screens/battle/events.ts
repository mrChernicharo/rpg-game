import { STATUS_DICT, DETAILED_ACTION_DICT, SIMPLE_ACTION_DICT } from "../../data/static";
import { battleUI, slots } from "../../shared/dom";
import { drawBottomPane } from "./draw";
import { ActionName, _AttackName, StatusName } from "../../shared/enums";
import { getCharacterById, shouldSelectTarget, setShouldSelectTarget, currentTurnInfo, inventory } from "./globals";
import { panes } from "./infoPane";
import { Action, Status } from "../../shared/types";
import { wait } from "../../shared/utils";
import { updateTimeline, processAction } from "./timeline";

// window.onclick = () => {
//   console.log(TurnInfo);
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
  drawBottomPane(panes.heroActions(currentTurnInfo.character!));
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
    currentTurnInfo.actionTarget = targetCharacter;
    window.dispatchEvent(new CustomEvent("action-target-selected"));
  }
}

export async function onCharacterAction(e: any) {
  const { characterId } = e.detail;
  const character = getCharacterById(characterId);
  currentTurnInfo.character = character;

  drawBottomPane(panes.text(`${character.name}'s turn`));
  await wait(1000);

  if (character.type === "enemy" || character.type === "npc") {
    console.log("onCharacterAction", character.name);
    console.log("enemy", character);
    //  decideEnemyAction
    await updateTimeline();
  }

  if (character.type === "hero") {
    // draw actions pane
    drawBottomPane(panes.heroActions(character));
  }
}

export async function onActionSelected(e: any) {
  const actionName = e.detail;
  console.log("onActionSelected", { actionName, TurnInfo: currentTurnInfo });

  if (!currentTurnInfo.character) {
    throw Error("no character data inside TurnInfo");
  }
  currentTurnInfo.actionName = actionName;
  const isHeroAction = currentTurnInfo.character.type === "hero";

  if (!isHeroAction) {
    // selectActionDetail
    // selectTarget
  }

  if (isHeroAction) {
    switch (actionName) {
      case ActionName._Attack:
      case ActionName.Magic:
      case ActionName.Invoke:
      case ActionName.Summon:
        drawBottomPane(panes.heroActionDetail(currentTurnInfo.character, actionName), dismissFn);
        break;
      case ActionName.Item:
        drawBottomPane(panes.itemSelection(inventory), dismissFn);
        break;
      case ActionName.Defend:
        currentTurnInfo.actionTarget = currentTurnInfo.character;
        onActionTargetSelected();
        break;
      case ActionName.Attack:
        currentTurnInfo.actionDetail = "melee";
        setShouldSelectTarget(true);
        // @TODO check hero equipment
        drawBottomPane(panes.text(`Select target`), dismissFn);
        break;
      case ActionName.Steal:
        setShouldSelectTarget(true);
        drawBottomPane(panes.text(`Select target to ${actionName}`), dismissFn);
        break;
      default:
        break;
    }
  }
}

export function onActionDetailSelected(e: any) {
  const detail = e.detail;
  currentTurnInfo.actionDetail = detail;

  setShouldSelectTarget(true);
  drawBottomPane(panes.text("select target"), dismissFn);
}

function resetActionData(mode: "soft" | "hard") {
  // RESET CURRENT ACTION DATA

  if (mode === "hard") {
    currentTurnInfo.character = null;
  }
  currentTurnInfo.actionDetail = null;
  currentTurnInfo.actionName = null;
  currentTurnInfo.actionTarget = null;
  currentTurnInfo.isStatusAction = false;
}

export async function onActionTargetSelected() {
  const actionData = {
    actorId: currentTurnInfo.character!.id,
    targetId: currentTurnInfo.actionTarget!.id,
    action: createNewAction(currentTurnInfo.actionName as ActionName, currentTurnInfo.actionDetail || null) as Action,
  };

  // RESET CURRENT ACTION DATA
  resetActionData("hard");

  console.log("onActionTargetSelected", actionData);
  await processAction(actionData);
}

export function createNewAction(actionName: ActionName, actionDetail: string | null) {
  if (actionDetail && actionName === ActionName.Attack) {
    return SIMPLE_ACTION_DICT[actionName]!;
  } else if (actionDetail && actionName === ActionName.Status) {
    return {
      ...STATUS_DICT[actionDetail as StatusName]!,
      type: "status",
      targets: "single",
      turnsPlayed: 0,
    };
  } else if (actionDetail) {
    return DETAILED_ACTION_DICT[actionName]![actionDetail];
  } else {
    return SIMPLE_ACTION_DICT[actionName]!;
  }
}

export function createNewStatus(statusName: StatusName) {
  const newStatus = {
    ...STATUS_DICT[statusName],
  } as Status;

  console.log({ newStatus });
  return newStatus;
}
