import { handleBattleWon, handleBattleLost } from ".";
import { getSlotDefenseOverlayById } from "../../shared/dom";
import { StatusName, ActionName } from "../../shared/enums";
import { Status, Character, StatusTurn, Turn, CharacterTurn } from "../../shared/types";
import { idMaker, calcTurnDuration, calculateNextTurnTime } from "../../shared/utils";
import { drawSelectedCharacterOutline, drawTurnCount, drawTimeline } from "./draw";
import { onActionTargetSelected } from "./events";
import {
  getCharacterById,
  timeline,
  getCharacterStatusIdxByName,
  getDefenseStatusIdx,
  inventory,
  currentTurnInfo,
  incrementTurnCount,
  turnCount,
  allCharacters,
  setTimeline,
  getTimeline,
  getAllEnemiesAlive,
  getAllHeroesAlive,
} from "./globals";

export function resurrectTarget(target: Character) {
  target.hp = 70;

  const turnDuration = calcTurnDuration(target.speed);
  const ressurectedCharTurn: CharacterTurn = {
    type: "character",
    entity: { id: target.id, name: target.name, type: target.type },
    turnsPlayed: 0,
    turnDuration,
    nextTurnAt: timeline[0].nextTurnAt + turnDuration,
  };
  setTimeline([...getTimeline(), ressurectedCharTurn]);
}

export function removeDeadTargetFromTimeline(target: Character) {
  target.statuses = [];

  const noDeadCharOrStatusTimeline = timeline.filter((turn) => {
    if (turn.type === "status") {
      return turn.characterId !== target.id;
    }
    // type character
    else {
      return turn.entity.id !== target.id;
    }
  });

  setTimeline(noDeadCharOrStatusTimeline);
}

export function insertStatusTurn(status: Status, target: Character) {
  // console.log(":::insert status into timeline", { status, target, timeline: timeline.slice() });

  const nowTick = timeline[0].nextTurnAt;
  // const statusRef = STATUS_DICT[status.name as StatusName]

  const statusTurn: StatusTurn = {
    type: "status",
    characterId: target.id,
    entity: { id: idMaker(), name: status.name, type: "status" },
    turnDuration: calcTurnDuration(status.speed!),
    nextTurnAt: nowTick + calcTurnDuration(status.speed!),
    turnsPlayed: 0,
    turnCount: status.turnCount,
  };

  let insertionIdx = timeline.length;
  let smallestPositiveTimeDiff = Infinity;

  for (let i = 0; i < timeline.length; i++) {
    const timeDiff = timeline[i].nextTurnAt - statusTurn.nextTurnAt;

    if (timeDiff > 0 && timeDiff < smallestPositiveTimeDiff) {
      smallestPositiveTimeDiff = timeDiff;
      insertionIdx = i;
    }
  }
  timeline.splice(insertionIdx, 0, statusTurn);
}

export function updateStatusTurn(statusName: StatusName, target: Character) {
  const existingStatusTurnIdx = timeline.findIndex((turn) => turn.type === "status" && turn.characterId === target.id);
  const existingCharacterStatusIdx = getCharacterStatusIdxByName(target.id, statusName);

  console.log("UPDATING EXISTING STATUS before", JSON.stringify({ ...target.statuses }, null, 2));
  // status: getCharacterStatusIdxByName(target.id, statusName),

  // simply keep the previous status. update its turnPlayed count, and update character.status to match it
  if (existingStatusTurnIdx > -1 && existingCharacterStatusIdx > -1) {
    timeline[existingStatusTurnIdx].turnsPlayed = 0;
    target.statuses[existingCharacterStatusIdx].turnsPlayed = 0;
    console.log("UPDATING EXISTING STATUS after", JSON.stringify({ ...target.statuses }, null, 2));
  }
}

