const battleUI = document.querySelector("#battle-ui");

const battleLanesUI = Array.from(document.querySelectorAll(".battle-lane"));
const timelineUI = document.querySelector("#timeline")!;

const turnCountUI = document.querySelector("#turn-count");

const bottomSection = {
  text: document.querySelector("#bottom-pane > #text-content")!,
  list: document.querySelector("#bottom-pane > #list-content")!,
};

// const [enemyBackSlots, enemyFrontSlots, heroFrontSlots, heroBackSlots] = [
//   battleLanesUI[0].children,
//   battleLanesUI[1].children,
//   battleLanesUI[2].children,
//   battleLanesUI[3].children,
// ].map((HTMLels) => Array.from(HTMLels));

const slots = Array.from(document.querySelectorAll(".lane-slot"));

const getSlotElementById = (id: string) => document.querySelector(`#${id}`)!;

const getAvatarElementById = (id: string) =>
  Array.from(getSlotElementById(id)?.children || []).find((el) =>
    el.classList.contains("avatar")
  )!;

const getAvatarImgElementById = (id: string) =>
  Array.from(getAvatarElementById(id).children)[0];

const getAvatarOverlayElementById = (id: string) =>
  Array.from(getAvatarElementById(id).children)[1];
// const [targetImg, targetOverlay] = Array.from(targetAvatarEl?.children || []);

const testBtn = document.querySelector("#test-btn") as HTMLButtonElement;
const testBtn2 = document.querySelector("#test-btn-2") as HTMLButtonElement;

export {
  battleUI,
  battleLanesUI,
  timelineUI,
  turnCountUI,
  bottomSection,
  slots,
  testBtn,
  testBtn2,
  getSlotElementById,
  getAvatarElementById,
  getAvatarImgElementById,
  getAvatarOverlayElementById,
  // enemyBackSlots,
  // enemyFrontSlots,
  // heroFrontSlots,
  // heroBackSlots,
};
