import {
  battleLanesUI,
  getSlotOverlayElementById,
  getSlotElementById,
  timelineUI,
  turnCountUI,
  bottomSection,
} from "./dom";
import { allCharacters, timeline } from "./globals";
import { Character, PaneInfo } from "./types";
import { wait } from "./utils";

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

  return Promise.resolve();
}

async function drawAttackEffect(
  attacker: Character,
  target: Character
): Promise<void> {
  const targetSlot = getSlotElementById(target.id);
  const attackerSlot = getSlotElementById(attacker.id);

  attackerSlot.classList.add(`${attacker.actions.attack.type}-attack-perform`);
  targetSlot.classList.add(`${attacker.actions.attack.type}-attack-receive`);

  await wait(1000);

  attackerSlot.classList.remove(
    `${attacker.actions.attack.type}-attack-perform`
  );
  targetSlot.classList.remove(`${attacker.actions.attack.type}-attack-receive`);

  return Promise.resolve();
}

async function drawDefenseEffect(hero: Character): Promise<void> {
  const slotEl = getSlotElementById(hero.id);
  const overlayEl = getSlotOverlayElementById(hero.id);

  slotEl?.classList.add(`defense-perform`);
  overlayEl?.classList.add(`defending`); // will be removed at the beginning of next turn

  await wait(900);
  slotEl?.classList.remove(`defense-perform`);
}

function drawTurnCount(turn: number) {
  const outputEl = turnCountUI?.children[0] as HTMLOutputElement;
  outputEl.textContent = String(turn);
}

function drawBottomPane(paneInfo: PaneInfo) {
  bottomSection.text.innerHTML = "";
  bottomSection.list.innerHTML = "";

  console.log("drawBottomPane", timeline[0]?.entity?.name, paneInfo);

  switch (paneInfo.type) {
    case "text":
      bottomSection.list.classList.add("hidden");
      bottomSection.text.classList.remove("hidden");

      bottomSection.text.textContent = paneInfo.content;
      break;
    case "list":
      bottomSection.list.classList.remove("hidden");
      bottomSection.text.classList.add("hidden");

      paneInfo.content.forEach((item) => {
        const li = document.createElement("li");

        const text = item.extra ? `${item.text} ${item.extra}` : item.text;

        li.textContent = text;
        li.classList.add("list-option", item.text.replaceAll(" ", "-"));
        li.onclick = () => item.action();
        bottomSection.list.append(li);
      });
      break;
    case "none":
      bottomSection.list.classList.add("hidden");
      bottomSection.text.classList.add("hidden");
      break;
  }
}

export {
  drawTimeline,
  drawCharacters,
  drawCharacter,
  drawSelectedCharacterOutline,
  drawAttackEffect,
  drawTurnCount,
  drawDefenseEffect,
  drawBottomPane,
};
