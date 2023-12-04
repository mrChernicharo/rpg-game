import { drawBottomPane, drawCharacters } from "./draw";
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
  drawBottomPane({ type: "text", content: "YOU WIN!" });
  await wait(2000);

  showScreen(GameScreen.Dungeon);
}

export async function handleBattleLost() {
  drawBottomPane({ type: "text", content: "YOU LOSE!" });
  await wait(2000);

  showScreen(GameScreen.Dungeon);
}
