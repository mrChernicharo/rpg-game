import { HeroClassName, Col, Lane } from "../shared/enums";
import { createNewHero } from "../shared/hero-classes";
import { Character } from "../shared/types";

export const HERO_LIST: Character[] = [
  {
    ...createNewHero(
      "Turok",
      HeroClassName.Barbarian,
      "/sprites/sprite-27.webp",
      { col: Col.Center, lane: Lane.Front },
      10
    ),
  },
  {
    ...createNewHero(
      "Abigail",
      HeroClassName.Ranger,
      "/sprites/sprite-09.webp",
      { col: Col.Right, lane: Lane.Back },
      9
    ),
  },
  {
    ...createNewHero(
      "Mikhal",
      HeroClassName.Sorcerer,
      "/sprites/sprite-11.webp",
      { col: Col.Left, lane: Lane.Back },
      11
    ),
  },
  {
    ...createNewHero(
      "Savanah",
      HeroClassName.Druid,
      "/sprites/sprite-04.webp",
      { col: Col.Center, lane: Lane.Back },
      12
    ),
  },
];
//     imgUrl: "/sprites/sprite-09.webp", abigail

//     imgUrl: "/sprites/sprite-04.webp", savanah

// const HERO_LIST: Character[] = [
//   {
//     id: idMaker(),
//     name: "Otto",
//     type: "hero",
//     maxHp: 490,
//     maxMp: 65,
//     hp: 490,
//     mp: 65,
//     speed: 62,
//     level: 7,
//     xp: 4600,
//     imgUrl: "/sprites/sprite-01.webp",
//     attributes: {
//       strength: 23,
//       intelligence: 28,
//       dexterity: 24,
//       agility: 28,
//       vigor: 24,
//       wisdom: 25,
//       luck: 30,
//     },
//     equipment: {
//       head: null,
//       body: null,
//       shield: null,
//       weapon: null,
//       feet: null,
//       accessory: null,
//       accessory2: null,
//     },
//     position: {
//       lane: Lane.Front,
//       col: Col.Center,
//     },
//     statuses: [],
//     actions: [
//       ActionName.Attack,
//       ActionName.Magic,
//       ActionName.Steal,
//       ActionName.Item,
//       ActionName.Defend,
//       ActionName._Attack,
//     ],
//     abilities: {
//       [ActionName._Attack]: [_AttackName.Slash, _AttackName.Arrow],
//       [ActionName.Magic]: [
//         MagicSpellName.Bio,
//         MagicSpellName.Regen,
//         MagicSpellName.Aero,
//         MagicSpellName.Cure,
//         MagicSpellName.Drain,
//         MagicSpellName.Haste,
//       ],
//     },
//   },
//   {
//     id: idMaker(),
//     name: "Turok",
//     type: "hero",
//     maxHp: 640,
//     maxMp: 29,
//     hp: 640,
//     mp: 29,
//     speed: 45,
//     level: 7,
//     xp: 4600,
//     imgUrl: "/sprites/sprite-27.webp",
//     position: {
//       lane: Lane.Front,
//       col: Col.Right,
//     },
//     statuses: [],
//     actions: [ActionName.Attack, ActionName.Magic, ActionName.Item, ActionName.Defend, ActionName.Move],
//     abilities: {
//       // [ActionName._Attack]: [_AttackName.Slash],
//       [ActionName.Magic]: [MagicSpellName.Quake],
//     },
//     attributes: {
//       strength: 34,
//       intelligence: 18,
//       dexterity: 22,
//       agility: 24,
//       vigor: 32,
//       wisdom: 19,
//       luck: 24,
//     },
//     equipment: {
//       head: null,
//       body: null,
//       shield: null,
//       weapon: null,
//       feet: null,
//       accessory: null,
//       accessory2: null,
//     },
//   },
//   {
//     id: idMaker(),
//     name: "Abigail",
//     type: "hero",
//     maxHp: 520,
//     maxMp: 50,
//     hp: 520,
//     mp: 50,
//     speed: 54,
//     level: 7,
//     xp: 4600,
//     imgUrl: "/sprites/sprite-09.webp",
//     position: {
//       lane: Lane.Back,
//       col: Col.Right,
//     },
//     statuses: [],
//     actions: [
//       ActionName.Attack,
//       ActionName.Magic,
//       ActionName.Summon,
//       ActionName.Item,
//       ActionName.Defend,
//       ActionName.Move,
//       ActionName._Attack,
//     ],
//     abilities: {
//       [ActionName._Attack]: [_AttackName.Arrow, _AttackName.StoneThrow],
//       [ActionName.Magic]: [MagicSpellName.Thunder, MagicSpellName.Bio, MagicSpellName.Cure],
//       [ActionName.Summon]: ["DireWolf"],
//     },
//     attributes: {
//       strength: 17,
//       intelligence: 31,
//       dexterity: 28,
//       agility: 26,
//       vigor: 20,
//       wisdom: 30,
//       luck: 19,
//     },
//     equipment: {
//       head: null,
//       body: null,
//       shield: null,
//       weapon: null,
//       feet: null,
//       accessory: null,
//       accessory2: null,
//     },
//   },
//   {
//     id: idMaker(),
//     name: "Savannah",
//     type: "hero",
//     maxHp: 570,
//     maxMp: 70,
//     hp: 570,
//     mp: 70,
//     speed: 62,
//     level: 7,
//     xp: 4600,
//     imgUrl: "/sprites/sprite-04.webp",
//     position: {
//       lane: Lane.Front,
//       col: Col.Left,
//     },
//     statuses: [],
//     actions: [
//       ActionName.Attack,
//       ActionName.Steal,
//       ActionName.Defend,
//       ActionName.Magic,
//       ActionName.Invoke,
//       ActionName.Item,
//       ActionName.Move,
//     ],
//     abilities: {
//       // [ActionName.Attack]: [_AttackName.Stab, _AttackName.Arrow],
//       [ActionName.Magic]: [MagicSpellName.Hydro, MagicSpellName.Bio],
//       [ActionName.Invoke]: ["DireWolf"],
//     },
//     attributes: {
//       strength: 25,
//       intelligence: 24,
//       dexterity: 23,
//       agility: 29,
//       vigor: 28,
//       wisdom: 20,
//       luck: 25,
//     },
//     equipment: {
//       head: null,
//       body: null,
//       shield: null,
//       weapon: null,
//       feet: null,
//       accessory: null,
//       accessory2: null,
//     },
//   },
// ];
