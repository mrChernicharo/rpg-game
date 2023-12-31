export enum GameScreen {
  Home = "home",
  Battle = "battle",
  Dungeon = "dungeon",
  MainMenu = "main-menu",
  EquipmentMenu = "equipment-menu",
  MagicMenu = "magic-menu",
  ItemsMenu = "items-menu",
  SkillsMenu = "skills-menu",
  settingsMenu = "settings-menu",
}

export enum Lane {
  Front = "front",
  Back = "back",
}

export enum Col {
  Left = "left",
  Center = "center",
  Right = "right",
}

export enum AttributeName {
  Strength = "strength",
  Dexterity = "dexterity",
  Intelligence = "intelligence",
  Agility = "agility",
  Vigor = "vigor",
  Wisdom = "wisdom",
  Luck = "luck",
}

export enum HeroClassName {
  Knight = "knight",
  Barbarian = "barbarian",
  Mage = "mage",
  Sorcerer = "sorcerer",
  Druid = "druid",
  Ranger = "ranger",
  Thief = "thief",
  Cleric = "cleric",
}

export enum InventoryItemType {
  Equipment = "equipment",
  Consumable = "consumable",
  Key = "key",
}

export enum EquipmentSlot {
  Head = "head",
  Body = "body",
  Shield = "shield",
  Weapon = "weapon",
  Feet = "feet",
  Accessory = "accessory",
  Accessory2 = "accessory2",
}

export enum InventoryItemName {
  // Consumable Items
  Potion = "Potion",
  HiPotion = "Hi-Potion",
  Ether = "Ether",
  PhoenixDown = "PhoenixDown",
  Antidote = "Antidote",
  EchoScreen = "EchoScreen",
  Remedy = "Remedy",
  Elixir = "Elixir",
  SleepingBag = "SleepingBag",
  GysahlGreen = "GysahlGreen",
  HeroDrink = "HeroDrink",
  Tent = "Tent",
  Megalixir = "Megalixir",
  Grenade = "Grenade",
  Shuriken = "Shuriken",

  // Weapons
  Dagger = "Dagger",
  ShortSword = "ShortSword",
  LongSword = "LongSword",
  IronAxe = "IronAxe",
  Mace = "Mace",

  // DiamondSword = "DiamondSword",
  // RuneBlade = "RuneBlade",
  // MasamuneBlade = "MasamuneBlade",
  // Deathbringer = "Deathbringer",
  // UltimaWeapon = "UltimaWeapon",
  // Apocalypse = "Apocalypse",
  // Ragnarok = "Ragnarok",
  // Excalibur = "Excalibur",
  // CrystalSword = "CrystalSword",
  // Excalipoor = "Excalipoor",
  // ApocalypseBlade = "ApocalypseBlade",
  // Lionheart = "Lionheart",
  // Outsider = "Outsider",
  // Organics = "Organics",
  // ChaosBlade = "ChaosBlade",
  // HeavenSword = "HeavenSword",
  // ApocalypseEdge = "ApocalypseEdge",
  // BraveBlade = "BraveBlade",
  RuneStaff = "RuneStaff",
  WizardRod = "WizardRod",
  MythrilRod = "MythrilRod",
  // Nirvana = "Nirvana",
  // HolyLance = "HolyLance",
  // Orichalcum = "Orichalcum",
  // Godhand = "Godhand",
  // PoisonKnuckles = "PoisonKnuckles",
  // DeathSickle = "DeathSickle",
  // WingedSword = "WingedSword",
  // SaveTheQueen = "SaveTheQueen",
  // Masamune = "Masamune",
  // ZodiacSpear = "ZodiacSpear",

  HunterBow = "HunterBow",
  CompositeBow = "CompositeBow",
  Revolver = "Revolver",
  YoichiBow = "YoichiBow",
  ArtemisBow = "ArtemisBow",

