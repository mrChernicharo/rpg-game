import "./style.css";
import {
  allCharacters,
  heroes,
  battleLanesUI,
  turnSequenceUI,
  panes,
  bottomSection,
} from "./constants";
import { calculateNextTurnTime, getTurnDuration } from "./utils";

export enum BattleState {
  Dormant = "dormant",
  Idle = "idle",
  HeroAction = "hero-action",
  EnemyAction = "enemy-action",
  Paused = "paused",
  Ended = "ended",
}

export type Character = (typeof allCharacters)[0];

export type PaneInfo =
  | { type: "text"; content: string }
  | {
      type: "list";
      content: { text: string; action: (...args: any) => void }[];
    }
  | { type: "none"; content: undefined };

export type Turn = {
  entityId: string;
  name: string;
  turnDuration: number;
  nextTurnAt: number;
  turnsPlayed: number;
};

let turnSequence: Turn[] = [];
let currentTurn = null;
let turnCount = 0;
let battleStarted = false;
let ongoingAttack = false;
let battleState: BattleState;

window.onclick = (e) => {
  const clickedCharacterSlot = ([...e.composedPath()] as HTMLElement[]).find(
    (el) => el?.classList?.contains("lane-slot") && el.id
  );

  if (clickedCharacterSlot) {
    console.log(e.composedPath());

    const selectedCharacter = allCharacters.find(
      (c) => clickedCharacterSlot.id === c.id
    ) as Character;

    window.dispatchEvent(
      new CustomEvent("target-selected", { detail: { selectedCharacter } })
    );
  }
};

window.addEventListener("target-selected", onTargetSelected);

function onTargetSelected(data: any) {
  const { selectedCharacter } = data.detail;
  console.log("onTargetSelected", { ...selectedCharacter });
}

// testBtn.onclick = () => {
//   if (!battleStarted || ongoingAttack) return;
//   updateTurnSequence();
// };

function chooseTargetForEnemy(enemy: Character): Character {
  let possibleTargets: Character[];

  if (enemy.actions.attack.type === "ranged") {
    possibleTargets = [...heroes];
  } else if (enemy.actions.attack.type === "melee") {
    const [heroesInTheFront, heroesInTheBack] = [
      heroes.filter((e) => e.position.lane === "front"),
      heroes.filter((e) => e.position.lane === "back"),
    ];
    if (heroesInTheFront.length > 0) {
      possibleTargets = [...heroesInTheFront];
    } else {
      possibleTargets = [...heroesInTheBack];
    }
  } else {
    possibleTargets = [...heroes];
  }

  const idx = Math.floor(Math.random() * possibleTargets.length);
  return possibleTargets[idx];
}

function drawCharacter(entity: Character): void {
  const battleLane = battleLanesUI.find(
    (el) =>
      el.classList.contains(`${entity.type}-lane`) &&
      el.classList.contains(`${entity.position.lane}-row`)
  )!;

  const slotIndices = {
    left: 0,
    center: 1,
    right: 2,
  } as const;

  const slotIdx =
    slotIndices[entity.position.col as "left" | "center" | "right"];

  const slot = Array.from(battleLane.children)[slotIdx];
  const [topSection, avatar, bottomSection] = Array.from(slot.children);
  const img = avatar.children[0] as HTMLImageElement;
  // const img = Array.from(avatar.children).find(
  //   (el) => el.tagName === "IMG"
  // ) as HTMLImageElement;

  slot.id = `${entity.id}`;
  topSection.textContent = entity.name;
  bottomSection.textContent = `HP ${entity.hp}`;
  img.src = entity.imgUrl;
}

function drawCharacters(): void {
  allCharacters.forEach(drawCharacter);

  // const activeCharacterSlot: string = currentTurn?.entityId ?? "";
  // console.log({ activeCharacterSlot, currentTurn });
}

async function drawSelectedCharacterOutline(entity: Character): Promise<void> {
  const prevSlot = document.querySelector(`.selected`);
  const slot = document.querySelector(`#${entity.id}`);

  prevSlot?.classList.remove("selected");
  slot?.classList.add("selected");

  console.log(`${entity.name}'s turn...`);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 750);
  });
}

function drawBattleState(): void {
  console.log(`%cBattleState ::: ${battleState}`, "color: lightgreen");
}

async function drawAttackEffect(
  attacker: Character,
  target: Character
): Promise<void> {
  const targetSlot = document.querySelector(`#${target.id}`)!;
  const attackerSlot = document.querySelector(`#${attacker.id}`)!;

  // const targetAvatarEl = Array.from(targetSlot?.children || []).find((el) =>
  //   el.classList.contains("avatar")
  // )!;

  // const attackerAvatarEl = Array.from(attackerSlot?.children || []).find((el) =>
  //   el.classList.contains("avatar")
  // )!;

  // const [targetImg, targetOverlay] = Array.from(targetAvatarEl?.children || []);
  // const [attackerImg, attackerOverlay] = Array.from(
  //   attackerAvatarEl?.children || []
  // );

  attackerSlot.classList.add(`${attacker.actions.attack.type}-attack-perform`);
  targetSlot.classList.add(`${attacker.actions.attack.type}-attack-receive`);

  // return new Promise((resolve) => setTimeout(resolve, 1000));

  return new Promise((resolve) => {
    setTimeout(() => {
      attackerSlot.classList.remove(
        `${attacker.actions.attack.type}-attack-perform`
      );
      targetSlot.classList.remove(
        `${attacker.actions.attack.type}-attack-receive`
      );

      console.log("removed classes");
      return resolve();
    }, 1000);
  });

  // console.log({
  //   attackerSlot,
  //   targetSlot,
  //   attackerImg,
  //   attackerOverlay,
  //   targetImg,
  //   targetOverlay,
  // });
}

