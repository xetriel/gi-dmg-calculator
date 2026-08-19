import fs from "fs";
import path from "path";

interface SubStat {
  type: string;
  label: string;
  value: number;
  baseValue?: number;
}

interface MechanicDef {
  id: string;
  label: string;
  control: "toggle" | "slider" | "stacks";
  defaultValue?: number | string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

interface BuffDef {
  id: string;
  label: string;
  description?: string;
  stat: string;
  refinementValues: [number, number, number, number, number];
  isTeamBuff: boolean;
  isPercent?: boolean;
  conditionKey?: string;
  computeCode?: string;
}

interface WeaponData {
  id: string;
  varName: string;
  name: string;
  type: "Claymore";
  rarity: 1 | 2 | 3 | 4 | 5;
  baseAtk: number;
  lvl1BaseAtk: number;
  subStat?: SubStat;
  passiveName: string;
  passiveDesc: string;
  isSupport: boolean;
  buffType: "team" | "self" | "both";
  buffs: BuffDef[];
  mechanicDefs?: MechanicDef[];
  signatureFor?: string[];
}

const CLAYMORES_DATA: WeaponData[] = [
  // 5-STAR CLAYMORES
  {
    id: "a-thousand-blazing-suns",
    varName: "aThousandBlazingSuns",
    name: "A Thousand Blazing Suns",
    type: "Claymore",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Sun's Radiance",
    passiveDesc: "When the equipping character is in Nightsoul's Blessing or uses an Elemental Skill, ATK is increased by 24~48% and CRIT DMG is increased by 40~80% for 6s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "blazing-suns-active", label: "Nightsoul / Skill Active", control: "toggle", defaultValue: 1, hint: "+24~48% ATK and +40~80% CRIT DMG" },
    ],
    buffs: [
      { id: "blazing-suns-atk", label: "ATK% (A Thousand Blazing Suns)", stat: "atk", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, isPercent: true, conditionKey: "blazing-suns-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['blazing-suns-active'] ?? '1') === '1' || Number(ctx.inputs?.['blazing-suns-active'] ?? 1) > 0; return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0; }" },
      { id: "blazing-suns-crit-dmg", label: "CRIT DMG% (A Thousand Blazing Suns)", stat: "critDmg", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, conditionKey: "blazing-suns-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['blazing-suns-active'] ?? '1') === '1' || Number(ctx.inputs?.['blazing-suns-active'] ?? 1) > 0; return on ? [40, 50, 60, 70, 80][r - 1] : 0; }" },
    ],
    signatureFor: ["mavuika"],
  },
  {
    id: "beacon-of-the-reed-sea",
    varName: "beaconOfTheReedSea",
    name: "Beacon of the Reed Sea",
    type: "Claymore",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Desert Watch",
    passiveDesc: "After the character's Elemental Skill hits an opponent, their ATK will be increased by 20~40% for 8s. After the character takes DMG, their ATK will be increased by 20~40% for 8s. Max HP is increased by 32~64% when not shielded.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "beacon-skill-hit", label: "Skill Hit Opponent (+20~40% ATK)", control: "toggle", defaultValue: 1, hint: "+20~40% ATK" },
      { id: "beacon-take-dmg", label: "Took DMG (+20~40% ATK)", control: "toggle", defaultValue: 1, hint: "+20~40% ATK" },
      { id: "beacon-unshielded", label: "Not Protected by Shield (+32~64% HP)", control: "toggle", defaultValue: 1, hint: "+32~64% Max HP" },
    ],
    buffs: [
      { id: "beacon-atk-buff", label: "ATK% (Beacon of the Reed Sea)", stat: "atk", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => { const s1 = (ctx.inputs?.['beacon-skill-hit'] ?? '1') === '1' || Number(ctx.inputs?.['beacon-skill-hit'] ?? 1) > 0; const s2 = (ctx.inputs?.['beacon-take-dmg'] ?? '1') === '1' || Number(ctx.inputs?.['beacon-take-dmg'] ?? 1) > 0; const count = (s1 ? 1 : 0) + (s2 ? 1 : 0); return ((count * [20, 25, 30, 35, 40][r - 1]) / 100) * ctx.baseAtk; }" },
      { id: "beacon-hp-buff", label: "HP% (Beacon of the Reed Sea)", stat: "hp", refinementValues: [32, 40, 48, 56, 64], isTeamBuff: false, isPercent: true, conditionKey: "beacon-unshielded", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['beacon-unshielded'] ?? '1') === '1' || Number(ctx.inputs?.['beacon-unshielded'] ?? 1) > 0; return on ? [32, 40, 48, 56, 64][r - 1] : 0; }" },
    ],
    signatureFor: ["dehya"],
  },
  {
    id: "fang-of-the-mountain-king",
    varName: "fangOfTheMountainKing",
    name: "Fang of the Mountain King",
    type: "Claymore",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Turquoise Dawn",
    passiveDesc: "Gain 1 stack of Canopy's Favor when an Elemental Skill hits an opponent. Can be triggered once every 0.5s. After a nearby party member triggers a Burning or Burgeon reaction, the equipping character will gain 3 stacks. Max 6 stacks. Each stack increases Elemental Skill and Elemental Burst DMG by 10~20%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "canopy-stacks", label: "Canopy's Favor Stacks (0-6)", control: "stacks", max: 6, defaultValue: 6, hint: "+10~20% Skill & Burst DMG per stack (up to +60~120%)" },
    ],
    buffs: [
      { id: "fang-skill-dmg", label: "Elemental Skill DMG Bonus (Fang of the Mountain King)", stat: "skillDmgBonus", refinementValues: [60, 75, 90, 105, 120], isTeamBuff: false, conditionKey: "canopy-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['canopy-stacks'] ?? 6); return s * [10, 12.5, 15, 17.5, 20][r - 1]; }" },
      { id: "fang-burst-dmg", label: "Elemental Burst DMG Bonus (Fang of the Mountain King)", stat: "burstDmgBonus", refinementValues: [60, 75, 90, 105, 120], isTeamBuff: false, conditionKey: "canopy-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['canopy-stacks'] ?? 6); return s * [10, 12.5, 15, 17.5, 20][r - 1]; }" },
    ],
    signatureFor: ["kinich"],
  },
  {
    id: "redhorn-stonethresher",
    varName: "redhornStonethresher",
    name: "Redhorn Stonethresher",
    type: "Claymore",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Gokadaiou Otogibanashi",
    passiveDesc: "DEF is increased by 28~56%. Normal and Charged Attack DMG is increased by 40~80% of DEF.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "redhorn-def", label: "Character Total DEF", control: "stacks", max: 10000, defaultValue: 2500, hint: "Total DEF used for Redhorn NA/CA flat DMG bonus (40~80%)" },
    ],
    buffs: [
      { id: "redhorn-def-pct", label: "DEF% (Redhorn Stonethresher)", stat: "def", refinementValues: [28, 35, 42, 49, 56], isTeamBuff: false, isPercent: true, computeCode: "(r) => [28, 35, 42, 49, 56][r - 1]" },
      { id: "redhorn-na-flat", label: "Normal/Charged Flat DMG from DEF (Redhorn)", stat: "flatDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, computeCode: "(r, ctx) => { const def = Number(ctx.inputs?.['redhorn-def'] ?? 2500); const ratio = [0.4, 0.5, 0.6, 0.7, 0.8][r - 1]; return def * ratio; }" },
    ],
    signatureFor: ["itto", "noelle"],
  },
  {
    id: "skyward-pride",
    varName: "skywardPride",
    name: "Skyward Pride",
    type: "Claymore",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 36.8, baseValue: 8.0 },
    passiveName: "Sky-ripping Dragon Spine",
    passiveDesc: "Increases all DMG by 8~16%. After using an Elemental Burst, Normal or Charged Attacks create a vacuum blade that deals 80~160% of ATK as DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "skyward-pride-dmg", label: "All DMG Bonus (Skyward Pride)", stat: "dmgBonus", refinementValues: [8, 10, 12, 14, 16], isTeamBuff: false, computeCode: "(r) => [8, 10, 12, 14, 16][r - 1]" },
    ],
  },
  {
    id: "the-unforged",
    varName: "theUnforged",
    name: "The Unforged",
    type: "Claymore",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Golden Majesty",
    passiveDesc: "Increases Shield Strength by 20~40%. Scoring hits on opponents increases ATK by 4~8% for 8s. Max 5 stacks. While protected by a shield, this ATK increase effect is increased by 100%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "unforged-stacks", label: "Golden Majesty Stacks (0-5)", control: "stacks", max: 5, defaultValue: 5, hint: "+4~8% ATK per stack" },
      { id: "unforged-shielded", label: "Protected by Shield (2x ATK Buff)", control: "toggle", defaultValue: 1, hint: "Doubles ATK bonus from stacks" },
    ],
    buffs: [
      { id: "unforged-atk", label: "ATK% (The Unforged Stacks)", stat: "atk", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, conditionKey: "unforged-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['unforged-stacks'] ?? 5); const shielded = (ctx.inputs?.['unforged-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['unforged-shielded'] ?? 1) > 0; const mult = shielded ? 2 : 1; return ((s * [4, 5, 6, 7, 8][r - 1] * mult) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "verdict",
    varName: "verdict",
    name: "Verdict",
    type: "Claymore",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 22.1, baseValue: 4.8 },
    passiveName: "Many Oaths of Dawn and Dusk",
    passiveDesc: "Increases ATK by 20~40%. When party members obtain Elemental Shards from Crystallize reactions, the equipping character will gain 1 Seal, increasing Elemental Skill DMG by 18~36%. Max 2 seals. All seals disappear 0.5s after the wielder's Elemental Skill deals DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "verdict-seals", label: "Crystallize Seals (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+18~36% Skill DMG per seal (up to +36~72%)" },
    ],
    buffs: [
      { id: "verdict-atk", label: "ATK% (Verdict)", stat: "atk", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk" },
      { id: "verdict-skill-dmg", label: "Elemental Skill DMG Bonus (Verdict Seals)", stat: "skillDmgBonus", refinementValues: [36, 45, 54, 63, 72], isTeamBuff: false, conditionKey: "verdict-seals", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['verdict-seals'] ?? 2); return s * [18, 22.5, 27, 31.5, 36][r - 1]; }" },
    ],
    signatureFor: ["navia"],
  },

  // 4-STAR CLAYMORES
  {
    id: "akuoumaru",
    varName: "akuoumaru",
    name: "Akuoumaru",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Watatsumi Wavewalker",
    passiveDesc: "For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12~0.24%. A maximum of 40~80% increased Elemental Burst DMG can be achieved this way.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "party-energy-capacity", label: "Combined Party Energy Capacity (e.g. 240-330)", control: "stacks", max: 400, defaultValue: 280, hint: "Total Energy of party (e.g. 80+80+60+60 = 280)" },
    ],
    buffs: [
      { id: "akuoumaru-burst-dmg", label: "Elemental Burst DMG Bonus (Akuoumaru)", stat: "burstDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, computeCode: "(r, ctx) => { const energy = Number(ctx.inputs?.['party-energy-capacity'] ?? 280); const ratio = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; const cap = [40, 50, 60, 70, 80][r - 1]; return Math.min(energy * ratio * 100, cap); }" },
    ],
  },
  {
    id: "blackcliff-slasher",
    varName: "blackcliffSlasher",
    name: "Blackcliff Slasher",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 55.1, baseValue: 12.0 },
    passiveName: "Press the Advantage",
    passiveDesc: "After defeating an opponent, ATK is increased by 12~24% for 30s. This effect has a maximum of 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "blackcliff-slasher-stacks", label: "Defeat Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+12~24% ATK per defeat" },
    ],
    buffs: [
      { id: "blackcliff-slasher-atk", label: "ATK% (Blackcliff Slasher)", stat: "atk", refinementValues: [36, 45, 54, 63, 72], isTeamBuff: false, isPercent: true, conditionKey: "blackcliff-slasher-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['blackcliff-slasher-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "earth-shaker",
    varName: "earthShaker",
    name: "Earth Shaker",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Oath of the Far-Flung Sands",
    passiveDesc: "After a party member triggers a Pyro-related reaction, the equipping character's Elemental Skill DMG is increased by 16~32% for 8s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "earth-shaker-pyro-proc", label: "Pyro Reaction Triggered", control: "toggle", defaultValue: 1, hint: "+16~32% Skill DMG bonus" },
    ],
    buffs: [
      { id: "earth-shaker-skill-dmg", label: "Elemental Skill DMG Bonus (Earth Shaker)", stat: "skillDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, conditionKey: "earth-shaker-pyro-proc", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['earth-shaker-pyro-proc'] ?? '1') === '1' || Number(ctx.inputs?.['earth-shaker-pyro-proc'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }" },
    ],
  },
  {
    id: "favonius-greatsword",
    varName: "favoniusGreatsword",
    name: "Favonius Greatsword",
    type: "Claymore",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 61.3, baseValue: 13.3 },
    passiveName: "Windfall",
    passiveDesc: "CRIT hits have a 60~100% chance to generate 1 Elemental Orb, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
    isSupport: true,
    buffType: "team",
    buffs: [],
  },
  {
    id: "fruitful-hook",
    varName: "fruitfulHook",
    name: "Fruitful Hook",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "The Weight of the Branch",
    passiveDesc: "Increases Plunging Attack CRIT Rate by 16~32%. After a Plunging Attack hits an opponent, Normal, Charged, and Plunging Attack DMG is increased by 16~32% for 10s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "fruitful-plunge-crit", label: "Plunging Attack CRIT Rate% (Fruitful Hook)", stat: "critRate", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
      { id: "fruitful-na-ca-plunge-dmg", label: "NA/CA/Plunge DMG Bonus (Fruitful Hook)", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    id: "katsuragikiri-nagamasa",
    varName: "katsuragikiriNagamasa",
    name: "Katsuragikiri Nagamasa",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Samurai Conduct",
    passiveDesc: "Increases Elemental Skill DMG by 6~12%. After Elemental Skill hits an opponent, character loses 3 Energy but regenerates 3~5 Energy every 2s for 6s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "katsuragi-skill-dmg", label: "Elemental Skill DMG Bonus (Katsuragikiri Nagamasa)", stat: "skillDmgBonus", refinementValues: [6, 7.5, 9, 10.5, 12], isTeamBuff: false, computeCode: "(r) => [6, 7.5, 9, 10.5, 12][r - 1]" },
    ],
  },
  {
    id: "lithic-blade",
    varName: "lithicBlade",
    name: "Lithic Blade",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Lithic Axiom: Unity",
    passiveDesc: "For every character in the party who hails from Liyue, the character equipping this weapon gains 7~11% ATK increase and 3~7% CRIT Rate increase. Max 4 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "lithic-liyue-members", label: "Liyue Characters in Party (0-4)", control: "stacks", max: 4, defaultValue: 2, hint: "+7~11% ATK & +3~7% CRIT Rate per Liyue character" },
    ],
    buffs: [
      { id: "lithic-atk", label: "ATK% (Lithic Blade)", stat: "atk", refinementValues: [28, 32, 36, 40, 44], isTeamBuff: false, isPercent: true, conditionKey: "lithic-liyue-members", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['lithic-liyue-members'] ?? 2); return ((s * [7, 8, 9, 10, 11][r - 1]) / 100) * ctx.baseAtk; }" },
      { id: "lithic-crit-rate", label: "CRIT Rate% (Lithic Blade)", stat: "critRate", refinementValues: [12, 16, 20, 24, 28], isTeamBuff: false, conditionKey: "lithic-liyue-members", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['lithic-liyue-members'] ?? 2); return s * [3, 4, 5, 6, 7][r - 1]; }" },
    ],
  },
  {
    id: "luxurious-sea-lord",
    varName: "luxuriousSeaLord",
    name: "Luxurious Sea-Lord",
    type: "Claymore",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Oceanic Victory",
    passiveDesc: "Increases Elemental Burst DMG by 12~24%. When Elemental Burst hits opponents, summons a titanic tuna that deals 100~200% ATK as AoE DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "sea-lord-burst-dmg", label: "Elemental Burst DMG Bonus (Luxurious Sea-Lord)", stat: "burstDmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
    ],
  },
  {
    id: "mailed-flower",
    varName: "mailedFlower",
    name: "Mailed Flower",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Whispers of Wind and Flower",
    passiveDesc: "Within 8s after an Elemental Skill hits an opponent or triggers an Elemental Reaction, ATK is increased by 12~24% and Elemental Mastery is increased by 48~96.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "mailed-flower-active", label: "Skill Hit / Reaction Triggered", control: "toggle", defaultValue: 1, hint: "+12~24% ATK and +48~96 EM for 8s" },
    ],
    buffs: [
      { id: "mailed-flower-atk", label: "ATK% (Mailed Flower)", stat: "atk", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, isPercent: true, conditionKey: "mailed-flower-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['mailed-flower-active'] ?? '1') === '1' || Number(ctx.inputs?.['mailed-flower-active'] ?? 1) > 0; return on ? ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk : 0; }" },
      { id: "mailed-flower-em", label: "Elemental Mastery (Mailed Flower)", stat: "em", refinementValues: [48, 60, 72, 84, 96], isTeamBuff: false, conditionKey: "mailed-flower-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['mailed-flower-active'] ?? '1') === '1' || Number(ctx.inputs?.['mailed-flower-active'] ?? 1) > 0; return on ? [48, 60, 72, 84, 96][r - 1] : 0; }" },
    ],
  },
  {
    id: "makhaira-aquamarine",
    varName: "makhairaAquamarine",
    name: "Makhaira Aquamarine",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Desert Pavilion",
    passiveDesc: "The equipping character gains 24~48% of their Elemental Mastery as extra ATK for 12s. Nearby party members gain 30% of this buff for the same duration.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      { id: "makhaira-wielder-em", label: "Makhaira Wielder EM", control: "stacks", max: 2000, defaultValue: 800, hint: "Wielder's EM used for party ATK sharing" },
    ],
    buffs: [
      { id: "makhaira-party-atk", label: "Party ATK from Wielder EM (Makhaira Aquamarine)", description: "Party members gain 30% of wielder's EM-to-ATK conversion", stat: "atk", refinementValues: [7.2, 9.0, 10.8, 12.6, 14.4], isTeamBuff: true, computeCode: "(r, ctx) => { const em = Number(ctx.inputs?.['makhaira-wielder-em'] ?? 800); const ratio = [0.24 * 0.3, 0.30 * 0.3, 0.36 * 0.3, 0.42 * 0.3, 0.48 * 0.3][r - 1]; return em * ratio; }" },
    ],
  },
  {
    id: "rainslasher",
    varName: "rainslasher",
    name: "Rainslasher",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Bane of Storm and Tide",
    passiveDesc: "Increases DMG against opponents affected by Hydro or Electro by 20~36%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "rainslasher-target", label: "Target Affected by Hydro/Electro", control: "toggle", defaultValue: 1, hint: "+20~36% All DMG bonus vs Hydro/Electro targets" },
    ],
    buffs: [
      { id: "rainslasher-dmg", label: "All DMG Bonus (Rainslasher)", stat: "dmgBonus", refinementValues: [20, 24, 28, 32, 36], isTeamBuff: false, conditionKey: "rainslasher-target", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['rainslasher-target'] ?? '1') === '1' || Number(ctx.inputs?.['rainslasher-target'] ?? 1) > 0; return on ? [20, 24, 28, 32, 36][r - 1] : 0; }" },
    ],
  },
  {
    id: "royal-greatsword",
    varName: "royalGreatsword",
    name: "Royal Greatsword",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Focus",
    passiveDesc: "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks. A CRIT hit removes all stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "royal-greatsword-stacks", label: "Focus Stacks (0-5)", control: "stacks", max: 5, defaultValue: 3, hint: "+8~16% CRIT Rate per stack" },
    ],
    buffs: [
      { id: "royal-greatsword-crit", label: "CRIT Rate% (Royal Greatsword)", stat: "critRate", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "royal-greatsword-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['royal-greatsword-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; }" },
    ],
  },
  {
    id: "sacrificial-greatsword",
    varName: "sacrificialGreatsword",
    name: "Sacrificial Greatsword",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Composed",
    passiveDesc: "After damaging an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
    isSupport: true,
    buffType: "self",
    buffs: [],
  },
  {
    id: "serpent-spine",
    varName: "serpentSpine",
    name: "Serpent Spine",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Wavesplitter",
    passiveDesc: "Every 4s a character is on the field, they will deal 6~10% more DMG and take 3~1.8% more DMG. This effect has a maximum of 5 stacks and will not be reset if the character leaves the field, but will be reduced by 1 stack when the character takes DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "serpent-stacks", label: "Wavesplitter Stacks (0-5)", control: "stacks", max: 5, defaultValue: 5, hint: "+6~10% All DMG bonus per stack (up to +30~50%)" },
    ],
    buffs: [
      { id: "serpent-dmg", label: "All DMG Bonus (Serpent Spine)", stat: "dmgBonus", refinementValues: [30, 35, 40, 45, 50], isTeamBuff: false, conditionKey: "serpent-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['serpent-stacks'] ?? 5); return s * [6, 7, 8, 9, 10][r - 1]; }" },
    ],
  },
  {
    id: "snow-tombed-starsilver",
    varName: "snowTombedStarsilver",
    name: "Snow-Tombed Starsilver",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 34.5, baseValue: 7.5 },
    passiveName: "Frost Burial",
    passiveDesc: "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of forming and dropping an Everfrost Icicle above them, dealing 80~140% AoE ATK DMG. Opponents affected by Cryo are dealt 200~360% ATK DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "talking-stick",
    varName: "talkingStick",
    name: "Talking Stick",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 18.4, baseValue: 4.0 },
    passiveName: "'The Waxing Dawn'",
    passiveDesc: "ATK will be increased by 16~32% for 15s after being affected by Pyro. All Elemental DMG Bonus will be increased by 12~24% for 15s after being affected by Hydro, Cryo, Electro, or Dendro.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "talking-pyro-affected", label: "Affected by Pyro (+16~32% ATK)", control: "toggle", defaultValue: 1, hint: "+16~32% ATK" },
      { id: "talking-elem-affected", label: "Affected by Hydro/Cryo/Electro/Dendro", control: "toggle", defaultValue: 1, hint: "+12~24% All Elemental DMG Bonus" },
    ],
    buffs: [
      { id: "talking-atk", label: "ATK% (Talking Stick Pyro)", stat: "atk", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, conditionKey: "talking-pyro-affected", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['talking-pyro-affected'] ?? '1') === '1' || Number(ctx.inputs?.['talking-pyro-affected'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }" },
      { id: "talking-elem-dmg", label: "All Elemental DMG Bonus (Talking Stick)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, conditionKey: "talking-elem-affected", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['talking-elem-affected'] ?? '1') === '1' || Number(ctx.inputs?.['talking-elem-affected'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }" },
    ],
  },
  {
    id: "the-bell",
    varName: "theBell",
    name: "The Bell",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Rebellious Guardian",
    passiveDesc: "Taking DMG generates a shield which absorbs DMG up to 20~32% of Max HP. While protected by a shield, the character gains 12~24% increased DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "bell-shielded", label: "Protected by Shield (+12~24% DMG)", control: "toggle", defaultValue: 1, hint: "+12~24% All DMG Bonus while shielded" },
    ],
    buffs: [
      { id: "bell-dmg", label: "All DMG Bonus (The Bell)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, conditionKey: "bell-shielded", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['bell-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['bell-shielded'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }" },
    ],
  },
  {
    id: "tidal-shadow",
    varName: "tidalShadow",
    name: "Tidal Shadow",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "White Wave Fold",
    passiveDesc: "After the wielder is healed, ATK is increased by 24~48% for 8s. This can be triggered even if the character is not on the field.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "tidal-healed", label: "Character Received Healing", control: "toggle", defaultValue: 1, hint: "+24~48% ATK for 8s" },
    ],
    buffs: [
      { id: "tidal-atk", label: "ATK% (Tidal Shadow)", stat: "atk", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, isPercent: true, conditionKey: "tidal-healed", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['tidal-healed'] ?? '1') === '1' || Number(ctx.inputs?.['tidal-healed'] ?? 1) > 0; return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0; }" },
    ],
  },
  {
    id: "ultimate-overlords-mega-magic-sword",
    varName: "ultimateOverlordsMegaMagicSword",
    name: "Ultimate Overlord's Mega Magic Sword",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Melusine's Blessing",
    passiveDesc: "ATK is increased by 12~24%. That's not all! The support from all the Melusines you've helped in Merusea Village fills you with strength: based on the number of them you've helped, your ATK is increased by up to an additional 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "mega-magic-melusine-max", label: "Max Melusines Helped (100% Extra ATK)", control: "toggle", defaultValue: 1, hint: "Grants maximum extra ATK (+24~48% total ATK)" },
    ],
    buffs: [
      { id: "mega-magic-atk", label: "ATK% (Ultimate Overlord's Mega Magic Sword)", stat: "atk", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => { const full = (ctx.inputs?.['mega-magic-melusine-max'] ?? '1') === '1' || Number(ctx.inputs?.['mega-magic-melusine-max'] ?? 1) > 0; const pct = [12, 15, 18, 21, 24][r - 1] * (full ? 2 : 1); return (pct / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "whiteblind",
    varName: "whiteblind",
    name: "Whiteblind",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "defPct", label: "DEF%", value: 51.7, baseValue: 11.3 },
    passiveName: "Infusion Blade",
    passiveDesc: "On hit, Normal or Charged Attacks increase ATK and DEF by 6~12% for 6s. Max 4 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "whiteblind-stacks", label: "Infusion Blade Stacks (0-4)", control: "stacks", max: 4, defaultValue: 4, hint: "+6~12% ATK & DEF per stack" },
    ],
    buffs: [
      { id: "whiteblind-atk", label: "ATK% (Whiteblind)", stat: "atk", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, isPercent: true, conditionKey: "whiteblind-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['whiteblind-stacks'] ?? 4); return ((s * [6, 7.5, 9, 10.5, 12][r - 1]) / 100) * ctx.baseAtk; }" },
      { id: "whiteblind-def", label: "DEF% (Whiteblind)", stat: "def", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, isPercent: true, conditionKey: "whiteblind-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['whiteblind-stacks'] ?? 4); return s * [6, 7.5, 9, 10.5, 12][r - 1]; }" },
    ],
  },

  // 3-STAR, 2-STAR, 1-STAR CLAYMORES
  {
    id: "bloodtainted-greatsword",
    varName: "bloodtaintedGreatsword",
    name: "Bloodtainted Greatsword",
    type: "Claymore",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "em", label: "Elemental Mastery", value: 187, baseValue: 41 },
    passiveName: "Bane of Fire and Thunder",
    passiveDesc: "Increases DMG against opponents affected by Pyro or Electro by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "bloodtainted-target", label: "Target Affected by Pyro/Electro", control: "toggle", defaultValue: 1, hint: "+12~24% All DMG bonus" },
    ],
    buffs: [
      { id: "bloodtainted-dmg", label: "All DMG Bonus (Bloodtainted Greatsword)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, conditionKey: "bloodtainted-target", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['bloodtainted-target'] ?? '1') === '1' || Number(ctx.inputs?.['bloodtainted-target'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }" },
    ],
  },
  {
    id: "debate-club",
    varName: "debateClub",
    name: "Debate Club",
    type: "Claymore",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "atkPct", label: "ATK%", value: 35.2, baseValue: 7.7 },
    passiveName: "Blunt Conclusion",
    passiveDesc: "After using an Elemental Skill, Normal or Charged Attacks deal an additional 60~120% ATK DMG in a small area on hit. Effect lasts 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "ferrous-shadow",
    varName: "ferrousShadow",
    name: "Ferrous Shadow",
    type: "Claymore",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "hpPct", label: "HP%", value: 35.2, baseValue: 7.7 },
    passiveName: "Unbending",
    passiveDesc: "When HP falls below 70~90%, increases Charged Attack DMG by 30~50%, and Charged Attacks become harder to interrupt.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "ferrous-low-hp", label: "HP Below 70~90%", control: "toggle", defaultValue: 1, hint: "+30~50% Charged Attack DMG" },
    ],
    buffs: [
      { id: "ferrous-ca-dmg", label: "Charged Attack DMG Bonus (Ferrous Shadow)", stat: "chargedDmgBonus", refinementValues: [30, 35, 40, 45, 50], isTeamBuff: false, conditionKey: "ferrous-low-hp", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['ferrous-low-hp'] ?? '1') === '1' || Number(ctx.inputs?.['ferrous-low-hp'] ?? 1) > 0; return on ? [30, 35, 40, 45, 50][r - 1] : 0; }" },
    ],
  },
  {
    id: "skyrider-greatsword",
    varName: "skyriderGreatsword",
    name: "Skyrider Greatsword",
    type: "Claymore",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 43.9, baseValue: 9.6 },
    passiveName: "Courage",
    passiveDesc: "On hit, Normal or Charged Attacks increase ATK by 6~10% for 6s. Max 4 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "skyrider-stacks", label: "Courage Stacks (0-4)", control: "stacks", max: 4, defaultValue: 4, hint: "+6~10% ATK per hit stack" },
    ],
    buffs: [
      { id: "skyrider-claymore-atk", label: "ATK% (Skyrider Greatsword)", stat: "atk", refinementValues: [24, 28, 32, 36, 40], isTeamBuff: false, isPercent: true, conditionKey: "skyrider-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['skyrider-stacks'] ?? 4); return ((s * [6, 7, 8, 9, 10][r - 1]) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "white-iron-greatsword",
    varName: "whiteIronGreatsword",
    name: "White Iron Greatsword",
    type: "Claymore",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "defPct", label: "DEF%", value: 43.9, baseValue: 9.6 },
    passiveName: "Cull the Weak",
    passiveDesc: "Defeating an opponent restores 8~16% HP.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "old-mercs-pal",
    varName: "oldMercsPal",
    name: "Old Merc's Pal",
    type: "Claymore",
    rarity: 2,
    baseAtk: 243,
    lvl1BaseAtk: 33,
    passiveName: "",
    passiveDesc: "A battle-tested greatsword that has seen better days.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "waster-greatsword",
    varName: "wasterGreatsword",
    name: "Waster Greatsword",
    type: "Claymore",
    rarity: 1,
    baseAtk: 185,
    lvl1BaseAtk: 23,
    passiveName: "",
    passiveDesc: "A sturdy, heavy piece of iron with an edge on one side.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
];

