import { startBattle } from "./battle/battle";
import { addInventoryItem, getAllHeroes, inventory, subtractFromInventory } from "./battle/globals";
import { INVENTORY_LIST } from "./data";
import {
  getAllScreens,
  getBattleScreenBtn,
  getDungeonScreenBtn,
  getEquipmentMenuHeroSelectionUL,
  getMainMenuHeroesUL,
  getMainMenuScreenBtn,
  mainMenuBtns,
} from "./dom";
import { EquipmentSlot, GameScreen, InventoryItemName, InventoryItemType } from "./enums";
import { Character, EquipmentItem, EquipmentItemWithQuantity, InventoryItem, MenuState } from "./types";

export const menuState: MenuState = {
  selectedHero: null,
};

getDungeonScreenBtn().onclick = () => showScreen(GameScreen.Dungeon);
getMainMenuScreenBtn().onclick = () => showScreen(GameScreen.MainMenu);
getBattleScreenBtn().onclick = () => {
  showScreen(GameScreen.Battle);
  startBattle();
};

function onHeroSelected() {
  const hero = menuState.selectedHero!;
  console.log("menuState.selectedHero ->", hero.name, {
    menuState,
    hero,
  });

  drawHeroEquipmentSubMenu(hero);
}

function updateBackToMenuLinks() {
  const backToMainMenu = Array.from(document.querySelectorAll(".back-to-main-menu")) as HTMLAnchorElement[];

  backToMainMenu.forEach((bl) => {
    bl.onclick = () => {
      showScreen(GameScreen.MainMenu);
    };
  });
}

function updateBackToHomeLinks() {
  const backToHomeLinks = Array.from(document.querySelectorAll(".back-to-home")) as HTMLAnchorElement[];

  backToHomeLinks.forEach((bl) => {
    bl.onclick = () => {
      showScreen(GameScreen.Home);
    };
  });
}

function setMainMenuBtns() {
  mainMenuBtns.forEach((btn) => {
    const screen = btn.id.replace("-btn", "") as GameScreen;
    btn.onclick = () => {
      showScreen(screen);
    };
  });
}

export function showScreen(screen: GameScreen) {
  const screens = getAllScreens();
  screens.forEach((s) => {
    if (s.id.startsWith(screen)) {
      s.classList.remove("hidden");
    } else {
      s.classList.add("hidden");
    }
  });

  if (screen === GameScreen.Home) {
    updateBackToHomeLinks();
  }

  if (screen === GameScreen.EquipmentMenu) {
    drawEquipmentMenu();
  }
}

export function drawMainMenu() {
  const heroesUl = getMainMenuHeroesUL();

  getAllHeroes().forEach((h) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div id=${h.id} class="main-menu-hero">
        <div class="hero-img">
          <img src=${h.imgUrl} />
        </div>
        
        <div class="hero-info">
          <div>
            <span>${h.name}</span>
          </div>
        
          <div>
            <span>Lv ${h.level}</span>
            <span>XP ${h.xp}</span>
          </div>
                  
          <div>
            <span>HP ${h.hp}</span>
            <span>MP ${h.mp}</span>
          </div>

          <div>
            <span>To next Level ${670} XP</span>
          </div>

        </div>
      </div>
    `;
    heroesUl?.append(li);
  });

  setMainMenuBtns();
  updateBackToMenuLinks();
  updateBackToHomeLinks();
}

export function drawEquipmentMenu() {
  const heroSelectionList = getEquipmentMenuHeroSelectionUL();
  heroSelectionList.innerHTML = "";

  // DRAW SMALL HERO SELECTION LIST
  getAllHeroes().forEach((h) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div id=${h.id} class="hero-selection-list-item">
        <button class="hero-img-small">
          <img src=${h.imgUrl} width="48" height="48"/>
        </button>
      </div>
    `;

    heroSelectionList.append(li);

    const heroIconBtns = Array.from(document.querySelectorAll(".hero-img-small")) as HTMLButtonElement[];

    heroIconBtns.forEach((btn) => {
      if (btn.parentElement!.id === h.id) {
        btn.onclick = () => {
          menuState.selectedHero = h;
          onHeroSelected();
        };
      }
    });
  });

  // DRAW BLANK EQUIPMENT SUBMENU
  drawHeroEquipmentSubMenu();
}

function drawHeroEquipmentSubMenu(hero?: Character) {
  const menuHeading = document.querySelector("#hero-equipment-sub-menu > .hero-equipment-sub-menu-heading")!;

  if (!hero) {
    menuHeading.textContent = "Select Hero";
  } else {
    menuHeading.textContent = hero.name;

    drawEquipmentWidget(hero);
  }
}

