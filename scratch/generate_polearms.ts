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
  type: "Polearm";
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

const POLEARMS_DATA: WeaponData[] = [
  // 5-STAR POLEARMS
  {
    id: "engulfing-lightning",
    varName: "engulfingLightning",
    name: "Engulfing Lightning",
    type: "Polearm",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 55.1, baseValue: 12.0 },
    passiveName: "Timeless Dream: Eternal Stove",
    passiveDesc: "ATK increased by 28~56% of Energy Recharge over the base 100%. You can gain a maximum bonus of 80~120% ATK. Gain 30~50% Energy Recharge for 12s after using an Elemental Burst.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "engulfing-total-er", label: "Character Total ER% (e.g. 250%)", control: "stacks", max: 400, defaultValue: 250, hint: "Total ER% used for Engulfing ATK conversion (over 100%)" },
      { id: "engulfing-burst-active", label: "Post-Burst +30~50% ER Active", control: "toggle", defaultValue: 1, hint: "+30~50% Energy Recharge for 12s" },
    ],
    buffs: [
      { id: "engulfing-atk-from-er", label: "ATK% from ER (Engulfing Lightning)", stat: "atk", refinementValues: [28, 35, 42, 49, 56], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => { const er = Number(ctx.inputs?.['engulfing-total-er'] ?? 250); const postBurst = (ctx.inputs?.['engulfing-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['engulfing-burst-active'] ?? 1) > 0; const totalEr = er + (postBurst ? [30, 35, 40, 45, 50][r - 1] : 0); const excessEr = Math.max(0, totalEr - 100); const ratio = [0.28, 0.35, 0.42, 0.49, 0.56][r - 1]; const cap = [80, 90, 100, 110, 120][r - 1]; const atkPct = Math.min(excessEr * ratio, cap); return (atkPct / 100) * ctx.baseAtk; }" },
      { id: "engulfing-er-buff", label: "Energy Recharge% (Engulfing Lightning)", stat: "energyRecharge", refinementValues: [30, 35, 40, 45, 50], isTeamBuff: false, conditionKey: "engulfing-burst-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['engulfing-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['engulfing-burst-active'] ?? 1) > 0; return on ? [30, 35, 40, 45, 50][r - 1] : 0; }" },
    ],
    signatureFor: ["raiden"],
  },
  {
    id: "lumidouce-elegy",
    varName: "lumidouceElegy",
    name: "Lumidouce Elegy",
    type: "Polearm",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Bright Dawn Overlay",
    passiveDesc: "ATK is increased by 15~30%. After the equipping character triggers Burning on an opponent or deals Dendro DMG to Burning opponents, the DMG dealt is increased by 18~36% for 8s. Max 2 stacks. At 2 stacks or when 2 stacks refresh, restore 12~16 Energy.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "lumidouce-stacks", label: "Burning Stacks (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+18~36% All DMG bonus per stack (up to +36~72%)" },
    ],
    buffs: [
      { id: "lumidouce-atk", label: "ATK% (Lumidouce Elegy)", stat: "atk", refinementValues: [15, 18.75, 22.5, 26.25, 30], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([15, 18.75, 22.5, 26.25, 30][r - 1] / 100) * ctx.baseAtk" },
      { id: "lumidouce-dmg", label: "All DMG Bonus (Lumidouce Elegy Stacks)", stat: "dmgBonus", refinementValues: [36, 45, 54, 63, 72], isTeamBuff: false, conditionKey: "lumidouce-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['lumidouce-stacks'] ?? 2); return s * [18, 22.5, 27, 31.5, 36][r - 1]; }" },
    ],
    signatureFor: ["emilie"],
  },
  {
    id: "skyward-spine",
    varName: "skywardSpine",
    name: "Skyward Spine",
    type: "Polearm",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 36.8, baseValue: 8.0 },
    passiveName: "Black Wing",
    passiveDesc: "Increases CRIT Rate by 8~16% and increases Normal ATK SPD by 12%. Normal and Charged Attacks on hit have a 50% chance to trigger a vacuum blade dealing 40~100% of ATK as DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "skyward-spine-crit", label: "CRIT Rate% (Skyward Spine)", stat: "critRate", refinementValues: [8, 10, 12, 14, 16], isTeamBuff: false, computeCode: "(r) => [8, 10, 12, 14, 16][r - 1]" },
    ],
  },
  {
    id: "staff-of-the-scarlet-sands",
    varName: "staffOfTheScarletSands",
    name: "Staff of the Scarlet Sands",
    type: "Polearm",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 44.1, baseValue: 9.6 },
    passiveName: "Heat Haze at Horizon's End",
    passiveDesc: "The equipping character gains 52~104% of their Elemental Mastery as bonus ATK. When an Elemental Skill hits opponents, gain the Dream of the Scarlet Sands effect: gain 28~56% of their Elemental Mastery as bonus ATK for 10s. Max 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "scarlet-wielder-em", label: "Character EM", control: "stacks", max: 2000, defaultValue: 300, hint: "EM used for Scarlet Sands ATK conversion" },
      { id: "scarlet-dream-stacks", label: "Dream Stacks on Skill Hit (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+28~56% of EM as additional ATK per stack" },
    ],
    buffs: [
      { id: "scarlet-base-em-to-atk", label: "Flat ATK from EM (Scarlet Sands Base)", stat: "atk", refinementValues: [52, 65, 78, 91, 104], isTeamBuff: false, computeCode: "(r, ctx) => { const em = Number(ctx.inputs?.['scarlet-wielder-em'] ?? 300); const ratio = [0.52, 0.65, 0.78, 0.91, 1.04][r - 1]; return em * ratio; }" },
      { id: "scarlet-stacks-em-to-atk", label: "Flat ATK from EM (Scarlet Sands Stacks)", stat: "atk", refinementValues: [84, 105, 126, 147, 168], isTeamBuff: false, conditionKey: "scarlet-dream-stacks", computeCode: "(r, ctx) => { const em = Number(ctx.inputs?.['scarlet-wielder-em'] ?? 300); const s = Number(ctx.inputs?.['scarlet-dream-stacks'] ?? 3); const perStack = [0.28, 0.35, 0.42, 0.49, 0.56][r - 1]; return em * s * perStack; }" },
    ],
    signatureFor: ["cyno"],
  },
  {
    id: "vortex-vanquisher",
    varName: "vortexVanquisher",
    name: "Vortex Vanquisher",
    type: "Polearm",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Golden Majesty",
    passiveDesc: "Increases Shield Strength by 20~40%. Scoring hits on opponents increases ATK by 4~8% for 8s. Max 5 stacks. While protected by a shield, this ATK increase effect is increased by 100%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "vortex-stacks", label: "Golden Majesty Stacks (0-5)", control: "stacks", max: 5, defaultValue: 5, hint: "+4~8% ATK per stack" },
      { id: "vortex-shielded", label: "Protected by Shield (2x ATK Buff)", control: "toggle", defaultValue: 1, hint: "Doubles ATK bonus from stacks" },
    ],
    buffs: [
      { id: "vortex-atk", label: "ATK% (Vortex Vanquisher Stacks)", stat: "atk", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, conditionKey: "vortex-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['vortex-stacks'] ?? 5); const shielded = (ctx.inputs?.['vortex-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['vortex-shielded'] ?? 1) > 0; const mult = shielded ? 2 : 1; return ((s * [4, 5, 6, 7, 8][r - 1] * mult) / 100) * ctx.baseAtk; }" },
    ],
    signatureFor: ["zhongli"],
  },

  // 4-STAR POLEARMS
  {
    id: "blackcliff-pole",
    varName: "blackcliffPole",
    name: "Blackcliff Pole",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 55.1, baseValue: 12.0 },
    passiveName: "Press the Advantage",
    passiveDesc: "After defeating an opponent, ATK is increased by 12~24% for 30s. This effect has a maximum of 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "blackcliff-pole-stacks", label: "Defeat Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+12~24% ATK per defeat" },
    ],
    buffs: [
      { id: "blackcliff-pole-atk", label: "ATK% (Blackcliff Pole)", stat: "atk", refinementValues: [36, 45, 54, 63, 72], isTeamBuff: false, isPercent: true, conditionKey: "blackcliff-pole-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['blackcliff-pole-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "crescent-pike",
    varName: "crescentPike",
    name: "Crescent Pike",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 34.5, baseValue: 7.5 },
    passiveName: "Infusion Needle",
    passiveDesc: "After picking up an Elemental Orb/Particle, Normal and Charged Attacks deal an additional 20~40% ATK as DMG for 5s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "dialogues-of-the-desert-sages",
    varName: "dialoguesOfTheDesertSages",
    name: "Dialogues of the Desert Sages",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Principle of Equilibrium",
    passiveDesc: "When the wielder performs healing, restores 8~16 Energy. Can trigger once every 10s even if off-field.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "dragonspine-spear",
    varName: "dragonspineSpear",
    name: "Dragonspine Spear",
    type: "Polearm",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 69.0, baseValue: 15.0 },
    passiveName: "Frost Burial",
    passiveDesc: "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of dropping an Everfrost Icicle dealing 80~140% AoE ATK DMG. Cryo affected opponents take 200~360% ATK DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "footprint-of-the-rainbow",
    varName: "footprintOfTheRainbow",
    name: "Footprint of the Rainbow",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "defPct", label: "DEF%", value: 51.7, baseValue: 11.3 },
    passiveName: "Climbing the Flowing Waves",
    passiveDesc: "Using an Elemental Skill increases DEF by 16~32% for 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "footprint-def", label: "DEF% (Footprint of the Rainbow)", stat: "def", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    id: "kitain-cross-spear",
    varName: "kitainCrossSpear",
    name: "Kitain Cross Spear",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Samurai Conduct",
    passiveDesc: "Increases Elemental Skill DMG by 6~12%. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates 3~5 Energy every 2s for 6s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "kitain-skill-dmg", label: "Elemental Skill DMG Bonus (Kitain Cross Spear)", stat: "skillDmgBonus", refinementValues: [6, 7.5, 9, 10.5, 12], isTeamBuff: false, computeCode: "(r) => [6, 7.5, 9, 10.5, 12][r - 1]" },
    ],
  },
  {
    id: "lithic-spear",
    varName: "lithicSpear",
    name: "Lithic Spear",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Lithic Axiom: Unity",
    passiveDesc: "For every character in the party who hails from Liyue, the character equipping this weapon gains a 7~11% ATK increase and a 3~7% CRIT Rate increase. Max 4 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "lithic-spear-liyue-members", label: "Liyue Characters in Party (0-4)", control: "stacks", max: 4, defaultValue: 2, hint: "+7~11% ATK & +3~7% CRIT Rate per Liyue character" },
    ],
    buffs: [
      { id: "lithic-spear-atk", label: "ATK% (Lithic Spear)", stat: "atk", refinementValues: [28, 32, 36, 40, 44], isTeamBuff: false, isPercent: true, conditionKey: "lithic-spear-liyue-members", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['lithic-spear-liyue-members'] ?? 2); return ((s * [7, 8, 9, 10, 11][r - 1]) / 100) * ctx.baseAtk; }" },
      { id: "lithic-spear-crit", label: "CRIT Rate% (Lithic Spear)", stat: "critRate", refinementValues: [12, 16, 20, 24, 28], isTeamBuff: false, conditionKey: "lithic-spear-liyue-members", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['lithic-spear-liyue-members'] ?? 2); return s * [3, 4, 5, 6, 7][r - 1]; }" },
    ],
  },
  {
    id: "missive-windspear",
    varName: "missiveWindspear",
    name: "Missive Windspear",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "The Wind Sings",
    passiveDesc: "Within 10s after triggering an Elemental Reaction, ATK is increased by 12~24% and Elemental Mastery is increased by 48~96.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "windspear-active", label: "Reaction Triggered", control: "toggle", defaultValue: 1, hint: "+12~24% ATK and +48~96 EM for 10s" },
    ],
    buffs: [
      { id: "windspear-atk", label: "ATK% (Missive Windspear)", stat: "atk", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, isPercent: true, conditionKey: "windspear-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['windspear-active'] ?? '1') === '1' || Number(ctx.inputs?.['windspear-active'] ?? 1) > 0; return on ? ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk : 0; }" },
      { id: "windspear-em", label: "Elemental Mastery (Missive Windspear)", stat: "em", refinementValues: [48, 60, 72, 84, 96], isTeamBuff: false, conditionKey: "windspear-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['windspear-active'] ?? '1') === '1' || Number(ctx.inputs?.['windspear-active'] ?? 1) > 0; return on ? [48, 60, 72, 84, 96][r - 1] : 0; }" },
    ],
  },
  {
    id: "mountain-bracing-bolt",
    varName: "mountainBracingBolt",
    name: "Mountain-Bracing Bolt",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Peak-Ascending Strike",
    passiveDesc: "Decreases Climbing Stamina Consumption by 15%. Additionally, Elemental Skill DMG is increased by 12~24%. When other party members use Elemental Skills, the equipping character's Elemental Skill DMG is increased by an additional 12~24% for 8s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "mountain-bolt-party-skill", label: "Party Member Used Skill", control: "toggle", defaultValue: 1, hint: "+12~24% extra Skill DMG (Total +24~48% Skill DMG)" },
    ],
    buffs: [
      { id: "mountain-bolt-skill-dmg", label: "Elemental Skill DMG Bonus (Mountain-Bracing Bolt)", stat: "skillDmgBonus", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, computeCode: "(r, ctx) => { const extra = (ctx.inputs?.['mountain-bolt-party-skill'] ?? '1') === '1' || Number(ctx.inputs?.['mountain-bolt-party-skill'] ?? 1) > 0; return [12, 15, 18, 21, 24][r - 1] * (extra ? 2 : 1); }" },
    ],
  },
  {
    id: "prospectors-drill",
    varName: "prospectorsDrill",
    name: "Prospector's Drill",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Masons' Ditty",
    passiveDesc: "When the wielder is healed or heals all party members, gain a Unity's Symbol for 30s. Max 3 symbols. Using an Elemental Skill or Burst consumes all symbols and increases ATK by 3~6% and All Elemental DMG Bonus by 7~13% per symbol for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "prospector-symbols", label: "Unity Symbols Consumed (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+3~6% ATK & +7~13% Elem DMG per symbol" },
    ],
    buffs: [
      { id: "prospector-atk", label: "ATK% (Prospector's Drill)", stat: "atk", refinementValues: [9, 12, 15, 18, 21], isTeamBuff: false, isPercent: true, conditionKey: "prospector-symbols", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['prospector-symbols'] ?? 3); return ((s * [3, 4, 5, 6, 7][r - 1]) / 100) * ctx.baseAtk; }" },
      { id: "prospector-elem-dmg", label: "All Elemental DMG Bonus (Prospector's Drill)", stat: "dmgBonus", refinementValues: [21, 25.5, 30, 34.5, 39], isTeamBuff: false, conditionKey: "prospector-symbols", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['prospector-symbols'] ?? 3); return s * [7, 8.5, 10, 11.5, 13][r - 1]; }" },
    ],
  },
  {
    id: "prototype-starglitter",
    varName: "prototypeStarglitter",
    name: "Prototype Starglitter",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Magic Affinity",
    passiveDesc: "After using an Elemental Skill, increases Normal and Charged Attack DMG by 8~16% for 12s. Max 2 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "starglitter-stacks", label: "Magic Affinity Stacks (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+8~16% Normal & Charged Attack DMG per stack" },
    ],
    buffs: [
      { id: "starglitter-na-dmg", label: "Normal Attack DMG Bonus (Prototype Starglitter)", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, conditionKey: "starglitter-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['starglitter-stacks'] ?? 2); return s * [8, 10, 12, 14, 16][r - 1]; }" },
      { id: "starglitter-ca-dmg", label: "Charged Attack DMG Bonus (Prototype Starglitter)", stat: "chargedDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, conditionKey: "starglitter-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['starglitter-stacks'] ?? 2); return s * [8, 10, 12, 14, 16][r - 1]; }" },
    ],
  },
  {
    id: "rightful-reward",
    varName: "rightfulReward",
    name: "Rightful Reward",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "hpPct", label: "HP%", value: 27.6, baseValue: 6.0 },
    passiveName: "Tip of the Spear",
    passiveDesc: "When the wielder is healed, restores 8~16 Energy. Can trigger once every 10s even if off-field.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "royal-spear",
    varName: "royalSpear",
    name: "Royal Spear",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Focus",
    passiveDesc: "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks. A CRIT hit removes all stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "royal-spear-stacks", label: "Focus Stacks (0-5)", control: "stacks", max: 5, defaultValue: 3, hint: "+8~16% CRIT Rate per stack" },
    ],
    buffs: [
      { id: "royal-spear-crit", label: "CRIT Rate% (Royal Spear)", stat: "critRate", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "royal-spear-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['royal-spear-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; }" },
    ],
  },
  {
    id: "wavebreakers-fin",
    varName: "wavebreakersFin",
    name: "Wavebreaker's Fin",
    type: "Polearm",
    rarity: 4,
    baseAtk: 620,
    lvl1BaseAtk: 45,
    subStat: { type: "atkPct", label: "ATK%", value: 13.8, baseValue: 3.0 },
    passiveName: "Watatsumi Wavewalker",
    passiveDesc: "For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12~0.24%. A maximum of 40~80% increased Elemental Burst DMG can be achieved this way.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "wavebreaker-party-energy", label: "Combined Party Energy Capacity (e.g. 240-330)", control: "stacks", max: 400, defaultValue: 280, hint: "Total Energy of party" },
    ],
    buffs: [
      { id: "wavebreaker-burst-dmg", label: "Elemental Burst DMG Bonus (Wavebreaker's Fin)", stat: "burstDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, computeCode: "(r, ctx) => { const energy = Number(ctx.inputs?.['wavebreaker-party-energy'] ?? 280); const ratio = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; const cap = [40, 50, 60, 70, 80][r - 1]; return Math.min(energy * ratio * 100, cap); }" },
    ],
  },

  // 3-STAR, 2-STAR, 1-STAR POLEARMS
  {
    id: "black-tassel",
    varName: "blackTassel",
    name: "Black Tassel",
    type: "Polearm",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "hpPct", label: "HP%", value: 46.9, baseValue: 10.2 },
    passiveName: "Bane of the Soft",
    passiveDesc: "Increases DMG against slimes by 40~80%.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "halberd",
    varName: "halberd",
    name: "Halberd",
    type: "Polearm",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "atkPct", label: "ATK%", value: 23.5, baseValue: 5.1 },
    passiveName: "Heavy",
    passiveDesc: "Normal Attacks deal an additional 160~320% ATK DMG. Can only occur once every 10s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "white-tassel",
    varName: "whiteTassel",
    name: "White Tassel",
    type: "Polearm",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 23.4, baseValue: 5.1 },
    passiveName: "Sharp",
    passiveDesc: "Increases Normal Attack DMG by 24~48%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "white-tassel-na-dmg", label: "Normal Attack DMG Bonus (White Tassel)", stat: "normalDmgBonus", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, computeCode: "(r) => [24, 30, 36, 42, 48][r - 1]" },
    ],
  },
  {
    id: "iron-point",
    varName: "ironPoint",
    name: "Iron Point",
    type: "Polearm",
    rarity: 2,
    baseAtk: 243,
    lvl1BaseAtk: 33,
    passiveName: "",
    passiveDesc: "A sharp polearm with a pointed iron tip. Light and easy to use.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "beginners-protector",
    varName: "beginnersProtector",
    name: "Beginner's Protector",
    type: "Polearm",
    rarity: 1,
    baseAtk: 185,
    lvl1BaseAtk: 23,
    passiveName: "",
    passiveDesc: "A simple polearm given to novice adventurers.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
];