  // Body
  LeatherArmor = "LeatherArmor",
  Chainmail = "Chainmail",
  PlateArmor = "PlateArmor",
  MysticRobe = "MysticRobe",
  PowerSuit = "PowerSuit",
  DragonScaleArmor = "DragonScaleArmor",
  DarkCloak = "DarkCloak",
  BlackRobe = "BlackRobe",
  WhiteCape = "WhiteCape",
  LinnenTunic = "LinnenTunic",

  // head
  MythrilHelm = "MythrilHelm",
  WizardHat = "WizardHat",

  // shield
  CrystalShield = "CrystalShield",
  // feet
  HunterBoots = "HunterBoots",

  // Accessories
  SoulPendant = "SoulPendant",
  Grimoire = "Grimoire",
  DiamondBracelet = "DiamondBracelet",
  AngelWing = "AngelWing",
  GoldenGauntlet = "GoldenGauntlet",
}

export enum ActionName {
  _Attack = "_attack",
  MeleeAttack = "melee_attack",
  RangedAttack = "ranged_attack",
  Magic = "magic",
  Defend = "defend",
  Steal = "steal",
  Invoke = "invoke",
  Summon = "summon",
  Hide = "hide",
  Item = "item",
  Move = "move",
  Status = "status",
}

export enum _AttackName {
  Punch = "punch",
  Stab = "stab",
  Slash = "slash",
  Arrow = "arrow",
  StoneThrow = "stone throw",
  Claws = "claws",
  Bite = "bite",
  TailWhip = "tail whip",
  IceBolt = "ice bolt",
  // SnowStorm = "SnowStorm",
  // FireBreath = "FireBreath",
  // Electrocute = "Electrocute",
}

export enum MagicSpellName {
  // Attack Spells
  Fire = "Fire",
  Hydro = "Hydro",
  Aero = "Aero",
  Quake = "Quake",
  Thunder = "Thunder",
  Blizzard = "Blizzard",
  Bio = "Bio",
  Meteor = "Meteor",
  Demi = "Demi",
  Drain = "Drain",
  // Aid Spells
  Cure = "Cure",
  Regen = "Regen",
  Haste = "Haste",
  Detox = "Detox",
  Remedy = "Remedy",
  Cleanse = "Cleanse",
  Protect = "Protect",
  Shell = "Shell",
  // Ailment Spells
  Slow = "Slow",
  Silence = "Silence",
  Confuse = "Confuse",
  Sleep = "Sleep",
  Dispel = "Dispel",
}

export enum Element {
  Fire = "Fire",
  Water = "Water",
  Wind = "Wind",
  Earth = "Earth",
  Ice = "Ice",
  Poison = "Poison",
  Lightning = "Lightning",
  Shadow = "Shadow",
  // Gravity = 'Gravity',
  // Time = 'Time',
  // Death = 'Death',
  // Healing = 'Healing',
  // Barrier = 'Barrier',
  // Sound = 'Sound',
}

export enum StatusName {
  Defense = "Defense",
  Poison = "Poison",
  Silence = "Silence",
  Petrify = "Petrify",
  Slow = "Slow",
  Stop = "Stop",
  Confuse = "Confuse",
  Sleep = "Sleep",
  Berserk = "Berserk",
  Blind = "Blind",
  Mini = "Mini",
  DeathSentence = "DeathSentence",
  Regen = "Regen",
  Haste = "Haste",
  Barrier = "Barrier",
  MagiBarrier = "MagiBarrier",
  // Reflect = "Reflect",
  // Doom = "Doom",
  // Toad = "Toad",
  // Curse = "Curse",
  // Charm = "Charm",
  // Zombie = "Zombie",
}