function drawEquipmentWidget(hero: Character) {
  if (hero.type !== "hero") throw Error("cannot draw widget");

  const equipmentWidget = document.querySelector("#hero-equipment-widget")!;

  const equipmentSlotNames = [
    EquipmentSlot.Head,
    EquipmentSlot.Body,
    EquipmentSlot.Feet,
    EquipmentSlot.Weapon,
    EquipmentSlot.Shield,
    EquipmentSlot.Accessory,
    EquipmentSlot.Accessory2,
  ];

  const slotTemplates = equipmentSlotNames.map(
    (slotName) => `
        <div id=${slotName} class="equipment-slot">
          ${
            hero.equipment[slotName]
              ? `<img src=${hero.equipment[slotName]?.imgURL} width="48" height="48" class="equipment-sprite ${
                  hero.equipment[slotName]!.name
                }" />`
              : ``
          }
        </div>
        <div class="context-popover hidden">popover</div>
      `
  );

  equipmentWidget.innerHTML = slotTemplates.join("");

  const slots = Array.from(equipmentWidget.children) as HTMLDivElement[];
  slots.forEach((slot) => {
    const equipmentSpriteImg = Array.from(slot.children).find((child) => child.className.includes("equipment-sprite"));
    const contextPopover = slot.nextElementSibling as HTMLDivElement;
    // const contextPopover = Array.from(slot.children).find((child) => child.className.includes("context-popover"));
    const slotName = slot.id as EquipmentSlot;
    console.log(slot, slotName);

    const slotClick = () => {
      console.log({ equipmentSpriteImg, slot, hero });

      if (equipmentSpriteImg) {
        const itemName = equipmentSpriteImg.classList.toString().split(" ")[1] as InventoryItemName;
      } else {
        drawEquipmentSelectionWindow(hero, slotName);
      }
    };

    const onMouseLeave = () => {
      if (equipmentSpriteImg && contextPopover) {
        const itemName = equipmentSpriteImg.classList.toString().split(" ")[1] as InventoryItemName;

        console.log(contextPopover, itemName);
        contextPopover.classList.add("hidden");
        contextPopover.innerHTML = "";
      }
    };

    const onMouseEnter = () => {
      console.log({ contextPopover, slot });

      if (equipmentSpriteImg && contextPopover) {
        const itemName = equipmentSpriteImg.classList.toString().split(" ")[1] as InventoryItemName;

        console.log(contextPopover, itemName);
        contextPopover?.classList.remove("hidden");

        // prettier-ignore
        contextPopover.innerHTML = `
            <span>${itemName}</span>
            <img src=${hero.equipment[slotName]?.imgURL} width="48" height="48" class="equipment-sprite ${hero.equipment[slotName]!.name}" />
            <button id="remove-${itemName}">🗑</button>
        `;

        contextPopover.onmouseleave = onMouseLeave;

        const removeEquipmentButton = document.querySelector(`button#remove-${itemName}`) as HTMLButtonElement;
        removeEquipmentButton.onclick = () => {
          unequipEquipment(hero, slotName, itemName);
        };
      }
    };

    slot.onclick = slotClick;
    slot.onmouseenter = onMouseEnter;
  });
}

function isEquipmentAvailableToEquip(item: EquipmentItemWithQuantity) {
  // console.log("isEquipmentAvailableToEquip", item);
  if (item.quantity > 0) return true;
  else return false;
}

function equipEquipment(hero: Character, slot: EquipmentSlot, itemName: InventoryItemName) {
  if (hero.type !== "hero") throw Error("cannot equip");

  const item = INVENTORY_LIST.find((eq) => eq.name === itemName) as EquipmentItemWithQuantity;
  const { quantity, ...equipmentItem } = item;

  hero.equipment[slot] = equipmentItem;

  console.log("equip!");

  subtractFromInventory(itemName);

  drawHeroEquipmentSubMenu(hero);
  closeEquipmentSelectionWindow();
}
function unequipEquipment(hero: Character, slot: EquipmentSlot, itemName: InventoryItemName) {
  if (hero.type !== "hero") throw Error("cannot unequip");
  hero.equipment[slot] = null;
  addInventoryItem(itemName);

  drawHeroEquipmentSubMenu(hero);
}

function drawEquipmentSelectionWindow(hero: Character, slotName: EquipmentSlot) {
  if (hero.type !== "hero") throw Error("cannot draw window");

  // console.log("drawEquipmentSelectionWindow", hero, slotName);

  // const selectionWindow = document.querySelector("#hero-equipment-selection-window")!;
  const selectionHeading = document.getElementById("hero-equipment-selection-window-heading")!;
  const selectionWindowUL = document.querySelector("#hero-equipment-selection-window-list")!;

  const equipmentItems = inventory.filter(
    (item) => item.type === InventoryItemType.Equipment
  ) as EquipmentItemWithQuantity[];

  const slotItems = equipmentItems.filter((item) => slotName.includes(item.slot));
  const availableItems = slotItems.filter(isEquipmentAvailableToEquip);

  selectionHeading.textContent = slotName;
  selectionWindowUL.innerHTML = "";
  availableItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity}`;
    li.onclick = () => {
      equipEquipment(hero, slotName, item.name);
    };
    selectionWindowUL.append(li);
  });

  // console.log(hero, { slotName, equipmentItems, availableItems, slotItems, selectionWindow });
}

function closeEquipmentSelectionWindow() {
  const selectionHeading = document.getElementById("hero-equipment-selection-window-heading")!;
  const selectionWindowUL = document.querySelector("#hero-equipment-selection-window-list")!;

  selectionHeading.textContent = "";
  selectionWindowUL.innerHTML = "";
}

drawMainMenu();
showScreen(GameScreen.EquipmentMenu);
// showScreen(GameScreen.MainMenu);