function generateClaymoreFiles() {
  const outDir = path.resolve("src/data/registry/weapons/claymores");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const exportNames: string[] = [
    "songOfBrokenPines",
    "wolfsGravestone",
    "forestRegalia",
  ];

  for (const w of CLAYMORES_DATA) {
    exportNames.push(w.varName);
    const filePath = path.join(outDir, `${w.id}.ts`);

    const buffCode = w.buffs
      .map(
        (b) => `    {
      id: "${b.id}",
      label: "${b.label}",
      ${b.description ? `description: "${b.description}",\n      ` : ""}stat: "${b.stat}",
      refinementValues: [${b.refinementValues.join(", ")}],
      isTeamBuff: ${b.isTeamBuff},
      ${b.isPercent ? "isPercent: true,\n      " : ""}${b.conditionKey ? `conditionKey: "${b.conditionKey}",\n      ` : ""}${b.computeCode ? `compute: ${b.computeCode},` : ""}
    }`
      )
      .join(",\n");

    const mechanicCode = w.mechanicDefs?.length
      ? `  mechanicDefs: [\n` +
        w.mechanicDefs
          .map(
            (m) => `    {
      id: "${m.id}",
      label: "${m.label}",
      control: "${m.control}",
      ${m.defaultValue !== undefined ? `defaultValue: ${typeof m.defaultValue === "string" ? `"${m.defaultValue}"` : m.defaultValue},\n      ` : ""}${m.max !== undefined ? `max: ${m.max},\n      ` : ""}${m.min !== undefined ? `min: ${m.min},\n      ` : ""}${m.hint ? `hint: "${m.hint}",\n    ` : ""}}`
          )
          .join(",\n") +
        `\n  ],`
      : "";

    const content = `import type { WeaponConfig } from "../types";

export const ${w.varName}: WeaponConfig = {
  id: "${w.id}",
  name: "${w.name.replace(/"/g, '\\"')}",
  type: "Claymore",
  rarity: ${w.rarity},
  baseAtk: ${w.baseAtk},
  lvl1BaseAtk: ${w.lvl1BaseAtk},
  ${
    w.subStat
      ? `subStat: {
    type: "${w.subStat.type}",
    label: "${w.subStat.label}",
    value: ${w.subStat.value},
    ${w.subStat.baseValue !== undefined ? `baseValue: ${w.subStat.baseValue},` : ""}
  },`
      : ""
  }
  passiveName: "${w.passiveName.replace(/"/g, '\\"')}",
  passiveDesc:
    "${w.passiveDesc.replace(/"/g, '\\"')}",
  isSupport: ${w.isSupport},
  buffType: "${w.buffType}",
${mechanicCode ? mechanicCode + "\n" : ""}  buffs: [
${buffCode}
  ],
  ${w.signatureFor ? `signatureFor: [${w.signatureFor.map((s) => `"${s}"`).join(", ")}],` : ""}
};
`;

    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Generated: ${w.id}.ts`);
  }

  // Update claymores/index.ts
  const allClaymoreImports = [
    'import { songOfBrokenPines } from "./song-of-broken-pines";',
    'import { wolfsGravestone } from "./wolfs-gravestone";',
    'import { forestRegalia } from "./forest-regalia";',
    ...CLAYMORES_DATA.map((w) => `import { ${w.varName} } from "./${w.id}";`),
  ].join("\n");

  const indexContent = `${allClaymoreImports}
import type { WeaponConfig } from "../types";

export {
  ${exportNames.join(",\n  ")},
};

export const CLAYMORES: WeaponConfig[] = [
  ${exportNames.join(",\n  ")},
];
`;

  fs.writeFileSync(path.join(outDir, "index.ts"), indexContent, "utf-8");
  console.log(`Updated claymores/index.ts with ${exportNames.length} claymores!`);
}

generateClaymoreFiles();
