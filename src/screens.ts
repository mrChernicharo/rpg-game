import { startBattle } from "./battle/battle";
import { getAllHeroes } from "./battle/globals";
import {
  getAllScreens,
  getBattleScreenBtn,
  getDungeonScreenBtn,
  getEquipmentMenuHeroSelectionUL,
  getMainMenuHeroesUL,
  getMainMenuScreenBtn,
  mainMenuBtns,
} from "./dom";
import { EquipmentSlot, GameScreen } from "./enums";
import { Character, MenuState } from "./types";

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
  equipmentWidget.innerHTML = `
      <div id=${EquipmentSlot.Head} class="equipment-slot">
          ${hero.equipment.head ? `<img src=${"public/icons/sprite-01.webp"} width="48" height="48"/>` : ``}
      </div>
      <div id=${EquipmentSlot.Weapon} class="equipment-slot">
          ${hero.equipment.weapon ? `<img src=${"public/icons/sprite-01.webp"} width="48" height="48"/>` : ``}
      </div>
      <div id=${EquipmentSlot.Body} class="equipment-slot">
          ${hero.equipment.body ? `<img src=${"public/icons/sprite-01.webp"} width="48" height="48"/>` : ``}
      </div>
      <div id=${EquipmentSlot.Shield} class="equipment-slot">
          ${hero.equipment.shield ? `<img src=${"public/icons/sprite-01.webp"} width="48" height="48"/>` : ``}
      </div>
      <div id=${EquipmentSlot.Feet} class="equipment-slot">
          ${hero.equipment.feet ? `<img src=${"public/icons/sprite-01.webp"} width="48" height="48"/>` : ``}
      </div>
      <div id=${EquipmentSlot.Accessory} class="equipment-slot">
          ${hero.equipment.accessory ? `<img src=${"public/icons/sprite-01.webp"} width="48" height="48"/>` : ``}
      </div>
      <div id="${EquipmentSlot.Accessory}-2" class="equipment-slot">
          ${hero.equipment.accessory2 ? `<img src=${"public/icons/sprite-01.webp"} width="48" height="48"/>` : ``}
      </div>
    </div>
  `;
}

drawMainMenu();
showScreen(GameScreen.EquipmentMenu);
// showScreen(GameScreen.MainMenu);