export enum StatusDescription {
  Defense = "Halves damage from melee attacks",
  Regen = "Gradually restores the affected character's health over time.",
  Haste = "Increases the affected character's speed or action frequency.",
  Barrier = "Enhances the affected character's defenses against melee attacks.",
  MagiBarrier = "Enhances the affected character's defenses against magic attacks.",
  Poison = "Inflicts gradual damage over time to the affected character.",
  Berserk = "Enrages the affected character, causing them to attack relentlessly.",
  Silence = "Prevents the affected character from casting magic.",
  Petrify = "Turns the affected character into stone, rendering them unable to act.",
  Slow = "Reduces the affected character's speed or action frequency.",
  Stop = "Completely halts the affected character's actions for a duration.",
  Confuse = "Causes the affected character to randomly attack allies or enemies.",
  Sleep = "Puts the affected character into a deep slumber, making them unable to act.",
  Blind = "Reduces the affected character's accuracy, making their attacks more likely to miss.",
  Mini = "Shrinks the affected character, reducing their stats and making them vulnerable.",
  DeathSentence = "Places a countdown on the affected character, leading to instant KO when it reaches zero.",
  // Reflect = "Causes spells cast on the affected character to bounce back to the caster.",
  // Doom = "Sets a timer on the affected character, resulting in instant KO when it expires.",
  // Toad = "Transforms the affected character into a frog, limiting their abilities.",
  // Curse = "Imposes various negative effects on the affected character's abilities.",
  // Charm = "Controls the affected character temporarily, making them act against their will.",
  // Zombie = "Turns the affected character undead, making healing abilities harm instead of help.",
}

export enum MagicSpellDescription {
  // Attack Spells
  Fire = "Deals fire damage to a single target.",
  Water = "Deals water-based damage to a single target.",
  Aero = "Inflicts wind-based damage to a single target.",
  Quake = "Causes an earthquake, dealing ground-based damage to all enemies.",
  Thunder = "Inflicts lightning damage to a single target.",
  Blizzard = "Deals ice-based damage to a single target.",
  Poison = "Inflicts poison status on a single target.",
  Meteor = "Summons a meteor shower, dealing massive damage to all enemies.",
  Demi = "Reduces the HP of a single target by a percentage.",
  Drain = "Drains HP from a single target and restores it to the user.",
  // MagiDrain = "Drains MP from a single target and restores it to the user.",
  Cure = "Restores a moderate amount of HP to a single target.",
  Regen = "Gradually restores HP over time to a single target.",
  Haste = "Increases the speed or action frequency of a single target.",
  Detox = "Cures the target of poison status.",
  Dispel = "Removes beneficial status effects from a single target.",
  Protect = "Increases the defense of a single target against melee attacks.",
  Shell = "Increases the magical defense of a single target.",
  Slow = "Reduces the speed or action frequency of a single target.",
  Silence = "Prevents a single target from casting spells.",
  Confuse = "Causes a single target to attack allies or enemies randomly.",
  Sleep = "Puts a single target into a deep slumber, rendering them unable to act.",
  Remedy = "Removes multiple status ailments from a single target.",
  Cleanse = "Cleanses the party of all negative status effects.",
  // New Spells for Curing Negative Statuses
  // Esuna = "Cures various status ailments from a single target.",
  // Purify = "Cleanses a single target of all negative effects.",
}

export enum InventoryItemDescription {
  // Consumables
  Potion = "Restores a small amount of health to the user.",
  HiPotion = "Restores a moderate amount of health to the user.",
  Ether = "Restores a small amount of magic points to the user.",
  PhoenixDown = "Revives a fallen ally with a small amount of health.",
  Antidote = "Cures the user of poison status.",
  Remedy = "Cures various status ailments.",
  Tent = "Allows the party to rest and recover HP/MP while camping.",
  SleepingBag = "Allows the party to rest and recover HP/MP more comfortably than a Tent.",
  EchoScreen = "Cures the user of silence status.",
  GysahlGreen = "A treat loved by Chocobos, used to call them in certain situations.",
  HeroDrink = "Temporarily boosts the user's stats in battle.",
  Megalixir = "Completely restores the party's HP and MP.",
  Elixir = "Completely restores the user's HP and MP.",
  Grenade = "Inflicts damage to enemies in battle.",
  Shuriken = "Throwing weapon that damages enemies in battle.",

