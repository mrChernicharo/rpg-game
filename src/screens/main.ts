import { startBattle } from "./battle";
import {
  getAllScreens,
  getBattleScreenBtn,
  getDungeonScreenBtn,
  getMagicMenuHeroSelectionUL,
  getMainMenuScreenBtn,
  getSkillsMenuHeroSelectionUL,
} from "../shared/dom";
import { GameScreen } from "../shared/enums";
import {
  drawEquipmentMenu,
  drawItemsMenu,
  drawSmallHeroSelectionWidget,
  drawMainMenu,
  updateBackToHomeLinks,
} from "./menu";

getDungeonScreenBtn().onclick = () => {
  showScreen(GameScreen.Dungeon);
};
getMainMenuScreenBtn().onclick = () => {
  drawMainMenu();
  showScreen(GameScreen.MainMenu);
};
getBattleScreenBtn().onclick = () => {
  showScreen(GameScreen.Battle);
  startBattle();
};

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

  if (screen === GameScreen.ItemsMenu) {
    drawItemsMenu();
  }

  if (screen == GameScreen.MagicMenu) {
    drawSmallHeroSelectionWidget(getMagicMenuHeroSelectionUL());
  }

  if (screen == GameScreen.SkillsMenu) {
    drawSmallHeroSelectionWidget(getSkillsMenuHeroSelectionUL());
  }
}

drawMainMenu();

// showScreen(GameScreen.Battle); // shouldn't start here!!!!
// startBattle(); // <- please remove when you're done
showScreen(GameScreen.Dungeon);
// showScreen(GameScreen.MainMenu);
