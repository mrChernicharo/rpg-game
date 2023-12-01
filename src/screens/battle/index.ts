import { drawCharacters } from "./draw";
import { wait } from "../../shared/utils";
import { heroTemplates } from "../../shared/hero-classes";
import { initializeTimeline, updateTimeline } from "./timeline";

export async function startBattle() {
  console.log(heroTemplates);
  drawCharacters();
  await initializeTimeline();
  await wait(1000);
  await updateTimeline();
}