function drawTurnSequence(): void {
  // console.log(turnCount, ...turnSequence);
  turnSequenceUI.innerHTML = "";

  for (let i = 0; i < turnSequence.length; i++) {
    const turn = turnSequence[i];
    const timeToNextTurn = turn.nextTurnAt - turnSequence[0].nextTurnAt;
    const timeToNextTurnStr =
      i === 0 ? " now" : i === 1 ? " next" : ` ${timeToNextTurn.toFixed(2)}`;

    const div = document.createElement("div");
    const nameText = document.createElement("small");
    const timeText = document.createElement("small");

    nameText.classList.add("character-name");
    nameText.textContent = turn.name;

    timeText.classList.add("time-to-next-turn");
    timeText.textContent = timeToNextTurnStr;

    div.classList.add("turn-item");
    div.append(nameText, timeText);

    turnSequenceUI.append(div);
  }
}

function setBattleState(state: BattleState) {
  battleState = state;
  drawBattleState();
}

function updateTurnSequence(): void {
  console.log(turnSequence);
  currentTurn = turnSequence.shift()!;

  const nextTurn = {
    ...currentTurn,
    nextTurnAt: calculateNextTurnTime(currentTurn),
    turnsPlayed: currentTurn.turnsPlayed + 1,
  };

  let insertionIdx = turnSequence.length;
  let smallestPositiveTimeDiff = Infinity;
  for (let i = 0; i < turnSequence.length; i++) {
    const timeDiff = turnSequence[i].nextTurnAt - nextTurn.nextTurnAt;

    if (timeDiff > 0 && timeDiff < smallestPositiveTimeDiff) {
      smallestPositiveTimeDiff = timeDiff;
      insertionIdx = i;
    }
  }

  turnCount++;
  turnSequence.splice(insertionIdx, 0, nextTurn);

  const character = allCharacters.find(
    (c) => c.id === turnSequence[0].entityId
  )!;

  handleCharacterTurn(character);
  drawTurnSequence();
}

async function aimToTarget(hero: Character) /* : Promise<Character> */ {
  // return enemy;
  // return hero;
}

// character turn controller >>>
async function handleCharacterTurn(entity: Character): Promise<void> {
  console.log(`it's ${entity.name}'s turn`);

  if (entity.type === "enemy") {
    const targetHero = chooseTargetForEnemy(entity);

    setBattleState(BattleState.EnemyAction);
    updateBottomPane(
      panes.enemyAction(
        `${entity.name} performs a ${entity.actions.attack.type} attack against ${targetHero.name}`
      )
    );

    await drawSelectedCharacterOutline(entity);
    await handleAttack(entity, targetHero);
  }
  //
  else if (entity.type === "hero") {
    setBattleState(BattleState.HeroAction);
    updateBottomPane(panes.heroActions());

    await drawSelectedCharacterOutline(entity);
    // await handleAttack(entity, targetHero);
    // fake we're waiting for a user command
    // TODO: fix that
    console.log("...fake delay");
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return new Promise((resolve) => {
    setBattleState(BattleState.Idle);
    updateBottomPane({ type: "none", content: undefined });

    setTimeout(() => {
      updateTurnSequence();
      resolve();
    }, 1000);
  });
}

async function handleAttack(attacker: Character, target: Character) {
  ongoingAttack = true;
  const attackPower = attacker.actions.attack.power;

  await drawAttackEffect(attacker, target);

  target.hp -= attackPower;
  drawCharacters();
  ongoingAttack = false;
}

function updateBottomPane(paneInfo: PaneInfo) {
  switch (paneInfo.type) {
    case "text":
      bottomSection.text.innerHTML = "";

      bottomSection.list.classList.add("hidden");
      bottomSection.text.classList.remove("hidden");

      bottomSection.text.textContent = paneInfo.content;
      break;
    case "list":
      bottomSection.list.innerHTML = "";

      bottomSection.list.classList.remove("hidden");
      bottomSection.text.classList.add("hidden");

      paneInfo.content.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.text;
        li.onclick = () => item.action();
        bottomSection.list.append(li);
      });
      break;
    case "none":
      bottomSection.text.innerHTML = "";
      bottomSection.list.innerHTML = "";

      bottomSection.list.classList.add("hidden");
      bottomSection.text.classList.add("hidden");
      break;
  }
}

function initializeTurnSequence() {
  turnSequence = allCharacters
    .map((c) => ({
      entityId: c.id,
      name: c.name,
      turnDuration: getTurnDuration(c.speed),
      nextTurnAt: getTurnDuration(c.speed),
      turnsPlayed: 0,
    }))
    .sort((a, b) => a.nextTurnAt - b.nextTurnAt);

  drawTurnSequence();

  // run initial turn
  setTimeout(() => {
    turnCount++;
    battleStarted = true;
    handleCharacterTurn(allCharacters[0]);
  }, 2000);
}

function main() {
  setBattleState(BattleState.Dormant);
  updateBottomPane(panes.battleStart());

  drawCharacters();

  initializeTurnSequence();
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
