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
  type: "Bow";
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

const BOWS_DATA: WeaponData[] = [
  // 5-STAR BOWS
  {
    id: "amos-bow",
    varName: "amosBow",
    name: "Amos' Bow",
    type: "Bow",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Strong-Willed",
    passiveDesc: "Increases Normal and Charged Attack DMG by 12~24%. Normal and Charged Attack DMG increases by 8~16% for every 0.1s the arrow is in the air up to 5 times.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "amos-arrow-stacks", label: "Arrow Flight Time Stacks (0-5)", control: "stacks", max: 5, defaultValue: 5, hint: "+8~16% NA/CA DMG per 0.1s flight (up to +40~80%)" },
    ],
    buffs: [
      { id: "amos-base-na-ca-dmg", label: "Normal/Charged Attack DMG Bonus (Amos Base)", stat: "normalDmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
      { id: "amos-base-charged-dmg", label: "Charged Attack DMG Bonus (Amos Base)", stat: "chargedDmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
      { id: "amos-flight-na-dmg", label: "Flight Time NA DMG Bonus (Amos' Bow)", stat: "normalDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, conditionKey: "amos-arrow-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['amos-arrow-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; }" },
      { id: "amos-flight-ca-dmg", label: "Flight Time CA DMG Bonus (Amos' Bow)", stat: "chargedDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, conditionKey: "amos-arrow-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['amos-arrow-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; }" },
    ],
    signatureFor: ["ganyu"],
  },
  {
    id: "aqua-simulacra",
    varName: "aquaSimulacra",
    name: "Aqua Simulacra",
    type: "Bow",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "The Cleansing Form",
    passiveDesc: "HP is increased by 16~32%. When there are opponents nearby, the DMG dealt by the wielder is increased by 20~40%. This takes effect whether the character is on-field or off-field.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "aqua-nearby-opponents", label: "Opponents Nearby (Active DMG Buff)", control: "toggle", defaultValue: 1, hint: "+20~40% All DMG bonus" },
    ],
    buffs: [
      { id: "aqua-hp", label: "HP% (Aqua Simulacra)", stat: "hp", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
      { id: "aqua-dmg", label: "All DMG Bonus (Aqua Simulacra Nearby)", stat: "dmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, conditionKey: "aqua-nearby-opponents", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['aqua-nearby-opponents'] ?? '1') === '1' || Number(ctx.inputs?.['aqua-nearby-opponents'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }" },
    ],
    signatureFor: ["yelan"],
  },
  {
    id: "astral-vultures-crimson-plumage",
    varName: "astralVulturesCrimsonPlumage",
    name: "Astral Vulture's Crimson Plumage",
    type: "Bow",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 66.2, baseValue: 14.4 },
    passiveName: "Soaring Eagle's Cry",
    passiveDesc: "Triggering a Swirl reaction grants 1 stack of Unity, increasing Aimed Shot and Plunging Attack DMG by 20~40% for 12s. Max 2 stacks. When in Nightsoul's Blessing, the wielder deals an additional 20~40% DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "astral-unity-stacks", label: "Swirl Unity Stacks (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+20~40% Aimed/Plunging DMG per stack" },
      { id: "astral-nightsoul-active", label: "In Nightsoul's Blessing", control: "toggle", defaultValue: 1, hint: "+20~40% All DMG bonus" },
    ],
    buffs: [
      { id: "astral-ca-dmg", label: "Charged Attack DMG Bonus (Astral Vulture)", stat: "chargedDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, conditionKey: "astral-unity-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['astral-unity-stacks'] ?? 2); return s * [20, 25, 30, 35, 40][r - 1]; }" },
      { id: "astral-nightsoul-dmg", label: "All DMG Bonus (Astral Nightsoul)", stat: "dmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, conditionKey: "astral-nightsoul-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['astral-nightsoul-active'] ?? '1') === '1' || Number(ctx.inputs?.['astral-nightsoul-active'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }" },
    ],
    signatureFor: ["chasca"],
  },
  {
    id: "polar-star",
    varName: "polarStar",
    name: "Polar Star",
    type: "Bow",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Daylight's Augur",
    passiveDesc: "Elemental Skill and Elemental Burst DMG increased by 12~24%. Normal Attack, Charged Attack, Elemental Skill, and Elemental Burst each grant 1 stack of Ashen Nightstar on hit for 12s. At 1/2/3/4 stacks, ATK is increased by 10/20/30/48% ~ 20/40/60/96%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "polar-star-stacks", label: "Ashen Nightstar Stacks (0-4)", control: "stacks", max: 4, defaultValue: 4, hint: "Tiered ATK% bonus (10/20/30/48% at R1, up to 20/40/60/96% at R5)" },
    ],
    buffs: [
      { id: "polar-skill-dmg", label: "Elemental Skill DMG Bonus (Polar Star)", stat: "skillDmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
      { id: "polar-burst-dmg", label: "Elemental Burst DMG Bonus (Polar Star)", stat: "burstDmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
      { id: "polar-atk", label: "ATK% (Polar Star Nightstar Stacks)", stat: "atk", refinementValues: [48, 60, 72, 84, 96], isTeamBuff: false, isPercent: true, conditionKey: "polar-star-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['polar-star-stacks'] ?? 4); const tiers: Record<number, [number, number, number, number, number]> = { 0: [0, 0, 0, 0, 0], 1: [10, 12.5, 15, 17.5, 20], 2: [20, 25, 30, 35, 40], 3: [30, 37.5, 45, 52.5, 60], 4: [48, 60, 72, 84, 96] }; const pct = (tiers[s] ?? tiers[4])[r - 1]; return (pct / 100) * ctx.baseAtk; }" },
    ],
    signatureFor: ["tartaglia"],
  },
  {
    id: "silvershower-heartstrings",
    varName: "silvershowerHeartstrings",
    name: "Silvershower Heartstrings",
    type: "Bow",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "hpPct", label: "HP%", value: 66.2, baseValue: 14.4 },
    passiveName: "Dry-Well Receding",
    passiveDesc: "The equipping character can gain the Remedy effect: Providing healing, using an Elemental Skill, or when protected by a Bond of Life increases Max HP by 12/24/40% ~ 24/48/80% at 1/2/3 stacks for 25s. At 3 stacks, Elemental Burst CRIT Rate is increased by 28~56%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "silvershower-stacks", label: "Remedy Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+12/24/40% Max HP; +28~56% Burst CRIT Rate at 3 stacks" },
    ],
    buffs: [
      { id: "silvershower-hp", label: "Max HP% (Silvershower Heartstrings)", stat: "hp", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, isPercent: true, conditionKey: "silvershower-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['silvershower-stacks'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 0: [0, 0, 0, 0, 0], 1: [12, 15, 18, 21, 24], 2: [24, 30, 36, 42, 48], 3: [40, 50, 60, 70, 80] }; return (tiers[s] ?? tiers[3])[r - 1]; }" },
      { id: "silvershower-burst-crit", label: "Elemental Burst CRIT Rate% (Silvershower)", stat: "critRate", refinementValues: [28, 35, 42, 49, 56], isTeamBuff: false, conditionKey: "silvershower-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['silvershower-stacks'] ?? 3); return s >= 3 ? [28, 35, 42, 49, 56][r - 1] : 0; }" },
    ],
    signatureFor: ["sigewinne"],
  },
  {
    id: "skyward-harp",
    varName: "skywardHarp",
    name: "Skyward Harp",
    type: "Bow",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 22.1, baseValue: 4.8 },
    passiveName: "Echoing Ballad",
    passiveDesc: "Increases CRIT DMG by 20~40%. Hits have a 60~100% chance to inflict a small AoE attack dealing 125% Physical ATK DMG every 4~2s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "skyward-harp-crit-dmg", label: "CRIT DMG% (Skyward Harp)", stat: "critDmg", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]" },
    ],
  },
  {
    id: "the-first-great-magic",
    varName: "theFirstGreatMagic",
    name: "The First Great Magic",
    type: "Bow",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 66.2, baseValue: 14.4 },
    passiveName: "Parsifal the Great",
    passiveDesc: "Charged Attack DMG increased by 16~32%. For every party member with the same Elemental Type as the wielder (including wielder), gain 1 Gimmick stack: ATK increased by 16/32/48% ~ 32/64/96%. For every member with a different type, gain 1 Theatrics stack: Movement SPD increased by 4/7/10% ~ 12/15/18%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "great-magic-same-stacks", label: "Same-Element Party Members (1-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+16/32/48% ATK for 1/2/3 matching element members" },
    ],
    buffs: [
      { id: "great-magic-ca-dmg", label: "Charged Attack DMG Bonus (The First Great Magic)", stat: "chargedDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
      { id: "great-magic-atk", label: "ATK% (The First Great Magic Stacks)", stat: "atk", refinementValues: [48, 60, 72, 84, 96], isTeamBuff: false, isPercent: true, conditionKey: "great-magic-same-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['great-magic-same-stacks'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 1: [16, 20, 24, 28, 32], 2: [32, 40, 48, 56, 64], 3: [48, 60, 72, 84, 96] }; const pct = (tiers[s] ?? tiers[3])[r - 1]; return (pct / 100) * ctx.baseAtk; }" },
    ],
    signatureFor: ["lyney"],
  },
  {
    id: "the-hunters-path",
    varName: "theHuntersPath",
    name: "Hunter's Path",
    type: "Bow",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 44.1, baseValue: 9.6 },
    passiveName: "At the End of the Beast-Paths",
    passiveDesc: "Gain 12~24% All Elemental DMG Bonus. Obtain the Tireless Hunt effect after hitting an opponent with a Charged Attack: Charged Attack DMG is increased by 160~320% of Elemental Mastery for 12 hits or 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "hunters-path-em", label: "Character EM", control: "stacks", max: 2000, defaultValue: 400, hint: "EM used for flat Charged Attack DMG bonus" },
      { id: "hunters-path-active", label: "Tireless Hunt Active", control: "toggle", defaultValue: 1, hint: "+160~320% of EM as flat CA DMG bonus" },
    ],
    buffs: [
      { id: "hunters-path-elem-dmg", label: "All Elemental DMG Bonus (Hunter's Path)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
      { id: "hunters-path-flat-ca", label: "Flat CA DMG from EM (Hunter's Path)", stat: "flatDmgBonus", refinementValues: [160, 200, 240, 280, 320], isTeamBuff: false, conditionKey: "hunters-path-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['hunters-path-active'] ?? '1') === '1' || Number(ctx.inputs?.['hunters-path-active'] ?? 1) > 0; if (!on) return 0; const em = Number(ctx.inputs?.['hunters-path-em'] ?? 400); return em * ([1.6, 2.0, 2.4, 2.8, 3.2][r - 1]); }" },
    ],
    signatureFor: ["tighnari"],
  },
  {
    id: "thundering-pulse",
    varName: "thunderingPulse",
    name: "Thundering Pulse",
    type: "Bow",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 66.2, baseValue: 14.4 },
    passiveName: "Rule By Thunder",
    passiveDesc: "Increases ATK by 20~40% and grants Thunder Emblem stacks. At stack levels 1/2/3, Thunder Emblem increases Normal Attack DMG by 12/24/40% ~ 24/48/80%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "thunder-emblem-stacks", label: "Thunder Emblem Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+12/24/40% NA DMG bonus at R1 (up to +24/48/80% at R5)" },
    ],
    buffs: [
      { id: "thundering-atk", label: "ATK% (Thundering Pulse)", stat: "atk", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk" },
      { id: "thundering-na-dmg", label: "Normal Attack DMG Bonus (Thunder Emblem)", stat: "normalDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, conditionKey: "thunder-emblem-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['thunder-emblem-stacks'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 0: [0, 0, 0, 0, 0], 1: [12, 15, 18, 21, 24], 2: [24, 30, 36, 42, 48], 3: [40, 50, 60, 70, 80] }; return (tiers[s] ?? tiers[3])[r - 1]; }" },
    ],
    signatureFor: ["yoimiya"],
  },

  // 4-STAR BOWS
  {
    id: "alley-hunter",
    varName: "alleyHunter",
    name: "Alley Hunter",
    type: "Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Oppidan Ambush",
    passiveDesc: "While the character equipped with this weapon is in the party but not on the field, their DMG increases by 2~4% every second up to a max of 20~40%. When on the field for more than 4s, the DMG buff decreases by 4~8% per second.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "alley-hunter-stacks", label: "Off-Field DMG Stacks (0-10)", control: "stacks", max: 10, defaultValue: 10, hint: "+2~4% DMG per second (up to +20~40%)" },
    ],
    buffs: [
      { id: "alley-hunter-dmg", label: "All DMG Bonus (Alley Hunter)", stat: "dmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, conditionKey: "alley-hunter-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['alley-hunter-stacks'] ?? 10); return s * [2, 2.5, 3, 3.5, 4][r - 1]; }" },
    ],
  },
  {
    id: "blackcliff-warbow",
    varName: "blackcliffWarbow",
    name: "Blackcliff Warbow",
    type: "Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 36.8, baseValue: 8.0 },
    passiveName: "Press the Advantage",
    passiveDesc: "After defeating an opponent, ATK is increased by 12~24% for 30s. Max 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "blackcliff-warbow-stacks", label: "Defeat Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+12~24% ATK per defeat" },
    ],
    buffs: [
      { id: "blackcliff-warbow-atk", label: "ATK% (Blackcliff Warbow)", stat: "atk", refinementValues: [36, 45, 54, 63, 72], isTeamBuff: false, isPercent: true, conditionKey: "blackcliff-warbow-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['blackcliff-warbow-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "chain-breaker",
    varName: "chainBreaker",
    name: "Chain Breaker",
    type: "Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Flowers on the Iron Anchor",
    passiveDesc: "For every party member from Natlan or who has a different Elemental Type from the wielder, the wielder gains 4.8~9.6% increased ATK. When there are at least 3 such characters, Elemental Mastery is increased by 24~48.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "chain-breaker-members", label: "Eligible Members (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+4.8~9.6% ATK per member; +24~48 EM at 3 members" },
    ],
    buffs: [
      { id: "chain-breaker-atk", label: "ATK% (Chain Breaker)", stat: "atk", refinementValues: [14.4, 18.0, 21.6, 25.2, 28.8], isTeamBuff: false, isPercent: true, conditionKey: "chain-breaker-members", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['chain-breaker-members'] ?? 3); return ((s * [4.8, 6.0, 7.2, 8.4, 9.6][r - 1]) / 100) * ctx.baseAtk; }" },
      { id: "chain-breaker-em", label: "Elemental Mastery (Chain Breaker 3 Members)", stat: "em", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "chain-breaker-members", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['chain-breaker-members'] ?? 3); return s >= 3 ? [24, 30, 36, 42, 48][r - 1] : 0; }" },
    ],
  },
  {
    id: "cloudforged",
    varName: "cloudforged",
    name: "Cloudforged",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Crag-Wreathed Needle",
    passiveDesc: "After Elemental Energy is decreased, the equipping character's Elemental Mastery is increased by 40~80 for 18s. Max 2 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "cloudforged-stacks", label: "Energy Decreased Stacks (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+40~80 EM per stack (up to +80~160 EM)" },
    ],
    buffs: [
      { id: "cloudforged-em", label: "Elemental Mastery (Cloudforged)", stat: "em", refinementValues: [80, 100, 120, 140, 160], isTeamBuff: false, conditionKey: "cloudforged-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['cloudforged-stacks'] ?? 2); return s * [40, 50, 60, 70, 80][r - 1]; }" },
    ],
  },
  {
    id: "compound-bow",
    varName: "compoundBow",
    name: "Compound Bow",
    type: "Bow",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 69.0, baseValue: 15.0 },
    passiveName: "Infusion Arrow",
    passiveDesc: "Normal Attack and Charged Attack hits increase ATK by 4~8% and Normal ATK SPD by 1.2~2.4% for 6s. Max 4 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "compound-stacks", label: "Infusion Arrow Stacks (0-4)", control: "stacks", max: 4, defaultValue: 4, hint: "+4~8% ATK per hit stack" },
    ],
    buffs: [
      { id: "compound-atk", label: "ATK% (Compound Bow)", stat: "atk", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, conditionKey: "compound-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['compound-stacks'] ?? 4); return ((s * [4, 5, 6, 7, 8][r - 1]) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "fading-twilight",
    varName: "fadingTwilight",
    name: "Fading Twilight",
    type: "Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Radiance Infusion",
    passiveDesc: "Has 3 states: Evengleam, Afterglow, and Dawnblaze, which increase DMG dealt by 6/10/14% ~ 12/20/28% respectively. State changes upon hitting opponents every 7s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "twilight-state", label: "Twilight State (1=Evengleam, 2=Afterglow, 3=Dawnblaze)", control: "stacks", min: 1, max: 3, defaultValue: 3, hint: "Tiered All DMG Bonus (+6/10/14% at R1, up to +12/20/28% at R5)" },
    ],
    buffs: [
      { id: "twilight-dmg", label: "All DMG Bonus (Fading Twilight)", stat: "dmgBonus", refinementValues: [14, 17.5, 21, 24.5, 28], isTeamBuff: false, conditionKey: "twilight-state", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['twilight-state'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 1: [6, 7.5, 9, 10.5, 12], 2: [10, 12.5, 15, 17.5, 20], 3: [14, 17.5, 21, 24.5, 28] }; return (tiers[s] ?? tiers[3])[r - 1]; }" },
    ],
  },
  {
    id: "hamayumi",
    varName: "hamayumi",
    name: "Hamayumi",
    type: "Bow",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Full Draw",
    passiveDesc: "Increases Normal Attack DMG by 16~32% and Charged Attack DMG by 12~24%. When the character's Energy reaches 100%, this effect is increased by 100%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "hamayumi-100-energy", label: "100% Energy Full (2x DMG Buff)", control: "toggle", defaultValue: 1, hint: "Doubles Normal and Charged DMG bonuses" },
    ],
    buffs: [
      { id: "hamayumi-na-dmg", label: "Normal Attack DMG Bonus (Hamayumi)", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r, ctx) => { const full = (ctx.inputs?.['hamayumi-100-energy'] ?? '1') === '1' || Number(ctx.inputs?.['hamayumi-100-energy'] ?? 1) > 0; return [16, 20, 24, 28, 32][r - 1] * (full ? 2 : 1); }" },
      { id: "hamayumi-ca-dmg", label: "Charged Attack DMG Bonus (Hamayumi)", stat: "chargedDmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r, ctx) => { const full = (ctx.inputs?.['hamayumi-100-energy'] ?? '1') === '1' || Number(ctx.inputs?.['hamayumi-100-energy'] ?? 1) > 0; return [12, 15, 18, 21, 24][r - 1] * (full ? 2 : 1); }" },
    ],
  },
  {
    id: "ibis-piercer",
    varName: "ibisPiercer",
    name: "Ibis Piercer",
    type: "Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Secret Wisdom's Favor",
    passiveDesc: "The character's Elemental Mastery will be increased by 40~80 within 6s after Charged Attacks hit opponents. Max 2 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "ibis-stacks", label: "Charged Hit Stacks (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+40~80 EM per stack (up to +80~160 EM)" },
    ],
    buffs: [
      { id: "ibis-em", label: "Elemental Mastery (Ibis Piercer)", stat: "em", refinementValues: [80, 100, 120, 140, 160], isTeamBuff: false, conditionKey: "ibis-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['ibis-stacks'] ?? 2); return s * [40, 50, 60, 70, 80][r - 1]; }" },
    ],
  },
  {
    id: "kings-squire",
    varName: "kingsSquire",
    name: "King's Squire",
    type: "Bow",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Labyrinth's Teachings",
    passiveDesc: "Obtain the Teachings of the Forest effect when unleashing Elemental Skills and Bursts, increasing Elemental Mastery by 60~140 for 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "kings-squire-active", label: "Teachings of the Forest Active", control: "toggle", defaultValue: 1, hint: "+60~140 Elemental Mastery" },
    ],
    buffs: [
      { id: "kings-squire-em", label: "Elemental Mastery (King's Squire)", stat: "em", refinementValues: [60, 80, 100, 120, 140], isTeamBuff: false, conditionKey: "kings-squire-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['kings-squire-active'] ?? '1') === '1' || Number(ctx.inputs?.['kings-squire-active'] ?? 1) > 0; return on ? [60, 80, 100, 120, 140][r - 1] : 0; }" },
    ],
  },
  {
    id: "mitternachts-waltz",
    varName: "mitternachtsWaltz",
    name: "Mitternachts Waltz",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 51.7, baseValue: 11.3 },
    passiveName: "Evernight Duet",
    passiveDesc: "Normal Attack hits increase Elemental Skill DMG by 20~40% for 5s. Elemental Skill hits increase Normal Attack DMG by 20~40% for 5s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "waltz-na-hit", label: "Normal Attack Hit (+20~40% Skill DMG)", control: "toggle", defaultValue: 1, hint: "+20~40% Skill DMG" },
      { id: "waltz-skill-hit", label: "Elemental Skill Hit (+20~40% NA DMG)", control: "toggle", defaultValue: 1, hint: "+20~40% Normal Attack DMG" },
    ],
    buffs: [
      { id: "waltz-skill-dmg", label: "Elemental Skill DMG Bonus (Mitternachts Waltz)", stat: "skillDmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, conditionKey: "waltz-na-hit", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['waltz-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['waltz-na-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }" },
      { id: "waltz-na-dmg", label: "Normal Attack DMG Bonus (Mitternachts Waltz)", stat: "normalDmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, conditionKey: "waltz-skill-hit", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['waltz-skill-hit'] ?? '1') === '1' || Number(ctx.inputs?.['waltz-skill-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }" },
    ],
    signatureFor: ["fischl"],
  },
  {
    id: "mouuns-moon",
    varName: "mouunsMoon",
    name: "Mouun's Moon",
    type: "Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Watatsumi Wavewalker",
    passiveDesc: "For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12~0.24%. A maximum of 40~80% increased Elemental Burst DMG can be achieved this way.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "mouun-party-energy", label: "Combined Party Energy Capacity (e.g. 240-330)", control: "stacks", max: 400, defaultValue: 280, hint: "Total Energy of party" },
    ],
    buffs: [
      { id: "mouun-burst-dmg", label: "Elemental Burst DMG Bonus (Mouun's Moon)", stat: "burstDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, computeCode: "(r, ctx) => { const energy = Number(ctx.inputs?.['mouun-party-energy'] ?? 280); const ratio = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; const cap = [40, 50, 60, 70, 80][r - 1]; return Math.min(energy * ratio * 100, cap); }" },
    ],
  },
  {
    id: "prototype-crescent",
    varName: "prototypeCrescent",
    name: "Prototype Crescent",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Unreturning",
    passiveDesc: "Charged Attack hits on weak points increase Movement SPD by 10% and ATK by 36~72% for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "crescent-weakpoint-hit", label: "Weak Point Hit Triggered", control: "toggle", defaultValue: 1, hint: "+36~72% ATK for 10s" },
    ],
    buffs: [
      { id: "crescent-atk", label: "ATK% (Prototype Crescent)", stat: "atk", refinementValues: [36, 45, 54, 63, 72], isTeamBuff: false, isPercent: true, conditionKey: "crescent-weakpoint-hit", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['crescent-weakpoint-hit'] ?? '1') === '1' || Number(ctx.inputs?.['crescent-weakpoint-hit'] ?? 1) > 0; return on ? ([36, 45, 54, 63, 72][r - 1] / 100) * ctx.baseAtk : 0; }" },
    ],
  },
  {
    id: "range-gauge",
    varName: "rangeGauge",
    name: "Range Gauge",
    type: "Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Masons' Ditty",
    passiveDesc: "When the wielder is healed or heals all party members, gain a Unity's Symbol for 30s. Max 3 symbols. Using an Elemental Skill or Burst consumes all symbols and increases ATK by 3~6% and All Elemental DMG Bonus by 7~13% per symbol for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "gauge-symbols", label: "Unity Symbols Consumed (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+3~6% ATK & +7~13% Elem DMG per symbol" },
    ],
    buffs: [
      { id: "gauge-atk", label: "ATK% (Range Gauge)", stat: "atk", refinementValues: [9, 12, 15, 18, 21], isTeamBuff: false, isPercent: true, conditionKey: "gauge-symbols", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['gauge-symbols'] ?? 3); return ((s * [3, 4, 5, 6, 7][r - 1]) / 100) * ctx.baseAtk; }" },
      { id: "gauge-elem-dmg", label: "All Elemental DMG Bonus (Range Gauge)", stat: "dmgBonus", refinementValues: [21, 25.5, 30, 34.5, 39], isTeamBuff: false, conditionKey: "gauge-symbols", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['gauge-symbols'] ?? 3); return s * [7, 8.5, 10, 11.5, 13][r - 1]; }" },
    ],
  },
  {
    id: "royal-bow",
    varName: "royalBow",
    name: "Royal Bow",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Focus",
    passiveDesc: "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks. A CRIT hit removes all stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "royal-bow-stacks", label: "Focus Stacks (0-5)", control: "stacks", max: 5, defaultValue: 3, hint: "+8~16% CRIT Rate per stack" },
    ],
    buffs: [
      { id: "royal-bow-crit", label: "CRIT Rate% (Royal Bow)", stat: "critRate", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "royal-bow-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['royal-bow-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; }" },
    ],
  },
  {
    id: "rust",
    varName: "rust",
    name: "Rust",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Rapid Firing",
    passiveDesc: "Increases Normal Attack DMG by 40~80% but decreases Charged Attack DMG by 10%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "rust-na-dmg", label: "Normal Attack DMG Bonus (Rust)", stat: "normalDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, computeCode: "(r) => [40, 50, 60, 70, 80][r - 1]" },
      { id: "rust-ca-dmg", label: "Charged Attack DMG Penalty (Rust)", stat: "chargedDmgBonus", refinementValues: [-10, -10, -10, -10, -10], isTeamBuff: false, computeCode: "() => -10" },
    ],
  },
  {
    id: "sacrificial-bow",
    varName: "sacrificialBow",
    name: "Sacrificial Bow",
    type: "Bow",
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
    id: "scion-of-the-blazing-sun",
    varName: "scionOfTheBlazingSun",
    name: "Scion of the Blazing Sun",
    type: "Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 18.4, baseValue: 4.0 },
    passiveName: "The Way of Sunfire",
    passiveDesc: "After a Charged Attack hits an opponent, a Sunfire Arrow will descend dealing 60~120% ATK as DMG and inflicting Heartsear: Charged Attack DMG from the equipping character against this opponent is increased by 28~56% for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "scion-heartsear-active", label: "Target Afflicted with Heartsear", control: "toggle", defaultValue: 1, hint: "+28~56% Charged Attack DMG" },
    ],
    buffs: [
      { id: "scion-ca-dmg", label: "Charged Attack DMG Bonus (Scion of the Blazing Sun)", stat: "chargedDmgBonus", refinementValues: [28, 35, 42, 49, 56], isTeamBuff: false, conditionKey: "scion-heartsear-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['scion-heartsear-active'] ?? '1') === '1' || Number(ctx.inputs?.['scion-heartsear-active'] ?? 1) > 0; return on ? [28, 35, 42, 49, 56][r - 1] : 0; }" },
    ],
  },
  {
    id: "song-of-stillness",
    varName: "songOfStillness",
    name: "Song of Stillness",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Benthic Pulse",
    passiveDesc: "After the wielder is healed, they will deal 16~32% more DMG for 8s. This can be triggered even if the character is not on the field.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "stillness-healed", label: "Character Received Healing", control: "toggle", defaultValue: 1, hint: "+16~32% All DMG bonus for 8s" },
    ],
    buffs: [
      { id: "stillness-dmg", label: "All DMG Bonus (Song of Stillness)", stat: "dmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, conditionKey: "stillness-healed", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['stillness-healed'] ?? '1') === '1' || Number(ctx.inputs?.['stillness-healed'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }" },
    ],
  },
  {
    id: "the-stringless",
    varName: "theStringless",
    name: "The Stringless",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Songless Ballad",
    passiveDesc: "Increases Elemental Skill and Elemental Burst DMG by 24~48%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "stringless-skill-dmg", label: "Elemental Skill DMG Bonus (The Stringless)", stat: "skillDmgBonus", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, computeCode: "(r) => [24, 30, 36, 42, 48][r - 1]" },
      { id: "stringless-burst-dmg", label: "Elemental Burst DMG Bonus (The Stringless)", stat: "burstDmgBonus", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, computeCode: "(r) => [24, 30, 36, 42, 48][r - 1]" },
    ],
  },
  {
    id: "the-viridescent-hunt",
    varName: "theViridescentHunt",
    name: "The Viridescent Hunt",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Verdant Wind",
    passiveDesc: "Upon hit, Normal and Aimed Shot Attacks have a 50% chance to generate a Cyclone that attracts enemies and deals 40~80% ATK as DMG every 0.5s for 4s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "windblume-ode",
    varName: "windblumeOde",
    name: "Windblume Ode",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Windblume Wish",
    passiveDesc: "After using an Elemental Skill, receive a boon from the ancient wish of the Windblume, increasing ATK by 16~32% for 6s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "windblume-skill-active", label: "Post-Skill ATK Buff Active", control: "toggle", defaultValue: 1, hint: "+16~32% ATK for 6s" },
    ],
    buffs: [
      { id: "windblume-atk", label: "ATK% (Windblume Ode)", stat: "atk", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, conditionKey: "windblume-skill-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['windblume-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['windblume-skill-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }" },
    ],
  },

  // 3-STAR, 2-STAR, 1-STAR BOWS
  {
    id: "messenger",
    varName: "messenger",
    name: "Messenger",
    type: "Bow",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 31.2, baseValue: 6.8 },
    passiveName: "Flying Message",
    passiveDesc: "Aimed Shot hits on weak points deal an additional 100~200% ATK DMG as CRIT DMG. Can only occur once every 10s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "raven-bow",
    varName: "ravenBow",
    name: "Raven Bow",
    type: "Bow",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "em", label: "Elemental Mastery", value: 94, baseValue: 20 },
    passiveName: "Bane of Flame and Water",
    passiveDesc: "Increases DMG against opponents affected by Hydro or Pyro by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "raven-bow-target", label: "Target Affected by Hydro/Pyro", control: "toggle", defaultValue: 1, hint: "+12~24% All DMG bonus" },
    ],
    buffs: [
      { id: "raven-bow-dmg", label: "All DMG Bonus (Raven Bow)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, conditionKey: "raven-bow-target", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['raven-bow-target'] ?? '1') === '1' || Number(ctx.inputs?.['raven-bow-target'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }" },
    ],
  },
  {
    id: "recurve-bow",
    varName: "recurveBow",
    name: "Recurve Bow",
    type: "Bow",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "hpPct", label: "HP%", value: 46.9, baseValue: 10.2 },
    passiveName: "Cull the Weak",
    passiveDesc: "Defeating an opponent restores 8~16% HP.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "sharpshooters-oath",
    varName: "sharpshootersOath",
    name: "Sharpshooter's Oath",
    type: "Bow",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 46.9, baseValue: 10.2 },
    passiveName: "Precise",
    passiveDesc: "Increases DMG against weak points by 24~48%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "sharpshooter-weakpoint", label: "Weak Point Hit Active", control: "toggle", defaultValue: 1, hint: "+24~48% DMG bonus against weak points" },
    ],
    buffs: [
      { id: "sharpshooter-dmg", label: "Weak Point DMG Bonus (Sharpshooter's Oath)", stat: "dmgBonus", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "sharpshooter-weakpoint", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['sharpshooter-weakpoint'] ?? '1') === '1' || Number(ctx.inputs?.['sharpshooter-weakpoint'] ?? 1) > 0; return on ? [24, 30, 36, 42, 48][r - 1] : 0; }" },
    ],
  },
  {
    id: "slingshot",
    varName: "slingshot",
    name: "Slingshot",
    type: "Bow",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 31.2, baseValue: 6.8 },
    passiveName: "Slingshot",
    passiveDesc: "If a Normal or Charged Attack hits a target within 0.3s of being fired, increases DMG by 36~60%. Otherwise, decreases DMG by 10%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "slingshot-close-range", label: "Hit Target within 0.3s (+36~60% DMG)", control: "toggle", defaultValue: 1, hint: "Increases Normal and Charged DMG by 36~60%" },
    ],
    buffs: [
      { id: "slingshot-na-dmg", label: "Normal Attack DMG Bonus (Slingshot)", stat: "normalDmgBonus", refinementValues: [36, 42, 48, 54, 60], isTeamBuff: false, computeCode: "(r, ctx) => { const on = (ctx.inputs?.['slingshot-close-range'] ?? '1') === '1' || Number(ctx.inputs?.['slingshot-close-range'] ?? 1) > 0; return on ? [36, 42, 48, 54, 60][r - 1] : -10; }" },
      { id: "slingshot-ca-dmg", label: "Charged Attack DMG Bonus (Slingshot)", stat: "chargedDmgBonus", refinementValues: [36, 42, 48, 54, 60], isTeamBuff: false, computeCode: "(r, ctx) => { const on = (ctx.inputs?.['slingshot-close-range'] ?? '1') === '1' || Number(ctx.inputs?.['slingshot-close-range'] ?? 1) > 0; return on ? [36, 42, 48, 54, 60][r - 1] : -10; }" },
    ],
  },
  {
    id: "seasoned-hunters-bow",
    varName: "seasonedHuntersBow",
    name: "Seasoned Hunter's Bow",
    type: "Bow",
    rarity: 2,
    baseAtk: 243,
    lvl1BaseAtk: 33,
    passiveName: "",
    passiveDesc: "A bow that has accompanied its master through countless hunts.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "hunters-bow",
    varName: "huntersBow",
    name: "Hunter's Bow",
    type: "Bow",
    rarity: 1,
    baseAtk: 185,
    lvl1BaseAtk: 23,
    passiveName: "",
    passiveDesc: "A standard hunter's bow that is sturdy and reliable.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
];

function generateBowFiles() {
  const outDir = path.resolve("src/data/registry/weapons/bows");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const exportNames: string[] = [
    "elegyForTheEnd",
    "favoniusWarbow",
  ];

  for (const w of BOWS_DATA) {
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
  type: "Bow",
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

  // Update bows/index.ts
  const allBowImports = [
    'import { elegyForTheEnd } from "./elegy-for-the-end";',
    'import { favoniusWarbow } from "./favonius-warbow";',
    ...BOWS_DATA.map((w) => `import { ${w.varName} } from "./${w.id}";`),
  ].join("\n");

  const indexContent = `${allBowImports}
import type { WeaponConfig } from "../types";

export {
  ${exportNames.join(",\n  ")},
};

export const BOWS: WeaponConfig[] = [
  ${exportNames.join(",\n  ")},
];
`;

  fs.writeFileSync(path.join(outDir, "index.ts"), indexContent, "utf-8");
  console.log(`Updated bows/index.ts with ${exportNames.length} bows!`);
}

generateBowFiles();
