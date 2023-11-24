import "./style.css";

const battleLanesUI = Array.from(document.querySelectorAll(".battle-lane"));
const turnSequenceUI = document.querySelector("#turn-sequence")!;
const testBtn = document.querySelector("#test-btn") as HTMLButtonElement;
const testBtn2 = document.querySelector("#test-btn-2") as HTMLButtonElement;
const bottomSection = {
  text: document.querySelector("#bottom-lane > #text-content")!,
  list: document.querySelector("#bottom-lane > #list-content")!,
};
// const battleUI = document.querySelector("#battle-ui");
// const slots = Array.from(document.querySelectorAll(".lane-slot"));
// const [enemyBackSlots, enemyFrontSlots, heroFrontSlots, heroBackSlots] = [
//   battleLanesUI[0].children,
//   battleLanesUI[1].children,
//   battleLanesUI[2].children,
//   battleLanesUI[3].children,
// ].map((HTMLels) => Array.from(HTMLels));

type PaneInfo =
  | { type: "text"; content: string }
  | {
      type: "list";
      content: { text: string; action: (...args: any) => void }[];
    }
  | { type: "none"; content: undefined };

const enemies = [
  {
    id: idMaker(),
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
    id: idMaker(),
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
    id: idMaker(),
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
    id: idMaker(),
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
    id: idMaker(),
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
    id: idMaker(),
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
    id: idMaker(),
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

type Character = (typeof allCharacters)[0];

let turnSequence: any[] = [];
let currentTurn = null;
let turnCount = 0;
let battleStarted = false;
let ongoingAttack = false;

testBtn.onclick = () => {
  if (!battleStarted || ongoingAttack) return;
  updateTurnSequence();
};

// let paneIdx = 0;
// testBtn2.onclick = () => {
//   const paneTypes = ["text", "list", "none"];
//   const paneSampleContents = ["test...", ["A...", "B..."], undefined];

//   const paneType = paneTypes[paneIdx % paneTypes.length] as
//     | "text"
//     | "list"
//     | "none";
//   const paneInfo = {
//     type: paneType,
//     content: paneSampleContents[paneIdx % paneTypes.length],
//   } as PaneInfo;

//   setBottomPane(paneInfo);
//   paneIdx++;
// };

function idMaker(length = 12) {
  const ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
  return Array(length)
    .fill(0)
    .map((_) => ID_CHARS.split("")[Math.round(Math.random() * ID_CHARS.length)])
    .join("");
}

function getTurnDuration(speed: number) {
  return 1000 / speed;
}

function calculateNextTurnTime(turn: any) {
  return turn.nextTurnAt + turn.turnDuration;
}

function chooseTargetForEnemy(enemy: Character) {
  let possibleTargets: any[];

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

function drawCharacter(entity: Character) {
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
  // const img = Array.from(avatar.children).find(
  //   (el) => el.tagName === "IMG"
  // ) as HTMLImageElement;

  slot.id = `${entity.id}`;
  topSection.textContent = entity.name;
  bottomSection.textContent = `HP ${entity.hp}`;
  img.src = entity.imgUrl;
}

function drawCharacters() {
  allCharacters.forEach(drawCharacter);

  // const activeCharacterSlot: string = currentTurn?.entityId ?? "";
  // console.log({ activeCharacterSlot, currentTurn });
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

    if (timeDiff > 0 && timeDiff < smallestPositiveTimeDiff) {
      smallestPositiveTimeDiff = timeDiff;
      insertionIdx = i;
    }
  }

  turnCount++;
  turnSequence.splice(insertionIdx, 0, nextTurn);

  const character = allCharacters.find(
    (c) => c.id === turnSequence[0].entityId
  )!;

  handleCharacterTurn(character);
  drawTurnSequence();
}

function drawTurnSequence() {
  // console.log(turnCount, ...turnSequence);
  turnSequenceUI.innerHTML = "";

  for (let i = 0; i < turnSequence.length; i++) {
    const turn = turnSequence[i];
    const timeToNextTurn = turn.nextTurnAt - turnSequence[0].nextTurnAt;
    const timeToNextTurnStr =
      i === 0 ? " now" : i === 1 ? " next" : ` ${timeToNextTurn.toFixed(2)}`;

    const div = document.createElement("div");
    const nameText = document.createElement("small");
    const timeText = document.createElement("small");

    nameText.classList.add("character-name");
    nameText.textContent = turn.name;

    timeText.classList.add("time-to-next-turn");
    timeText.textContent = timeToNextTurnStr;

    div.classList.add("turn-item");
    div.append(nameText, timeText);

    turnSequenceUI.append(div);
  }
}

async function drawSelectedCharacterOutline(entity: Character) {
  const prevSlot = document.querySelector(`.selected`);
  const slot = document.querySelector(`#${entity.id}`);

  prevSlot?.classList.remove("selected");
  slot?.classList.add("selected");

  console.log(`${entity.name}'s turn...`);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 750);
  });
}

