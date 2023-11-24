export const battleUI = document.querySelector("#battle-ui");

export const battleLanesUI = Array.from(
  document.querySelectorAll(".battle-lane")
);
export const timelineUI = document.querySelector("#timeline")!;

export const turnCountUI = document.querySelector("#turn-count");

export const bottomSection = {
  text: document.querySelector("#bottom-pane > #text-content")!,
  list: document.querySelector("#bottom-pane > #list-content")!,
};

export const [enemyBackSlots, enemyFrontSlots, heroFrontSlots, heroBackSlots] =
  [
    battleLanesUI[0].children,
    battleLanesUI[1].children,
    battleLanesUI[2].children,
    battleLanesUI[3].children,
  ].map((HTMLels) => Array.from(HTMLels));

export const slots = Array.from(document.querySelectorAll(".lane-slot"));

export const testBtn = document.querySelector("#test-btn") as HTMLButtonElement;
export const testBtn2 = document.querySelector(
  "#test-btn-2"
) as HTMLButtonElement;

export const getSlotElementById = (characterId: string) =>
  document.querySelector(`#${characterId}`)!;

export const getAvatarElementById = (characterId: string) =>
  Array.from(getSlotElementById(characterId)?.children || []).find((el) =>
    el.classList.contains("avatar")
  )!;

export const getAvatarImgElementById = (characterId: string) =>
  Array.from(getAvatarElementById(characterId).children)[0];

export const getSlotOverlayElementById = (characterId: string) =>
  Array.from(getSlotElementById(characterId).children).find((child) =>
    child.classList.contains("img-efx-overlay")
  );
