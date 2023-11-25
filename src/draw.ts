import {
  battleLanesUI,
  getSlotOverlayElementById,
  getSlotElementById,
  timelineUI,
  turnCountUI,
  bottomSection,
  dismissBtn,
} from "./dom";
import { allCharacters, timeline } from "./globals";
import { Character, InventoryItem, PaneInfo, Status } from "./types";
import { wait } from "./utils";

async function drawStatusEffect(status: Status, characterId: string) {
  const slot = getSlotElementById(characterId);
  console.log("drawStatusEffect", { slot, status });

  await wait(1150);
  return Promise.resolve();
}

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
    // const overlayEl = Array.from(slot.children).find((el) =>
    //   el.classList.contains("img-efx-overlay")
    // );

    // console.log({ slot, overlayEl });

    slot.id = `${entity.id}`;
    topSection.textContent = entity.name;
    bottomSection.textContent = `HP ${entity.hp}`;
    img.src = entity.imgUrl;

    if (entity.hp <= 0) {
      slot?.classList.add("dead");
    } else if (slot?.classList.contains("dead")) {
      slot?.classList.remove("dead");
    }
  });
}

function drawTimeline(): void {
  // console.log(turnCount, ...turnSequence);
  timelineUI.innerHTML = "";

  for (let i = 0; i < timeline.length; i++) {
    const turn = timeline[i];
    const timeToNextTurn = turn.nextTurnAt - timeline[0].nextTurnAt;
    const timeToNextTurnStr =
      i === 0 ? " now" : ` ${timeToNextTurn.toFixed(2)}`;
    // i === 0 ? " now" : i === 1 ? " next" : ` ${timeToNextTurn.toFixed(2)}`;

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

async function drawItemEffect(
  item: InventoryItem,
  sender: Character,
  receiver: Character
): Promise<void> {
  const senderSlot = getSlotElementById(sender.id);
  const receiverSlot = getSlotElementById(receiver.id);

  // @TODO: different classes and animations for different items
  senderSlot.classList.add("item-send");
  receiverSlot.classList.add("item-receive");

  await wait(1500);

  senderSlot.classList.remove("item-send");
  receiverSlot.classList.remove("item-receive");
  return Promise.resolve();
}

function drawTurnCount(turn: number) {
  if (turnCountUI?.classList.contains("hidden")) {
    turnCountUI?.classList.remove("hidden");
  }
  const outputEl = turnCountUI?.children[0] as HTMLOutputElement;
  outputEl.textContent = String(turn);
}

function drawBottomPane(paneInfo: PaneInfo, showDismissBtn = false) {
  bottomSection.text.innerHTML = "";
  bottomSection.list.innerHTML = "";

  // console.log("drawBottomPane", timeline[0]?.entity?.name, paneInfo);

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

        li.textContent = item.text;
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

  if (showDismissBtn) {
    dismissBtn.classList.remove("hidden");
  } else {
    dismissBtn.classList.add("hidden");
  }
}

export {
  drawTimeline,
  drawCharacters,
  drawSelectedCharacterOutline,
  drawAttackEffect,
  drawTurnCount,
  drawDefenseEffect,
  drawBottomPane,
  drawItemEffect,
  drawStatusEffect,
};
