import { STATUS_ICONS } from "./data";
import {
  battleLanesUI,
  getSlotEfxOverlayById,
  getSlotElementById,
  timelineUI,
  turnCountUI,
  bottomSection,
  dismissBtn,
  getSlotDefenseOverlayById,
  battleUI,
} from "./dom";
import { ActionName, StatusName } from "./enums";
import { getAllCharacters, getTimeline, getCharacterById } from "./globals";
import { panes } from "./infoPane";
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
      const icon = STATUS_ICONS[turn.entity.name as StatusName];
      nameText.textContent = `${icon}${getCharacterById(turn.characterId).name}`;
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

  if (!["melee", "ranged"].includes(action.type)) return;

  // console.log(`:::::${action.type}-attack-receive`);

  attackerSlot.classList.add(`${action.type}-attack-perform`);
  targetSlot.classList.add(`${action.type}-attack-receive`);

  await wait(1000);

  attackerSlot.classList.remove(`${action.type}-attack-perform`);
  targetSlot.classList.remove(`${action.type}-attack-receive`);

  return Promise.resolve();
}

async function drawStealEffect(attacker: Character, target: Character, action: Action): Promise<void> {
  const targetSlot = getSlotElementById(target.id);
  const attackerSlot = getSlotElementById(attacker.id);

  attackerSlot.classList.add(`steal-perform`);
  targetSlot.classList.add(`steal-receive`);

  await wait(800);

  attackerSlot.classList.remove(`steal-perform`);
  targetSlot.classList.remove(`steal-receive`);

  return Promise.resolve();
}

async function drawAMagicEffect(attacker: Character, target: Character, action: Action): Promise<void> {
  const targetSlot = getSlotElementById(target.id);
  const attackerSlot = getSlotElementById(attacker.id);

  if (action.type !== "magical") return;

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

  slot.classList.add(`${statusName.toLocaleLowerCase()}-status`);
  await wait(1100);
  slot.classList.remove(`${statusName.toLocaleLowerCase()}-status`);
}

function drawTurnCount(turn: number) {
  if (turnCountUI?.classList.contains("hidden")) {
    turnCountUI?.classList.remove("hidden");
  }
  const outputEl = turnCountUI?.children[0] as HTMLOutputElement;
  outputEl.textContent = String(turn);
}

async function drawActionPane(action: Action, actor: Character, target: Character) {
  console.log("DRAW ACTION PANE", { actionName: action.name, action, actor, target });

  switch (action.type) {
    case "melee":
    case "ranged":
      drawBottomPane({ type: "text", content: `${actor.name} attacks ${target.name}` });
      break;
    case "magical":
      drawBottomPane({ type: "text", content: `${actor.name} casts ${action.name} on ${target.name}` });
      break;
    case "item":
      drawBottomPane({ type: "text", content: `${target.name} received ${action.name}` });
      break;
    case "status":
      if (action.name === StatusName.Poison) {
        drawBottomPane({
          type: "text",
          content: `${target.name} received ${action.power!} HP of ${action.name} damage`,
        });
      }
      if (action.name === StatusName.Regen) {
        drawBottomPane({ type: "text", content: `${target.name} regenerated ${action.power!} HP` });
      }
      break;
    case "steal":
      drawBottomPane({ type: "text", content: `stealing from ${target.name}` });
      break;
    case "defend":
      drawBottomPane(panes.text(`${actor.name} defends`));
      break;
    case "hide":
      drawBottomPane({ type: "text", content: `${target.name} is hidden` });
      break;
    case "move":
      drawBottomPane({ type: "text", content: `${target.name} is on the move` });
      break;
  }

  // switch (action.name) {
  //   case ActionName.Defend:
  //     break;
  //   case ActionName.Steal:
  //     break;
  //   case ActionName.Summon:
  //     drawBottomPane({ type: "text", content: `${actor.name} summoned ${action.name}` });
  //     break;
  //   case ActionName.Invoke:
  //     drawBottomPane({ type: "text", content: `${actor.name} invoked ${action.name}` });
  //     break;
  //   case ActionName.Move:
  //     break;
  //   case ActionName.Hide:
  //     break;
  //   default:
  //     break;
  // }

  await wait(1000);
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

      paneInfo.content.forEach((item, i) => {
        const button = document.createElement("button");
        button.classList.add("list-btn", item.text.replaceAll(" ", "-"));
        button.textContent = item.text;
        button.onclick = () => item.action();

        const li = document.createElement("li");
        li.classList.add("list-option", item.text.replaceAll(" ", "-"));

        li.append(button);
        bottomSection.list.append(li);

        // if (i === 0) {
        //   button.focus();
        // }
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
  drawStealEffect,
  drawAMagicEffect,
  drawDefenseEffect,
  drawItemEffect,
  drawStatusEffect,
  drawActionPane,
  drawBottomPane,
};