// turn controller >>>
async function handleCharacterTurn(entity: Character) {
  console.log(`it's ${entity.name}'s turn`);

  await drawSelectedCharacterOutline(entity);

  if (entity.type === "enemy") {
    const targetHero = chooseTargetForEnemy(entity);
    console.log(
      `${entity.name} performs a ${entity.actions.attack.type} attack against ${targetHero.name}`
    );

    await handleAttack(entity, targetHero);

    console.log("done!");
  } else if (entity.type === "hero") {
    setBottomPane({
      type: "list",
      content: [
        {
          text: "attack",
          action: () => {
            console.log("clicked attack");
          },
        },
        {
          text: "defend",
          action: () => {
            console.log("clicked defend");
          },
        },
        {
          text: "item",
          action: () => {
            console.log("clicked item");
          },
        },
      ],
    });
  }
}

async function handleAttack(attacker: Character, target: Character) {
  ongoingAttack = true;
  const attackPower = attacker.actions.attack.power;

  await drawAttackEffect(attacker, target);

  target.hp -= attackPower;
  drawCharacters();
  ongoingAttack = false;
}

async function drawAttackEffect(attacker: Character, target: Character) {
  const targetSlot = document.querySelector(`#${target.id}`)!;
  const attackerSlot = document.querySelector(`#${attacker.id}`)!;

  // const targetAvatarEl = Array.from(targetSlot?.children || []).find((el) =>
  //   el.classList.contains("avatar")
  // )!;

  // const attackerAvatarEl = Array.from(attackerSlot?.children || []).find((el) =>
  //   el.classList.contains("avatar")
  // )!;

  // const [targetImg, targetOverlay] = Array.from(targetAvatarEl?.children || []);
  // const [attackerImg, attackerOverlay] = Array.from(
  //   attackerAvatarEl?.children || []
  // );

  attackerSlot.classList.add(`${attacker.actions.attack.type}-attack-perform`);
  targetSlot.classList.add(`${attacker.actions.attack.type}-attack-receive`);

  // return new Promise((resolve) => setTimeout(resolve, 1000));

  return new Promise((resolve) => {
    setTimeout(() => {
      attackerSlot.classList.remove(
        `${attacker.actions.attack.type}-attack-perform`
      );
      targetSlot.classList.remove(
        `${attacker.actions.attack.type}-attack-receive`
      );

      console.log("removed classes");
      return resolve(true);
    }, 1000);
  });

  // console.log({
  //   attackerSlot,
  //   targetSlot,
  //   attackerImg,
  //   attackerOverlay,
  //   targetImg,
  //   targetOverlay,
  // });
}

function setBottomPane(paneInfo: PaneInfo) {
  console.log("setBottomPane", { paneInfo });
  switch (paneInfo.type) {
    case "text":
      bottomSection.list.classList.add("hidden");
      bottomSection.text.classList.remove("hidden");

      bottomSection.text.textContent = paneInfo.content;
      break;
    case "list":
      bottomSection.list.classList.remove("hidden");
      bottomSection.text.classList.add("hidden");

      bottomSection.list.innerHTML = "";
      paneInfo.content.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.text;
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

function initializeTurnSequence() {
  turnSequence = allCharacters
    .map((c) => ({
      entityId: c.id,
      name: c.name,
      turnDuration: getTurnDuration(c.speed),
      nextTurnAt: getTurnDuration(c.speed),
      turnsPlayed: 0,
    }))
    .sort((a, b) => a.nextTurnAt - b.nextTurnAt);

  drawTurnSequence();

  // run initial turn
  setTimeout(() => {
    turnCount++;
    battleStarted = true;
    handleCharacterTurn(allCharacters[0]);
  }, 2000);
}

function main() {
  drawCharacters();

  initializeTurnSequence();
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
