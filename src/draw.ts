import { battleLanesUI, timelineUI, turnCountUI } from "./dom";
import { allCharacters, timeline } from "./globals";
import { Character } from "./types";

function drawCharacters(): void {
  allCharacters.forEach((entity) => {
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
  });
}

function drawTimeline(): void {
  // console.log(turnCount, ...turnSequence);
  timelineUI.innerHTML = "";

  for (let i = 0; i < timeline.length; i++) {
    const turn = timeline[i];
    const timeToNextTurn = turn.nextTurnAt - timeline[0].nextTurnAt;
    const timeToNextTurnStr =
      i === 0 ? " now" : i === 1 ? " next" : ` ${timeToNextTurn.toFixed(2)}`;

    const div = document.createElement("div");
    const nameText = document.createElement("small");
    const timeText = document.createElement("small");

    nameText.classList.add("character-name");
    nameText.textContent = turn.entity.name;

    timeText.classList.add("time-to-next-turn");
    timeText.textContent = timeToNextTurnStr;

    div.classList.add("turn-item");
    div.append(nameText, timeText);

    timelineUI.append(div);
  }
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

      resolve();
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

async function drawDefendEffect(hero: Character): Promise<void> {
  console.log("drawDefendEffect...", hero.name);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 600);
  });
}

function drawTurnCount(turn: number) {
  const outputEl = turnCountUI?.children[0] as HTMLOutputElement;
  outputEl.textContent = String(turn);

  console.log({ outputEl, turnCountUI, turn });
}

export {
  drawCharacters,
  drawTurnCount,
  drawTimeline,
  drawSelectedCharacterOutline,
  drawAttackEffect,
  drawDefendEffect,
};