export async function startTurn(turn: Turn) {
  if (turn.type === "status") {
    const character = getCharacterById(turn.characterId);
    console.log("start Status Turn", character.name, { inventory });

    currentTurnInfo.isStatusAction = true;
    currentTurnInfo.actionName = ActionName.Status;
    currentTurnInfo.actionDetail = turn.entity.name;
    currentTurnInfo.actionTarget = character;
    currentTurnInfo.character = character;

    onActionTargetSelected();
  } else {
    const character = getCharacterById(turn.entity.id);
    await drawSelectedCharacterOutline(character);
    console.log(`start ${turn.type} Turn`, character.name);

    if (turn.entity.type === "hero") {
      const removeIdx = getDefenseStatusIdx(character.statuses);

      if (removeIdx > -1) {
        const slotOverlay = getSlotDefenseOverlayById(character.id)!;
        slotOverlay.classList.remove("defending");

        character.statuses.splice(removeIdx, 1);
        console.log("REMOVED DEFENSE STATUS", character.name, { ...character });
      }
    }

    window.dispatchEvent(
      new CustomEvent("character-action", {
        detail: {
          characterId: turn.entity.id,
        },
      })
    );
  }
}

export async function updateTimeline() {
  // console.log("updateTimeline");
  incrementTurnCount();
  drawTurnCount(turnCount);
  drawTimeline();
  checkWinCondition();

  // 1. dequeue first turn
  const prevTimeline = timeline.slice();
  const currentTurn = timeline.shift()!;

  // update turn
  const nextTurn: Turn = {
    ...currentTurn,
    nextTurnAt: calculateNextTurnTime(currentTurn),
    turnsPlayed: currentTurn.turnsPlayed + 1,
  };

  if (currentTurn.type === "status") {
    const character = getCharacterById(currentTurn.characterId);
    const characterStatusIdx = getCharacterStatusIdxByName(
      currentTurn.characterId,
      currentTurn.entity.name as StatusName
    );

    if (characterStatusIdx > -1) {
      character.statuses[characterStatusIdx].turnsPlayed++;
    }

    const shouldRemoveTurn = nextTurn.turnsPlayed >= (nextTurn as StatusTurn).turnCount;
    if (shouldRemoveTurn) {
      character.statuses.splice(characterStatusIdx, 1);
      return startTurn(currentTurn);
    }
  }

  let insertionIdx = timeline.length;
  let smallestPositiveTimeDiff = Infinity;

  for (let i = 0; i < timeline.length; i++) {
    const timeDiff = timeline[i].nextTurnAt - nextTurn.nextTurnAt;

    if (timeDiff > 0 && timeDiff < smallestPositiveTimeDiff) {
      smallestPositiveTimeDiff = timeDiff;
      insertionIdx = i;
    }
  }

  // reinsert turn
  timeline.splice(insertionIdx, 0, nextTurn);

  // console.log(
  //   "\n prevTimeline \n",
  //   prevTimeline,
  //   "\n timeline \n",
  //   timeline.slice()
  // );

  startTurn(currentTurn);
}

export async function initializeTimeline() {
  const initialCharacterTurns: CharacterTurn[] = allCharacters.map((c) => ({
    type: "character",
    entity: { id: c.id, name: c.name, type: getCharacterById(c.id)!.type },
    turnDuration: calcTurnDuration(c.speed),
    nextTurnAt: calcTurnDuration(c.speed),
    turnsPlayed: 0,
  }));

  // @TODO: handle statuses that might eventually exist at the beginning of the battle

  setTimeline([...initialCharacterTurns].sort((a, b) => a.nextTurnAt - b.nextTurnAt));

  drawTimeline();

  console.log({
    allCharacters: allCharacters.slice(),
    timeline: timeline.slice(),
  });
}

export function checkWinCondition() {
  if (getAllEnemiesAlive().length === 0) {
    // win
    handleBattleWon();
  }
  if (getAllHeroesAlive().length === 0) {
    // lose
    handleBattleLost();
  }
}
