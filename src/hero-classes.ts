import { EQUIPMENT_ITEM_DICT } from "./data";
import { HeroClassName } from "./enums";
import { Character, HeroTemplate } from "./types";
import { idMaker } from "./utils";

const {
  Dagger,
  ShortSword,
  LeatherArmor,
  MythrilHelm,
  PlateArmor,
  DarkCloak,
  HunterBow,
  RuneStaff,
  WizardHat,
  MythrilRod,
  WizardRod,
  IronAxe,
  Mace,
  LinnenTunic,
} = EQUIPMENT_ITEM_DICT;

export const heroTemplates: { [k in HeroClassName]: HeroTemplate } = {
  [HeroClassName.Barbarian]: {
    name: HeroClassName.Barbarian,
    attributes: {
      strength: 30,
      intelligence: 13,
      dexterity: 23,
      agility: 21,
      vigor: 29,
      wisdom: 12,
      luck: 22,
    },
    equipment: {
      head: MythrilHelm!,
      body: null,
      shield: null,
      weapon: IronAxe!,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
  [HeroClassName.Knight]: {
    name: HeroClassName.Knight,
    attributes: {
      strength: 28,
      intelligence: 12,
      dexterity: 25,
      agility: 19,
      vigor: 30,
      wisdom: 18,
      luck: 18,
    },
    equipment: {
      head: null,
      body: LeatherArmor!,
      shield: null,
      weapon: ShortSword!,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
  [HeroClassName.Mage]: {
    name: HeroClassName.Mage,
    attributes: {
      strength: 12,
      intelligence: 35,
      dexterity: 18,
      agility: 19,
      vigor: 15,
      wisdom: 28,
      luck: 23,
    },
    equipment: {
      head: WizardHat!,
      body: null,
      shield: null,
      weapon: WizardRod!,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
  [HeroClassName.Sorcerer]: {
    name: HeroClassName.Sorcerer,
    attributes: {
      strength: 14,
      intelligence: 29,
      dexterity: 20,
      agility: 20,
      vigor: 18,
      wisdom: 25,
      luck: 24,
    },
    equipment: {
      head: null,
      body: DarkCloak!,
      shield: null,
      weapon: MythrilRod!,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
  [HeroClassName.Druid]: {
    name: HeroClassName.Druid,
    attributes: {
      strength: 15,
      intelligence: 24,
      dexterity: 19,
      agility: 23,
      vigor: 20,
      wisdom: 30,
      luck: 19,
    },
    equipment: {
      head: null,
      body: LinnenTunic!,
      shield: null,
      weapon: RuneStaff!,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
  [HeroClassName.Ranger]: {
    name: HeroClassName.Ranger,
    attributes: {
      strength: 20,
      intelligence: 20,
      dexterity: 30,
      agility: 25,
      vigor: 15,
      wisdom: 20,
      luck: 20,
    },
    equipment: {
      head: null,
      body: LeatherArmor!,
      shield: null,
      weapon: HunterBow!,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
  [HeroClassName.Thief]: {
    name: HeroClassName.Thief,
    attributes: {
      strength: 16,
      intelligence: 18,
      dexterity: 26,
      agility: 30,
      vigor: 19,
      wisdom: 14,
      luck: 27,
    },
    equipment: {
      head: null,
      body: LeatherArmor!,
      shield: null,
      weapon: Dagger!,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
  [HeroClassName.Cleric]: {
    name: HeroClassName.Cleric,
    attributes: {
      strength: 23,
      intelligence: 20,
      dexterity: 14,
      agility: 18,
      vigor: 28,
      wisdom: 29,
      luck: 18,
    },
    equipment: {
      head: null,
      body: PlateArmor!,
      shield: null,
      weapon: Mace!,
      feet: null,
      accessory: null,
      accessory2: null,
    },
  },
};

function determineHeroMaxHP(vigor: number, level: number) {
  const baseHP = 80;
  return level * vigor + baseHP;
}

function determineHeroMaxMP(wisdom: number, level: number) {
  const baseMP = 40;
  //   const result = Math.pow(level + wisdom, 2) * 0.025 + (level + wisdom) * 0.5 + baseMP;
  return Math.ceil((level + wisdom) ** 2 * 0.025 + (level + wisdom) * 0.5 + baseMP);
}

function createNewHero(heroName: string, heroClass: HeroClassName, imgUrl: string, level = 1) {
  const heroTemplate = heroTemplates[heroClass];
  const maxHp = determineHeroMaxHP(heroTemplate.attributes.vigor, level);
  const maxMp = determineHeroMaxMP(heroTemplate.attributes.wisdom, level);

  const newHero: Partial<Character> = {
    id: idMaker(),
    name: heroName,
    type: "hero",
    maxHp,
    maxMp,
    hp: maxHp,
    mp: maxMp,
    level,
    // speed: 62,
    xp: getXP(level),
    imgUrl,
    attributes: { ...heroTemplate.attributes },
    equipment: { ...heroTemplate.equipment },
    // position: {
    //   lane: Lane.Front,
    //   col: Col.Center,
    // },
    statuses: [],
    // actions: [
    //   ActionName.Attack,
    //   ActionName.Magic,
    //   ActionName.Steal,
    //   ActionName.Item,
    //   ActionName.Defend,
    //   ActionName._Attack,
    // ],
    abilities: {
      //   [ActionName._Attack]: [_AttackName.Slash, _AttackName.Arrow],
      //   [ActionName.Magic]: [
      //     MagicSpellName.Bio,
      //     MagicSpellName.Regen,
      //     MagicSpellName.Aero,
      //     MagicSpellName.Cure,
      //     MagicSpellName.Drain,
      //     MagicSpellName.Haste,
      //   ],
    },
  };
}

const xpToLevel = printXPToLevel();
function getXPToNextLevel(xp: number) {
  let level = 0;
  while (xpToLevel[level] <= xp) {
    console.log({ level, xp: xpToLevel[level], diff: xpToLevel[level + 1] - xpToLevel[level] });

    if (xpToLevel[level + 1] >= xp) return xpToLevel[level + 1] - xp;

    level++;
  }
}

function getLevel(xp: number) {
  return xpToLevel.findIndex((_, i, arr) => arr[i] < xp && arr[i + 1] > xp);
}

function getXP(level: number) {
  const factor = 0.05;
  return (factor * level ** 2 + factor * level) * 1000;

  // other possible formulas:

  //   const factor = 0.01;
  //   return (factor * level ** 2 + factor * level) * 1000;

  //   const factor = 0.025;
  //   return (factor * level ** 2 + factor * level) * 1000;
}

function printXPToLevel() {
  const results = [];
  let i = 0;
  while (i < 101) {
    results.push(Math.round(getXP(i)));
    i++;
  }
  return results;
}
let n = 23099;
console.log("level", getLevel(n), "curr xp", n, "to next level", getXPToNextLevel(n));

// calcPG(2, 2, 1);
// calcPG(81, 0.3333, 1);
function calcPG(initialValue: number, growthFactor: number, n: number) {
  return initialValue * Math.pow(growthFactor, n - 1);
}
// console.log({
//   xp1000: getLevel(2000),
//   lv10: getXP(10),
// });
/*
0 - 0
1 - 0.125
2 - 0.25
3 - 0.5
4 - 1

1-0
2-
  const hasLeveledUp = Math.trunc(Math.sqrt(kills)) > level;
1-0
5-1000
10-2000
15-4000
20-8000
25-
30-
-
*/
