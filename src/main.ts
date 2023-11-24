import "./style.css";
import { battleLanesUI, timelineUI, bottomSection } from "./dom";
import { calculateNextTurnTime, getTurnDuration } from "./utils";
import {
  battleState,
  timeline,
  playerAction,
  currentTurn,
  turnCount,
  battleStarted,
  allCharacters,
  heroes,
  panes,
  setBattleState,
  setPlayerAction,
  incrementTurnCount,
  initializeTimeline,
  setCurrentTurn,
} from "./globals";
import { BattleState, PlayerAction, Character, PaneInfo } from "./types";
import {
  drawTimeline,
  drawSelectedCharacterOutline,
  drawAttackEffect,
  drawCharacters,
  drawTurnCount,
} from "./draw";

// let timeline: Turn[] = [];
// let currentTurn: Turn | null = null;
// let turnCount = 0;
// let battleStarted = false;
// let ongoingAttack = false;
// let battleState: BattleState;
// let playerAction: PlayerAction;

// testBtn.onclick = () => {
//   if (!battleStarted || ongoingAttack) return;
//   updateTurnSequence();
// };

// window.onclick = (e) => ;

window.addEventListener("click", onWindowClick);

window.addEventListener("target-selected", onTargetSelected);
// window.addEventListener("hero-action-selected", onHeroActionSelected);

export const heroActionItems = (...args: any) => [
  {
    text: "attack",
    action: () => {
      console.log("clicked attack", ...args);

      setBattleState(BattleState.TargetSelection);
      updateBottomPane(panes.targetSelection());

      setPlayerAction(PlayerAction.Attack);

      // now hero needs to select a target to complete attack action
    },
  },
  {
    text: "defend",
    action: () => {
      console.log("clicked defend", ...args);

      setPlayerAction(PlayerAction.Defend);
    },
  },
  {
    text: "item",
    action: () => {
      console.log("clicked item", ...args);

      setPlayerAction(PlayerAction.Item);
    },
  },
];

function getCharacterById(id: string): Character | undefined {
  return allCharacters.find((c) => c.id === id);
}

function onWindowClick(e: MouseEvent) {
  const clickedEl = e.target as HTMLElement;
  const clickedActionButton = clickedEl.classList.contains("list-option");

  // const clickedActionButton = ([...e.composedPath()] as HTMLElement[]).find(
  //   (el) => el?.classList?.contains("list-option")
  // );
  // console.log(e.composedPath());

  // if (clickedActionButton) {
  //   window.dispatchEvent(
  //     new CustomEvent("hero-action-selected", {
  //       detail: { action: clickedEl.textContent },
  //     })
  //   );
  // }

  if (battleState === BattleState.TargetSelection) {
    const clickedCharacterSlot = ([...e.composedPath()] as HTMLElement[]).find(
      (el) => el?.classList?.contains("lane-slot") && el.id
    );

    if (clickedCharacterSlot) {
      const selectedCharacter = allCharacters.find(
        (c) => clickedCharacterSlot.id === c.id
      ) as Character;

      window.dispatchEvent(
        new CustomEvent("target-selected", { detail: { selectedCharacter } })
      );
    }
  }
}

async function onTargetSelected(data: any) {
  const { selectedCharacter: target } = data.detail;
  const hero = getCharacterById(timeline[0].entity.id)!;
  console.log("onTargetSelected", {
    target,
    hero,
    playerAction,
  });

  switch (playerAction) {
    case PlayerAction.Attack:
      await handleAttack(hero, target);
      setPlayerAction(PlayerAction.None);
      break;
    default:
  }

  // perform attack

  updateTimeline();
}

// function onHeroActionSelected(data: any) {
//   const { action } = data.detail;
//   console.log("onHeroActionSelected", { action });
// }

function chooseTargetForEnemy(enemy: Character): Character {
  let possibleTargets: Character[];

  if (enemy.actions.attack.type === "ranged") {
    possibleTargets = [...heroes];
  } else if (enemy.actions.attack.type === "melee") {
    const [heroesInTheFront, heroesInTheBack] = [
      heroes.filter((e) => e.position.lane === "front"),
      heroes.filter((e) => e.position.lane === "back"),
    ];
    if (heroesInTheFront.length > 0) {
      possibleTargets = [...heroesInTheFront];
    } else {
      possibleTargets = [...heroesInTheBack];
    }
  } else {
    possibleTargets = [...heroes];
  }

  const idx = Math.floor(Math.random() * possibleTargets.length);
  return possibleTargets[idx];
}

