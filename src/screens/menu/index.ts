import { EQUIPMENT_ITEM_DICT, INVENTORY_LIST } from "../../data/static";
import { getMainMenuHeroesUL, getEquipmentMenuHeroSelectionUL, showModal, mainMenuBtns } from "../../shared/dom";
import { EquipmentSlot, GameScreen, InventoryItemName, InventoryItemType } from "../../shared/enums";
import { getXPToNextLevel } from "../../shared/hero-classes";
import { Character, EquipmentItemWithQuantity, MenuState } from "../../shared/types";
import { capitalize } from "../../shared/utils";
import { getAllHeroes, inventory, subtractFromInventory, addInventoryItem } from "../battle/globals";
import { showScreen } from "../main";

export const menuState: MenuState = {
  selectedHero: null,
};

export function onHeroSelected() {
  const hero = menuState.selectedHero!;
  console.log("menuState.selectedHero ->", hero.name, {
    menuState,
    hero,
  });

  drawHeroEquipmentSubMenu(hero);
}

export function updateBackToMenuLinks() {
  const backToMainMenu = Array.from(document.querySelectorAll(".back-to-main-menu")) as HTMLAnchorElement[];

  backToMainMenu.forEach((bl) => {
    bl.onclick = () => {
      showScreen(GameScreen.MainMenu);
    };
  });
}

export function updateBackToHomeLinks() {
  const backToHomeLinks = Array.from(document.querySelectorAll(".back-to-home")) as HTMLAnchorElement[];

  backToHomeLinks.forEach((bl) => {
    bl.onclick = () => {
      showScreen(GameScreen.Home);
    };
  });
}

export function setMainMenuBtns() {
  mainMenuBtns.forEach((btn) => {
    const screen = btn.id.replace("-btn", "") as GameScreen;
    btn.onclick = () => {
      showScreen(screen);
    };
  });
}

export function drawSmallHeroSelectionWidget(container: Element) {
  // TODO: pass container as arg
  // const heroSelectionList = getEquipmentMenuHeroSelectionUL();
  container.innerHTML = "";

  getAllHeroes().forEach((h) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <div id=${h.id} class="hero-selection-list-item">
          <button class="hero-img-small">
            <img src=${h.imgUrl} width="48" height="48"/>
          </button>
        </div>
      `;

    container.append(li);

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
}

export function drawMainMenu() {
  const heroesUl = getMainMenuHeroesUL()!;
  heroesUl.innerHTML = "";
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
              <span style="color: #6aa4fc">${capitalize(h.class)}</span>
            </div>
          
            <div>
              <span>Lv ${h.level}</span>
              <span>XP ${h.xp}</span>
            </div>
                    
            <div>
              <span>HP ${h.hp}/${h.maxHp}</span>
              <span>MP ${h.mp}/${h.maxMp}</span>
            </div>
  
            <div>
              <span>To next Level ${getXPToNextLevel(h.xp)} XP</span>
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

export function drawItemsMenu() {
  const itemsUL = document.querySelector("#items-menu-list") as HTMLUListElement;

  const inventoryItemTemplates: string[] = [];
  inventory.forEach((item) => {
    inventoryItemTemplates.push(`
        <li id="${item.name}-item">
          <img src=${item.imgURL} width="36" height="36"/>  
          <span>${item.name} x${item.quantity}</span>
        </li>
      `);
  });

  itemsUL.innerHTML = inventoryItemTemplates.join(" ");

  const lis = Array.from(document.querySelectorAll(`#items-menu-list > li`)) as HTMLLIElement[];
  lis.forEach((li) => {
    li.onclick = () => {
      console.log(`CLICKED  ${li.id}`);
    };
  });
}

export function drawEquipmentMenu() {
  // DRAW SMALL HERO SELECTION LIST
  drawSmallHeroSelectionWidget(getEquipmentMenuHeroSelectionUL());

  // DRAW BLANK EQUIPMENT SUBMENU
  drawHeroEquipmentSubMenu();
}

export function drawHeroEquipmentSubMenu(hero?: Character) {
  const menuHeading = document.querySelector("#hero-equipment-sub-menu > .hero-equipment-sub-menu-heading")!;

  if (!hero) {
    menuHeading.textContent = "Select Hero";
  } else {
    menuHeading.textContent = hero.name;

    drawEquipmentWidget(hero);
  }
}

export function drawEquipmentWidget(hero: Character) {
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
        `
  );

  equipmentWidget.innerHTML = slotTemplates.join("");

  const slots = Array.from(equipmentWidget.children) as HTMLDivElement[];
  slots.forEach((slot) => {
    const equipmentSpriteImg = Array.from(slot.children).find((child) => child.className.includes("equipment-sprite"));
    const slotName = slot.id as EquipmentSlot;

    const slotClick = () => {
      if (equipmentSpriteImg) {
        const itemName = equipmentSpriteImg.classList.toString().split(" ")[1] as InventoryItemName;
        const itemInfo = EQUIPMENT_ITEM_DICT[itemName]!;

        console.log({ equipmentSpriteImg, slot, hero, itemInfo });

        // prettier-ignore
        const modalTemplate = `
              <span>${itemInfo.name}</span>
              ${itemInfo.power ? `<span>Pow ${itemInfo.power}</span>` : ``}
              <img src=${itemInfo.imgURL} width="48" height="48" class="equipment-sprite ${itemInfo.slot}" />
              <button id="remove-${itemInfo.name}">remove</button>
          `;
        showModal(modalTemplate);

        const removeEquipmentButton = document.querySelector(`button#remove-${itemName}`) as HTMLButtonElement;
        const onRemoveBtnClick = () => {
          unequipEquipment(hero, slotName, itemName);
        };
        removeEquipmentButton.onclick = onRemoveBtnClick;
      } else {
        drawEquipmentSelectionWindow(hero, slotName);
      }
    };

    slot.onclick = slotClick;
  });
}

export function isEquipmentAvailableToEquip(item: EquipmentItemWithQuantity) {
  // console.log("isEquipmentAvailableToEquip", item);
  if (item.quantity > 0) return true;
  else return false;
}

export function equipEquipment(hero: Character, slot: EquipmentSlot, itemName: InventoryItemName) {
  if (hero.type !== "hero") throw Error("cannot equip");

  const item = INVENTORY_LIST.find((eq) => eq.name === itemName) as EquipmentItemWithQuantity;
  const { quantity, ...equipmentItem } = item;

  hero.equipment[slot] = equipmentItem;

  console.log("equip!");

  subtractFromInventory(itemName);

  drawHeroEquipmentSubMenu(hero);
  closeEquipmentSelectionWindow();
}

export function unequipEquipment(hero: Character, slot: EquipmentSlot, itemName: InventoryItemName) {
  if (hero.type !== "hero") throw Error("cannot unequip");
  hero.equipment[slot] = null;
  addInventoryItem(itemName);

  drawHeroEquipmentSubMenu(hero);
}

export function drawEquipmentSelectionWindow(hero: Character, slotName: EquipmentSlot) {
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

export function closeEquipmentSelectionWindow() {
  const selectionHeading = document.getElementById("hero-equipment-selection-window-heading")!;
  const selectionWindowUL = document.querySelector("#hero-equipment-selection-window-list")!;

  selectionHeading.textContent = "";
  selectionWindowUL.innerHTML = "";
}
