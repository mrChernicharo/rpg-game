export const getAllScreens = () => Array.from(document.querySelectorAll('section[id$="screen"]'));
export const getCurrentScreen = () => getAllScreens().find((s) => !s.classList.contains("hidden"));

export const getBattleScreenBtn = () => document.querySelector("#battle-screen-btn") as HTMLButtonElement;
export const getDungeonScreenBtn = () => document.querySelector("#dungeon-screen-btn") as HTMLButtonElement;
export const getMainMenuScreenBtn = () => document.querySelector("#main-menu-screen-btn") as HTMLButtonElement;

//////////////////////////////////////////////////////

export const getMainMenuHeroesUL = () => document.querySelector("#main-menu-screen > #heroes");

export const equipmentMenuBtn = document.querySelector("#equipment-menu-btn") as HTMLButtonElement;
export const magicMenuBtn = document.querySelector("#magic-menu-btn") as HTMLButtonElement;
export const skillsMenuBtn = document.querySelector("#skills-menu-btn") as HTMLButtonElement;
export const itemsMenuBtn = document.querySelector("#items-menu-btn") as HTMLButtonElement;
export const settingsMenuBtn = document.querySelector("#settings-menu-btn") as HTMLButtonElement;

export const mainMenuBtns = [equipmentMenuBtn, magicMenuBtn, skillsMenuBtn, itemsMenuBtn, settingsMenuBtn];

export const getEquipmentMenuHeroSelectionUL = () => document.querySelector("#equipment-menu-hero-selection-list")!;

//////////////////////////////////////////////////////

export const battleUI = document.querySelector("#battle-ui")!;

export const battleLanesUI = Array.from(document.querySelectorAll(".battle-lane"))!;
export const timelineUI = document.querySelector("#timeline")!;

export const turnCountUI = document.querySelector("#turn-count")!;

export const bottomSection = {
  text: document.querySelector("#bottom-pane > #text-content")!,
  list: document.querySelector("#bottom-pane > #list-content")!,
};

export const slots = Array.from(document.querySelectorAll(".lane-slot")) as HTMLLIElement[];

export const dismissBtn = document.querySelector("#dismiss-btn") as HTMLButtonElement;

export const [enemyBackSlots, enemyFrontSlots, heroFrontSlots, heroBackSlots] = [
  battleLanesUI[0].children,
  battleLanesUI[1].children,
  battleLanesUI[2].children,
  battleLanesUI[3].children,
].map((HTMLels) => Array.from(HTMLels));

export const getSlotElementById = (characterId: string) => document.querySelector(`#${characterId}`)!;

export const getAvatarElementById = (characterId: string) =>
  Array.from(getSlotElementById(characterId)?.children || []).find((el) => el.classList.contains("avatar"))!;

export const getAvatarImgElementById = (characterId: string) =>
  Array.from(getAvatarElementById(characterId).children)[0];

export const getSlotEfxOverlayById = (characterId: string) =>
  Array.from(getSlotElementById(characterId).children).find((child) => child.classList.contains("efx-overlay"));

export const getSlotDefenseOverlayById = (characterId: string) =>
  Array.from(getSlotElementById(characterId).children).find((child) => child.classList.contains("defense-overlay"));

export const getSlotStatusOverlayById = (characterId: string) =>
  Array.from(getSlotElementById(characterId).children).find((child) => child.classList.contains("status-overlay"));

export const getNumbersOverlayById = (characterId: string) =>
  Array.from(getSlotElementById(characterId).children).find((child) => child.classList.contains("numbers-overlay"))!;