function generatePolearmFiles() {
  const outDir = path.resolve("src/data/registry/weapons/polearms");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const exportNames: string[] = [
    "crimsonMoonsSemblance",
    "moonpiercer",
    "staffOfHoma",
    "deathmatch",
    "calamityQueller",
    "primordialJadeWingedSpear",
    "balladOfTheFjords",
    "theCatch",
    "dragonsBane",
    "favoniusLance",
  ];

  for (const w of POLEARMS_DATA) {
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
  type: "Polearm",
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

  // Update polearms/index.ts
  const allPolearmImports = [
    'import { crimsonMoonsSemblance } from "./crimson-moons-semblance";',
    'import { moonpiercer } from "./moonpiercer";',
    'import { staffOfHoma } from "./staff-of-homa";',
    'import { deathmatch } from "./deathmatch";',
    'import { calamityQueller } from "./calamity-queller";',
    'import { primordialJadeWingedSpear } from "./primordial-jade-winged-spear";',
    'import { balladOfTheFjords } from "./ballad-of-the-fjords";',
    'import { theCatch } from "./the-catch";',
    'import { dragonsBane } from "./dragons-bane";',
    'import { favoniusLance } from "./favonius-lance";',
    ...POLEARMS_DATA.map((w) => `import { ${w.varName} } from "./${w.id}";`),
  ].join("\n");

  const indexContent = `${allPolearmImports}
import type { WeaponConfig } from "../types";

export {
  ${exportNames.join(",\n  ")},
};

export const POLEARMS: WeaponConfig[] = [
  ${exportNames.join(",\n  ")},
];
`;

  fs.writeFileSync(path.join(outDir, "index.ts"), indexContent, "utf-8");
  console.log(`Updated polearms/index.ts with ${exportNames.length} polearms!`);
}

generatePolearmFiles();
