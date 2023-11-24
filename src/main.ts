import "./style.css";
import { wait } from "./utils";
import {
  timeline,
  setBattleState,
  setPlayerAction,
  initializeTimeline,
  getCharacterById,
} from "./globals";
import { BattleState, PlayerAction } from "./types";
import { drawCharacters, drawBottomPane } from "./draw";
import { handleCharacterTurn } from "./events";
import { panes } from "./infoPane";

async function main() {
  setBattleState(BattleState.Dormant);
  setPlayerAction(PlayerAction.None);

  drawCharacters();

  drawBottomPane(panes.battleStart());
  await wait(1000);
  drawBottomPane(panes.getReady());
  await wait(1000);

  initializeTimeline();

  const firstToPlay = getCharacterById(timeline[0].entity.id)!;
  handleCharacterTurn(firstToPlay);
}

main();
