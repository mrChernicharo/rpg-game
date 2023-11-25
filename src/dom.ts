import { timeline } from "./globals";

const battleUI = document.querySelector("#battle-ui");

const battleLanesUI = Array.from(document.querySelectorAll(".battle-lane"));
const timelineUI = document.querySelector("#timeline")!;

const turnCountUI = document.querySelector("#turn-count");

const bottomSection = {
  text: document.querySelector("#bottom-pane > #text-content")!,
  list: document.querySelector("#bottom-pane > #list-content")!,
};

const slots = Array.from(
  document.querySelectorAll(".lane-slot")
) as HTMLLIElement[];

const testBtn = document.querySelector("#test-btn") as HTMLButtonElement;
const testBtn2 = document.querySelector("#test-btn-2") as HTMLButtonElement;
const dismissBtn = document.querySelector("#dismiss-btn") as HTMLButtonElement;

const [enemyBackSlots, enemyFrontSlots, heroFrontSlots, heroBackSlots] = [
  battleLanesUI[0].children,
  battleLanesUI[1].children,
  battleLanesUI[2].children,
  battleLanesUI[3].children,
].map((HTMLels) => Array.from(HTMLels));

const getSlotElementById = (characterId: string) =>
  document.querySelector(`#${characterId}`)!;

const getAvatarElementById = (characterId: string) =>
  Array.from(getSlotElementById(characterId)?.children || []).find((el) =>
    el.classList.contains("avatar")
  )!;

const getAvatarImgElementById = (characterId: string) =>
  Array.from(getAvatarElementById(characterId).children)[0];

const getSlotEfxOverlayById = (characterId: string) =>
  Array.from(getSlotElementById(characterId).children).find((child) =>
    child.classList.contains("efx-overlay")
  );

const getSlotDefenseOverlayById = (characterId: string) =>
  Array.from(getSlotElementById(characterId).children).find((child) =>
    child.classList.contains("defense-overlay")
  );

const getSlotStatusOverlayById = (characterId: string) =>
  Array.from(getSlotElementById(characterId).children).find((child) =>
    child.classList.contains("status-overlay")
  );

setTimeout(() => {
  const nextUpCharacterId = timeline.filter((o) => o.type === "character")[0]
    .entity.id;
  const efx = getSlotEfxOverlayById(nextUpCharacterId);
  const defense = getSlotDefenseOverlayById(nextUpCharacterId);
  const status = getSlotStatusOverlayById(nextUpCharacterId);

  console.log({ nextUpCharacterId, efx, defense, status });
}, 2500);

export {
  slots,
  battleUI,
  battleLanesUI,
  testBtn,
  testBtn2,
  dismissBtn,
  timelineUI,
  turnCountUI,
  bottomSection,
  getSlotElementById,
  getAvatarElementById,
  getAvatarImgElementById,
  getSlotEfxOverlayById,
  getSlotDefenseOverlayById,
  getSlotStatusOverlayById,
};
