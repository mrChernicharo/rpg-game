import { startBattle } from "../battle/battle";
import { getAllScreens, getBattleScreenBtn, getDungeonScreenBtn, getHomeScreenBtn, getMenuScreenBtn } from "../dom";
import { GameScreen } from "../enums";

getHomeScreenBtn().onclick = () => showScreen(GameScreen.Home);
getBattleScreenBtn().onclick = () => {
  showScreen(GameScreen.Battle);
  startBattle();
};
getDungeonScreenBtn().onclick = () => showScreen(GameScreen.Dungeon);
getMenuScreenBtn().onclick = () => showScreen(GameScreen.Menu);

function showScreen(screen: GameScreen) {
  const screens = getAllScreens();
  screens.forEach((s) => {
    if (s.id.startsWith(screen)) {
      s.classList.remove("hidden");
    } else {
      s.classList.add("hidden");
    }
  });

  console.log({ screen, screens });
}