function updateTimeline(): void {
  const prevTimeline = timeline.slice();
  const currentTurn = timeline.shift()!;
  setCurrentTurn(currentTurn);

  const nextTurn = {
    ...currentTurn,
    nextTurnAt: calculateNextTurnTime(currentTurn),
    turnsPlayed: currentTurn.turnsPlayed + 1,
  };

  let insertionIdx = timeline.length;
  let smallestPositiveTimeDiff = Infinity;
  for (let i = 0; i < timeline.length; i++) {
    const timeDiff = timeline[i].nextTurnAt - nextTurn.nextTurnAt;

    if (timeDiff > 0 && timeDiff < smallestPositiveTimeDiff) {
      smallestPositiveTimeDiff = timeDiff;
      insertionIdx = i;
    }
  }

  timeline.splice(insertionIdx, 0, nextTurn);

  const character = getCharacterById(timeline[0].entity.id)!;

  console.log("timeline", { prev: prevTimeline, next: timeline.slice() });

  handleCharacterTurn(character);
  drawTimeline();
}

async function aimToTarget(hero: Character) /* : Promise<Character> */ {
  // return enemy;
  // return hero;
}

// character turn controller >>>
async function handleCharacterTurn(entity: Character): Promise<void> {
  console.log(`it's ${entity.name}'s turn`);
  incrementTurnCount();
  drawTurnCount(turnCount);

  if (entity.type === "enemy") {
    const targetHero = chooseTargetForEnemy(entity);

    setBattleState(BattleState.EnemyAction);
    updateBottomPane(
      panes.enemyAction(
        `${entity.name} performs a ${entity.actions.attack.type} attack against ${targetHero.name}`
      )
    );

    await drawSelectedCharacterOutline(entity);
    await handleAttack(entity, targetHero);

    return new Promise((resolve) => {
      setBattleState(BattleState.Idle);
      updateBottomPane({ type: "none", content: undefined });

      setTimeout(() => {
        updateTimeline();
        resolve();
      }, 1000);
    });
  }
  //
  else if (entity.type === "hero") {
    setBattleState(BattleState.HeroAction);
    updateBottomPane(panes.heroActions(entity));

    await drawSelectedCharacterOutline(entity);
    // await handleAttack(entity, targetHero);
    // fake we're waiting for a user command
    // console.log("...fake delay");
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // TODO: fix that
  }
}

async function handleAttack(
  attacker: Character,
  target: Character
): Promise<void> {
  const attackPower = attacker.actions.attack.power;

  await drawAttackEffect(attacker, target);

  target.hp -= attackPower;
  drawCharacters();
}

function updateBottomPane(paneInfo: PaneInfo) {
  bottomSection.text.innerHTML = "";
  bottomSection.list.innerHTML = "";

  console.log("updateBottomPane", timeline[0]?.entity?.name, paneInfo);

  switch (paneInfo.type) {
    case "text":
      bottomSection.list.classList.add("hidden");
      bottomSection.text.classList.remove("hidden");

      bottomSection.text.textContent = paneInfo.content;
      break;
    case "list":
      bottomSection.list.classList.remove("hidden");
      bottomSection.text.classList.add("hidden");

      paneInfo.content.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.text;
        li.classList.add("list-option", item.text);
        li.onclick = () => item.action();
        bottomSection.list.append(li);
      });
      break;
    case "none":
      bottomSection.list.classList.add("hidden");
      bottomSection.text.classList.add("hidden");
      break;
  }
}

function main() {
  setBattleState(BattleState.Dormant);
  setPlayerAction(PlayerAction.None);
  updateBottomPane(panes.battleStart());

  drawCharacters();
  initializeTimeline();

  // run initial turn
  handleCharacterTurn(allCharacters[0]);
}

main();

// console.log({
//   // battleLanesUI,
//   // charDurations1: updateTurnSequence(),
//   // charDurations2: updateTurnSequence(),
//   // charDurations3: updateTurnSequence(),
//   // charDurations4: updateTurnSequence(),
//   // charDurations5: updateTurnSequence(),
//   // battleUI,
//   // slots,
//   // enemyBackSlots,
//   // enemyFrontSlots,
//   // heroFrontSlots,
//   // heroBackSlots,
// });

/*

1 sec == 4 ticks
1 tick == 0.25sec

speed: 100 - 10 ticks -> 2.5s  // mult -> 0.1, 0.4, 0.65, 
|----------|

speed: 50 - 20 ticks -> 5s
|----------|----------|

speed: 25 - 40 ticks -> 10s
|----------|----------|----------|----------|

*/
