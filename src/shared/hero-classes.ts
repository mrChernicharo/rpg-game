import { EQUIPMENT_ITEM_DICT } from "../data/static";
import { ActionName, Col, HeroClassName, Lane, MagicSpellName } from "./enums";
import { Character, HeroTemplate, Position } from "./types";
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

const commonHeroActions = [ActionName.Attack, ActionName.Magic, ActionName.Item, ActionName.Defend];
const classSpecificActions = {
  [HeroClassName.Barbarian]: [],
  [HeroClassName.Knight]: [],
  [HeroClassName.Mage]: [],
  [HeroClassName.Sorcerer]: [ActionName.Summon],
  [HeroClassName.Druid]: [ActionName.Invoke],
  [HeroClassName.Ranger]: [],
  [HeroClassName.Thief]: [ActionName.Steal],
  [HeroClassName.Cleric]: [],
};

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
    actions: [...commonHeroActions, ...classSpecificActions[HeroClassName.Barbarian]],
    abilities: {
      magic: [],
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
    actions: [...commonHeroActions, ...classSpecificActions[HeroClassName.Knight]],
    abilities: {
      magic: [],
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
    actions: [...commonHeroActions, ...classSpecificActions[HeroClassName.Mage]],
    abilities: {
      magic: [MagicSpellName.Thunder],
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
    actions: [...commonHeroActions, ...classSpecificActions[HeroClassName.Sorcerer]],
    abilities: {
      magic: [MagicSpellName.Fire],
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
    actions: [...commonHeroActions, ...classSpecificActions[HeroClassName.Druid]],
    abilities: {
      magic: [],
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
    actions: [...commonHeroActions, ...classSpecificActions[HeroClassName.Ranger]],
    abilities: {
      magic: [],
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
    actions: [...commonHeroActions, ...classSpecificActions[HeroClassName.Thief]],
    abilities: {
      magic: [],
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
    actions: [...commonHeroActions, ...classSpecificActions[HeroClassName.Cleric]],
    abilities: {
      magic: [MagicSpellName.Cure],
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

export function createNewHero(
  heroName: string,
  heroClass: HeroClassName,
  imgUrl: string,
  position: Position,
  level = 1
) {
  const heroTemplate = heroTemplates[heroClass];
  const maxHp = determineHeroMaxHP(heroTemplate.attributes.vigor, level);
  const maxMp = determineHeroMaxMP(heroTemplate.attributes.wisdom, level);

  const newHero: Character = {
    id: idMaker(),
    type: "hero",
    name: heroName,
    class: heroClass,
    imgUrl,
    maxHp,
    maxMp,
    hp: maxHp,
    mp: maxMp,
    level,
    xp: getXP(level),
    speed: calcSpeed(heroTemplate.attributes.agility, level),
    attributes: { ...heroTemplate.attributes },
    equipment: { ...heroTemplate.equipment },
    position,
    statuses: [],
    actions: heroTemplate.actions,
    abilities: heroTemplate.abilities,
  };
  return newHero;
}

export function calcSpeed(agility: number, level: number) {
  return agility * 0.6 + level * 0.4 + 25;
}

const xpToLevel = getXPToLevelList();
export function getXPToLevelList() {
  const results = [];
  let i = 0;
  while (i < 101) {
    results.push(Math.round(getXP(i)));
    i++;
  }
  return results;
}

export function getXPToNextLevel(xp: number) {
  let level = 0;
  while (xpToLevel[level] <= xp) {
    console.log({ level, xp: xpToLevel[level], diff: xpToLevel[level + 1] - xpToLevel[level] });

    if (xpToLevel[level + 1] > xp) return Math.ceil(xpToLevel[level + 1] - xp);

    level++;
  }
  return 0;
}

export function getLevel(xp: number) {
  return xpToLevel.findIndex((_, i, arr) => arr[i] < xp && arr[i + 1] > xp);
}

export function getXP(level: number) {
  const factor = 0.05;
  return Math.floor((factor * level ** 2 + factor * level) * 1000);

  // other possible xp/level Formulas:

  //   const factor = 0.01;
  //   return (factor * level ** 2 + factor * level) * 1000;

  //   const factor = 0.025;
  //   return (factor * level ** 2 + factor * level) * 1000;
}

// let n = 23099;
// console.log("level", getLevel(n), "curr xp", n, "to next level", getXPToNextLevel(n));
