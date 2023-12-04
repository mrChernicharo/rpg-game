import { drawCharacters } from "./draw";
import { wait } from "../../shared/utils";
import { initializeTimeline, updateTimeline } from "./timeline";
import { showScreen } from "../main";
import { GameScreen } from "../../shared/enums";

export async function startBattle() {
  drawCharacters();
  await initializeTimeline();
  await wait(1000);
  await updateTimeline();
}

// @TODO: we need dynamic enemy and hero lists
export async function handleBattleWon() {
  showScreen(GameScreen.Dungeon);
}

export async function handleBattleLost() {
  showScreen(GameScreen.Dungeon);
}
