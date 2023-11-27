import {
  battleLanesUI,
  getSlotEfxOverlayById,
  getSlotElementById,
  timelineUI,
  turnCountUI,
  bottomSection,
  dismissBtn,
  getSlotDefenseOverlayById,
} from "./dom";
import { ActionName, StatusName } from "./enums";
import { getAllCharacters, getTimeline, getCharacterById } from "./globals";
import { Action, Character, InventoryItem, PaneInfo, Status } from "./types";
import { wait } from "./utils";

function drawCharacters(): void {
  getAllCharacters().forEach((entity) => {
    const battleLane = battleLanesUI.find(
      (el) => el.classList.contains(`${entity.type}-lane`) && el.classList.contains(`${entity.position.lane}-row`)
    )!;

    const slotIndices = {
      left: 0,
      center: 1,
      right: 2,
    } as const;

    const slotIdx = slotIndices[entity.position.col as "left" | "center" | "right"];

    const slot = Array.from(battleLane.children)[slotIdx];
    const [topSection, avatar, bottomSection] = Array.from(slot.children);
    const img = avatar.children[0] as HTMLImageElement;
    // const overlayEl = Array.from(slot.children).find((el) =>
    //   el.classList.contains("efx-overlay")
    // );

    // console.log({ slot, overlayEl });

    slot.id = `${entity.id}`;
    topSection.textContent = entity.name;
    bottomSection.textContent = `HP ${entity.hp} MP ${entity.mp}`;
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

  for (let i = 0; i < getTimeline().length; i++) {
    const turn = getTimeline()[i];
    const timeToNextTurn = turn.nextTurnAt - getTimeline()[0].nextTurnAt;
    const timeToNextTurnStr = i === 0 ? " now" : ` ${timeToNextTurn.toFixed(2)}`;
    // i === 0 ? " now" : i === 1 ? " next" : ` ${timeToNextTurn.toFixed(2)}`;

    const div = document.createElement("div");
    const nameText = document.createElement("small");
    const timeText = document.createElement("small");

    nameText.classList.add("character-name");

    if (turn.type === "status") {
      nameText.textContent = `🧪${getCharacterById(turn.characterId).name}`;
    } else {
      nameText.textContent = turn.entity.name;
    }

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

async function drawAttackEffect(attacker: Character, target: Character, action: Action): Promise<void> {
  const targetSlot = getSlotElementById(target.id);
  const attackerSlot = getSlotElementById(attacker.id);

  if (action.type !== "physical") return;

  const attackType = action.ranged ? "melee" : "ranged";

  attackerSlot.classList.add(`${attackType}-attack-perform`);
  targetSlot.classList.add(`${attackType}-attack-receive`);

  await wait(1000);

  attackerSlot.classList.remove(`${attackType}-attack-perform`);
  targetSlot.classList.remove(`${attackType}-attack-receive`);

  return Promise.resolve();
}

async function drawAMagicEffect(attacker: Character, target: Character, action: Action): Promise<void> {
  const targetSlot = getSlotElementById(target.id);
  const attackerSlot = getSlotElementById(attacker.id);

  if (action.type !== "magical") return;

  // const attackType = action.ranged ? "melee" : "ranged";

  attackerSlot.classList.add(`magic-perform`);
  targetSlot.classList.add(`magic-receive`);

  await wait(1000);

  attackerSlot.classList.remove(`magic-perform`);
  targetSlot.classList.remove(`magic-receive`);

  return Promise.resolve();
}

async function drawDefenseEffect(hero: Character): Promise<void> {
  const slotEl = getSlotElementById(hero.id);
  const overlayEl = getSlotDefenseOverlayById(hero.id);

  slotEl?.classList.add(`defense-perform`);
  overlayEl?.classList.add(`defending`); // will be removed at the beginning of next turn

  await wait(900);
  slotEl?.classList.remove(`defense-perform`);
}

async function drawItemEffect(
  // item: InventoryItem,
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

async function drawStatusEffect(statusName: StatusName, characterId: string) {
  const slot = getSlotElementById(characterId);

  if (statusName === StatusName.Poison) {
    slot.classList.add(`${statusName.toLocaleLowerCase()}-status`);
    await wait(1250);
    slot.classList.remove(`${statusName.toLocaleLowerCase()}-status`);
  }

  return Promise.resolve();
}

function drawTurnCount(turn: number) {
  if (turnCountUI?.classList.contains("hidden")) {
    turnCountUI?.classList.remove("hidden");
  }
  const outputEl = turnCountUI?.children[0] as HTMLOutputElement;
  outputEl.textContent = String(turn);
}

function drawBottomPane(paneInfo: PaneInfo, dismissFn?: () => void) {
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

  if (dismissFn) {
    dismissBtn.classList.remove("hidden");
    dismissBtn.onclick = () => dismissFn();
  } else {
    dismissBtn.classList.add("hidden");
    dismissBtn.onclick = null;
  }
}

export {
  drawTimeline,
  drawCharacters,
  drawSelectedCharacterOutline,
  drawTurnCount,
  drawAttackEffect,
  drawAMagicEffect,
  drawDefenseEffect,
  drawItemEffect,
  drawStatusEffect,
  drawBottomPane,
};
