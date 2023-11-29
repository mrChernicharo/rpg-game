import { startBattle } from "../battle/battle";
import { getAllScreens, getBattleScreenBtn, getCurrentScreen, getDungeonScreenBtn, getMainMenuScreenBtn } from "../dom";
import { GameScreen } from "../enums";

getDungeonScreenBtn().onclick = () => showScreen(GameScreen.Dungeon);
getMainMenuScreenBtn().onclick = () => showScreen(GameScreen.MainMenu);
getBattleScreenBtn().onclick = () => {
  showScreen(GameScreen.Battle);
  startBattle();
};

function showScreen(screen: GameScreen) {
  const screens = getAllScreens();
  screens.forEach((s) => {
    if (s.id.startsWith(screen)) {
      s.classList.remove("hidden");
    } else {
      s.classList.add("hidden");
    }
  });

  const backLinks = Array.from(document.querySelectorAll(".back-to-home")) as HTMLAnchorElement[];
  backLinks.forEach((bl) => {
    if (bl.id.startsWith(screen)) {
      bl.onclick = () => {
        showScreen(GameScreen.Home);
      };
    }
  });

  console.log({ screen, screens, backLinks, currScreen: getCurrentScreen() });
}