  // Weapon - melee
  ShortSword = "Basic sword for close-range combat.",
  LongSword = "A longer sword for more powerful strikes.",
  // DiamondSword = "A sword made of diamond, offering enhanced cutting ability.",
  // RuneBlade = "A blade infused with magical runes, granting mystical properties.",
  // MasamuneBlade = "Legendary sword known for its exceptional strength and sharpness.",
  // Deathbringer = "A sword with the power to cause fatal wounds.",
  // UltimaWeapon = "An ultimate weapon with immense power.",
  // Apocalypse = "A weapon bringing catastrophic destruction.",
  // Ragnarok = "A legendary sword of great strength and holy power.",
  // Excalibur = "A mythical sword said to possess immense abilities.",
  // CrystalSword = "A sword made of crystal, enhancing magical abilities.",
  // Excalipoor = "A fake version of the legendary sword, weak and practically useless.",
  // ApocalypseBlade = "A version of the Apocalypse blade, even more devastating.",
  // Lionheart = "A powerful blade that resonates with the user's emotions.",
  // Outsider = "A weapon from beyond, possessing mysterious abilities.",
  // Organics = "A weapon infused with natural elements, enhancing its power.",
  // ChaosBlade = "A sword shrouded in chaos energy, unpredictable yet formidable.",
  // HeavenSword = "A celestial sword blessed with divine powers.",
  // ApocalypseEdge = "A variant of the Apocalypse, known for its deadly edge.",
  // BraveBlade = "A blade that grows stronger with the bravery of its wielder.",
  // Godhand = "Handgear infused with godly energy, amplifying melee and magical abilities.",
  // PoisonKnuckles = "Knuckles coated with deadly poison, inflicting poison status.",
  // DeathSickle = "Sickle with the power to cause fatal wounds.",
  // WingedSword = "Sword enchanted with wings, granting agility and speed.",
  // SaveTheQueen = "Legendary sword known for its ability to protect its wielder.",
  // Masamune = "Blade crafted by a legendary swordsmith, carrying immense power.",
  // ZodiacSpear = "Spear embodying the signs of the zodiac, offering versatile abilities.",
  // RuneStaff = "Staff imbued with ancient runes, enhancing magical prowess.",
  // WizardRod = "Rod favored by wizards, amplifying spellcasting abilities.",
  // Nirvana = "An ultimate staff with unparalleled magical power.",
  // HolyLance = "Lance infused with holy energy, dealing divine damage.",
  // Orichalcum = "Rare and powerful material used in creating legendary items.",

  // Weapon - ranged
  HunterBow = "Basic ranged weapon, allows to shoot arrows",
  CompositeBow = "Advanced bow, deals reasonable damage",
  Revolver = "A handgun for ranged attacks.",
  YoichiBow = "Bow favored by abilityed archers, increasing accuracy and range.",
  ArtemisBow = "Bow dedicated to the goddess of the hunt, enhancing hunting abilities.",

  // Armor
  LeatherArmor = "Basic armor offering minimal protection.",
  Chainmail = "Armor made of interlocking metal rings.",
  PlateArmor = "Heavy armor made of metal plates, providing substantial defense.",
  MysticRobe = "Robe infused with mystical properties, enhancing magical abilities.",
  PowerSuit = "Advanced suit offering a balance between defense and flexibility.",
  DragonScaleArmor = "Armor crafted from dragon scales, offering great resistance.",
  CrystalShield = "Shield made of crystal, enhancing magical defense.",
  MythrilHelm = "Helm made of mythril, offering good protection and agility.",
  WizardHat = "Hat favored by magic users, enhancing spellcasting abilities.",
  DarkCloak = "Cloak imbued with darkness, granting shadowy abilities.",
  BlackRobe = "Robe that enhances dark magic and provides resistance to it.",
  WhiteCape = "Cape infused with light, providing protection against holy magic.",

  // Accessories
  SoulPendant = "Golden pendant, enhances magical abilities.",
  Grimoire = "A book containing powerful spells.",
  AngelWing = "Allows the user to cast divine magic.",
  DiamondBracelet = "Bracelet adorned with diamonds, offering magical protection.",
  GoldenGauntlet = "Gauntlet made of gold, enhancing melee strength.",
}
