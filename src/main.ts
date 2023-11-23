import "./style.css";

const battleLanesUI = Array.from(document.querySelectorAll(".battle-lane"));
// const battleUI = document.querySelector("#battle-ui");
// const slots = Array.from(document.querySelectorAll(".lane-slot"));
// const [enemyBackSlots, enemyFrontSlots, heroFrontSlots, heroBackSlots] = [
//   battleLanesUI[0].children,
//   battleLanesUI[1].children,
//   battleLanesUI[2].children,
//   battleLanesUI[3].children,
// ].map((HTMLels) => Array.from(HTMLels));

const enemies = [
  {
    name: "Skeleton 01",
    type: "enemy",
    hp: 120,
    speed: 70,
    imgUrl: "/sprites/sprite-70.webp",
    position: {
      lane: "front",
      col: "left",
    },
    actions: {
      attack: { type: "melee", power: 40 },
    },
  },
  {
    name: "Demon",
    type: "enemy",
    hp: 250,
    speed: 58,
    imgUrl: "/sprites/sprite-77.webp",
    position: {
      lane: "front",
      col: "center",
    },
    actions: {
      attack: { type: "melee", power: 55 },
    },
  },
  {
    name: "Skeleton 02",
    type: "enemy",
    hp: 120,
    speed: 70,
    imgUrl: "/sprites/sprite-70.webp",
    position: {
      lane: "front",
      col: "right",
    },
    actions: {
      attack: { type: "melee", power: 40 },
    },
  },
  {
    name: "Ice Sorcerer",
    type: "enemy",
    hp: 320,
    speed: 50,
    imgUrl: "/sprites/sprite-78.webp",
    position: {
      lane: "back",
      col: "center",
    },
    actions: {
      attack: { type: "ranged", power: 30 },
    },
  },
];

const heroes = [
  {
    name: "Abigail",
    type: "hero",
    hp: 520,
    speed: 54,
    imgUrl: "/sprites/sprite-09.webp",
    position: {
      lane: "back",
      col: "center",
    },
    actions: {
      attack: { type: "melee", power: 40 },
    },
  },
  {
    name: "Savannah",
    type: "hero",
    hp: 570,
    speed: 62,
    imgUrl: "/sprites/sprite-04.webp",
    position: {
      lane: "front",
      col: "left",
    },
    actions: {
      attack: { type: "melee", power: 60 },
    },
  },
  {
    name: "Turok",
    type: "hero",
    hp: 640,
    speed: 45,
    imgUrl: "/sprites/sprite-27.webp",
    position: {
      lane: "front",
      col: "right",
    },
    actions: {
      attack: { type: "melee", power: 76 },
    },
  },
];

const allCharacters = [...enemies, ...heroes];

const turnSequence = initializeTurnSequence();

let currentTurn = null;
let turnCount = 0;

function displayCharacters(entity: any) {
  const battleLane = battleLanesUI.find(
    (el) =>
      el.classList.contains(`${entity.type}-lane`) &&
      el.classList.contains(`${entity.position.lane}-row`)
  )!;

  const slotIndices = {
    left: 0,
    center: 1,
    right: 2,
  } as const;

  const slotIdx =
    slotIndices[entity.position.col as "left" | "center" | "right"];

  const slot = Array.from(battleLane.children)[slotIdx];
  const [topSection, avatar, bottomSection] = Array.from(slot.children);
  const img = avatar.children[0] as HTMLImageElement;

  topSection.textContent = entity.name;
  bottomSection.textContent = `HP ${entity.hp}`;
  img.src = entity.imgUrl;
}

function initializeTurnSequence() {
  return allCharacters
    .map((c) => ({
      name: c.name,
      turnDuration: getTurnDuration(c.speed),
      nextTurnAt: getTurnDuration(c.speed),
      turnsPlayed: 0,
    }))
    .sort((a, b) => a.nextTurnAt - b.nextTurnAt);
}

function updateTurnSequence() {
  currentTurn = turnSequence.shift()!;

  const nextTurn = {
    ...currentTurn,
    nextTurnAt: calculateNextTurnTime(currentTurn),
    turnsPlayed: currentTurn.turnsPlayed + 1,
  };

  let insertionIdx = turnSequence.length;
  let smallestPositiveTimeDiff = Infinity;
  for (let i = 0; i < turnSequence.length; i++) {
    const timeDiff = turnSequence[i].nextTurnAt - nextTurn.nextTurnAt;

    // console.log({ [i]: turnSequence[i], nextTurn, timeDiff });

    if (timeDiff > 0 && timeDiff < smallestPositiveTimeDiff) {
      smallestPositiveTimeDiff = timeDiff;
      insertionIdx = i;
    }
  }

  turnCount++;
  turnSequence.splice(insertionIdx, 0, nextTurn);

  console.log(turnCount, ...turnSequence.slice());
  return turnSequence;
}

function getTurnDuration(speed: number) {
  return 1000 / speed;
}

function calculateNextTurnTime(turn: any) {
  return turn.nextTurnAt + turn.turnDuration;
}

function main() {
  allCharacters.forEach(displayCharacters);

  let i = 0;
  while (i < 100) {
    updateTurnSequence();
    i++;
  }
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
