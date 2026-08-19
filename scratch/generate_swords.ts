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
  type: "Sword";
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

const SWORDS_DATA: WeaponData[] = [
  // 5-STAR SWORDS
  {
    id: "absolution",
    varName: "absolution",
    name: "Absolution",
    type: "Sword",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Poise",
    passiveDesc: "CRIT DMG increased by 20~40%. Increasing the value of a Bond of Life increases the DMG the equipping character deals by 16~32% for 6s. Max 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "absolution-stacks", label: "Absolution BoL Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+16~32% All DMG bonus per stack" },
    ],
    buffs: [
      { id: "absolution-crit-dmg", label: "CRIT DMG% (Absolution)", stat: "critDmg", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]" },
      { id: "absolution-dmg-bonus", label: "All DMG Bonus (Absolution Stacks)", stat: "dmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, conditionKey: "absolution-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['absolution-stacks'] ?? 3); return s * [16, 20, 24, 28, 32][r - 1]; }" },
    ],
    signatureFor: ["clorinde"],
  },
  {
    id: "aquila-favonia",
    varName: "aquilaFavonia",
    name: "Aquila Favonia",
    type: "Sword",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 41.3, baseValue: 9.0 },
    passiveName: "Bane of the Falcon",
    passiveDesc: "ATK is increased by 20~40%. Triggers on taking DMG: the soul of the Falcon of the West awakens, regenerating HP equal to 100~160% of ATK and dealing 200~320% of ATK as DMG to surrounding opponents. This effect can only occur once every 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "aquila-atk", label: "ATK% (Aquila Favonia)", stat: "atk", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk" },
    ],
    signatureFor: ["jean"],
  },
  {
    id: "haran-geppaku-futsu",
    varName: "haranGeppakuFutsu",
    name: "Haran Geppaku Futsu",
    type: "Sword",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Honed Flow",
    passiveDesc: "Obtain 12~24% All Elemental DMG Bonus. When other nearby party members use Elemental Skills, the equipping character gains 1 Wavespike stack. Max 2 stacks. When the equipping character uses an Elemental Skill, consume all Wavespike stacks to increase Normal Attack DMG by 20~40% per stack for 8s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "wavespike-stacks", label: "Wavespike Stacks (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+20~40% Normal Attack DMG bonus per stack" },
    ],
    buffs: [
      { id: "haran-elem-dmg", label: "All Elemental DMG Bonus (Haran Geppaku Futsu)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
      { id: "haran-na-dmg", label: "Normal Attack DMG Bonus (Haran Wavespike)", stat: "normalDmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, conditionKey: "wavespike-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['wavespike-stacks'] ?? 2); return s * [20, 25, 30, 35, 40][r - 1]; }" },
    ],
    signatureFor: ["ayato"],
  },
  {
    id: "light-of-foliar-incision",
    varName: "lightOfFoliarIncision",
    name: "Light of Foliar Incision",
    type: "Sword",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Whitemoon Bristle",
    passiveDesc: "CRIT Rate is increased by 4~8%. After Normal Attacks deal Elemental DMG, the Foliar Incision effect will be obtained, increasing DMG dealt by Normal Attacks and Elemental Skills by 120~240% of Elemental Mastery. This effect will disappear after 28 DMG instances or 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "foliar-incision-em", label: "Character EM (for Foliar Incision)", control: "stacks", max: 2000, defaultValue: 400, hint: "EM used for flat Normal & Skill DMG bonus" },
      { id: "foliar-incision-active", label: "Foliar Incision Buff Active", control: "toggle", defaultValue: 1, hint: "+120~240% of EM as flat DMG bonus" },
    ],
    buffs: [
      { id: "foliar-crit-rate", label: "CRIT Rate% (Light of Foliar Incision)", stat: "critRate", refinementValues: [4, 5, 6, 7, 8], isTeamBuff: false, computeCode: "(r) => [4, 5, 6, 7, 8][r - 1]" },
      { id: "foliar-flat-dmg", label: "Flat DMG from EM (Light of Foliar Incision)", stat: "flatDmgBonus", refinementValues: [120, 150, 180, 210, 240], isTeamBuff: false, conditionKey: "foliar-incision-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['foliar-incision-active'] ?? '1') === '1' || Number(ctx.inputs?.['foliar-incision-active'] ?? 1) > 0; if (!on) return 0; const em = Number(ctx.inputs?.['foliar-incision-em'] ?? 400); return em * ([1.2, 1.5, 1.8, 2.1, 2.4][r - 1]); }" },
    ],
    signatureFor: ["alhaitham"],
  },
  {
    id: "mistsplitter-reforged",
    varName: "mistsplitterReforged",
    name: "Mistsplitter Reforged",
    type: "Sword",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Mistsplitter's Edge",
    passiveDesc: "Gain a 12~24% Elemental DMG Bonus for all elements and obtain the might of the Mistsplitter's Emblem. At stack levels 1/2/3, Mistsplitter's Emblem provides a 8/16/28% ~ 16/32/56% Elemental DMG Bonus for the character's Elemental Type.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "mistsplitter-stacks", label: "Mistsplitter Emblem Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "Tiered Elemental DMG Bonus (8/16/28% at R1, up to 16/32/56% at R5)" },
    ],
    buffs: [
      { id: "mistsplitter-base-elem", label: "All Elemental DMG Bonus (Mistsplitter Base)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
      { id: "mistsplitter-emblem-dmg", label: "Elemental DMG Bonus (Mistsplitter Stacks)", stat: "dmgBonus", refinementValues: [28, 35, 42, 49, 56], isTeamBuff: false, conditionKey: "mistsplitter-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['mistsplitter-stacks'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 0: [0, 0, 0, 0, 0], 1: [8, 10, 12, 14, 16], 2: [16, 20, 24, 28, 32], 3: [28, 35, 42, 49, 56] }; return (tiers[s] ?? tiers[3])[r - 1]; }" },
    ],
    signatureFor: ["ayaka"],
  },
  {
    id: "primordial-jade-cutter",
    varName: "primordialJadeCutter",
    name: "Primordial Jade Cutter",
    type: "Sword",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 44.1, baseValue: 9.6 },
    passiveName: "Protector's Virtue",
    passiveDesc: "HP increased by 20~40%. Additionally, provides an ATK Bonus based on 1.2~2.4% of the wielder's Max HP.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "pjc-wielder-hp", label: "Character Max HP", control: "stacks", max: 100000, defaultValue: 25000, hint: "Max HP used for Jade Cutter ATK conversion (1.2~2.4%)" },
    ],
    buffs: [
      { id: "pjc-hp-pct", label: "HP% (Primordial Jade Cutter)", stat: "hp", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]" },
      { id: "pjc-atk-from-hp", label: "Flat ATK from Max HP (Primordial Jade Cutter)", stat: "atk", refinementValues: [1.2, 1.5, 1.8, 2.1, 2.4], isTeamBuff: false, computeCode: "(r, ctx) => { const hp = Number(ctx.inputs?.['pjc-wielder-hp'] ?? 25000); const ratio = [0.012, 0.015, 0.018, 0.021, 0.024][r - 1]; return hp * ratio; }" },
    ],
  },
  {
    id: "skyward-blade",
    varName: "skywardBlade",
    name: "Skyward Blade",
    type: "Sword",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 55.1, baseValue: 12.0 },
    passiveName: "Sky-Piercing Fang",
    passiveDesc: "CRIT Rate increased by 4~8%. Gains Skypiercing Might upon using an Elemental Burst: Increases Movement SPD by 10%, increases ATK SPD by 10%, and Normal and Charged Hits deal additional DMG equal to 20~40% of ATK for 12s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "skyward-crit-rate", label: "CRIT Rate% (Skyward Blade)", stat: "critRate", refinementValues: [4, 5, 6, 7, 8], isTeamBuff: false, computeCode: "(r) => [4, 5, 6, 7, 8][r - 1]" },
    ],
  },
  {
    id: "splendor-of-tranquil-waters",
    varName: "splendorOfTranquilWaters",
    name: "Splendor of Tranquil Waters",
    type: "Sword",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Dawn and Dusk of the Lakes",
    passiveDesc: "When current HP increases or decreases, Elemental Skill DMG dealt is increased by 8~16% for 6s. Max 3 stacks. When other party members' current HP increases or decreases, the equipping character's Max HP is increased by 14~28% for 6s. Max 2 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "splendor-skill-stacks", label: "Skill DMG Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+8~16% Skill DMG per stack" },
      { id: "splendor-hp-stacks", label: "Party HP Change Stacks (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+14~28% Max HP per stack" },
    ],
    buffs: [
      { id: "splendor-skill-dmg", label: "Elemental Skill DMG Bonus (Splendor)", stat: "skillDmgBonus", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "splendor-skill-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['splendor-skill-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; }" },
      { id: "splendor-max-hp", label: "Max HP% (Splendor Party Stacks)", stat: "hp", refinementValues: [28, 35, 42, 49, 56], isTeamBuff: false, isPercent: true, conditionKey: "splendor-hp-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['splendor-hp-stacks'] ?? 2); return s * [14, 17.5, 21, 24.5, 28][r - 1]; }" },
    ],
    signatureFor: ["furina"],
  },
  {
    id: "summit-shaper",
    varName: "summitShaper",
    name: "Summit Shaper",
    type: "Sword",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Golden Majesty",
    passiveDesc: "Increases Shield Strength by 20~40%. Scoring hits on opponents increases ATK by 4~8% for 8s. Max 5 stacks. When protected by a shield, this ATK increase effect is increased by 100%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "summit-stacks", label: "Golden Majesty Stacks (0-5)", control: "stacks", max: 5, defaultValue: 5, hint: "+4~8% ATK per stack" },
      { id: "summit-shielded", label: "Protected by Shield (2x ATK Buff)", control: "toggle", defaultValue: 1, hint: "Doubles ATK bonus from stacks" },
    ],
    buffs: [
      { id: "summit-atk", label: "ATK% (Summit Shaper Stacks)", stat: "atk", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, conditionKey: "summit-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['summit-stacks'] ?? 5); const shielded = (ctx.inputs?.['summit-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['summit-shielded'] ?? 1) > 0; const mult = shielded ? 2 : 1; return ((s * [4, 5, 6, 7, 8][r - 1] * mult) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "uraku-misugiri",
    varName: "urakuMisugiri",
    name: "Uraku Misugiri",
    type: "Sword",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Brocade Bloom, Shrine Feather",
    passiveDesc: "Normal Attack DMG is increased by 16~32% and Elemental Skill DMG is increased by 24~48%. After a nearby active character deals Geo DMG, the aforementioned effects increase by 100% for 15s. Additionally, DEF is increased by 20~40%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "uraku-geo-proc", label: "Geo DMG Dealt (2x NA/Skill Buff)", control: "toggle", defaultValue: 1, hint: "Doubles Normal & Skill DMG bonuses (+32~64% NA, +48~96% Skill)" },
    ],
    buffs: [
      { id: "uraku-def", label: "DEF% (Uraku Misugiri)", stat: "def", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]" },
      { id: "uraku-na-dmg", label: "Normal Attack DMG Bonus (Uraku Misugiri)", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r, ctx) => { const geo = (ctx.inputs?.['uraku-geo-proc'] ?? '1') === '1' || Number(ctx.inputs?.['uraku-geo-proc'] ?? 1) > 0; return [16, 20, 24, 28, 32][r - 1] * (geo ? 2 : 1); }" },
      { id: "uraku-skill-dmg", label: "Elemental Skill DMG Bonus (Uraku Misugiri)", stat: "skillDmgBonus", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, computeCode: "(r, ctx) => { const geo = (ctx.inputs?.['uraku-geo-proc'] ?? '1') === '1' || Number(ctx.inputs?.['uraku-geo-proc'] ?? 1) > 0; return [24, 30, 36, 42, 48][r - 1] * (geo ? 2 : 1); }" },
    ],
    signatureFor: ["chiori"],
  },

  // 4-STAR SWORDS
  {
    id: "amenoma-kageuchi",
    varName: "amenomaKageuchi",
    name: "Amenoma Kageuchi",
    type: "Sword",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Iwakura Succession",
    passiveDesc: "After casting an Elemental Skill, gain 1 Succession Seed. Max 3 seeds. Using an Elemental Burst consumes all seeds and regenerates 6~12 Energy per seed.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "blackcliff-longsword",
    varName: "blackcliffLongsword",
    name: "Blackcliff Longsword",
    type: "Sword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 36.8, baseValue: 8.0 },
    passiveName: "Press the Advantage",
    passiveDesc: "After defeating an opponent, ATK is increased by 12~24% for 30s. This effect has a maximum of 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "blackcliff-stacks", label: "Press the Advantage Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+12~24% ATK per defeat stack" },
    ],
    buffs: [
      { id: "blackcliff-atk", label: "ATK% (Blackcliff Longsword)", stat: "atk", refinementValues: [36, 45, 54, 63, 72], isTeamBuff: false, isPercent: true, conditionKey: "blackcliff-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['blackcliff-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "cinnabar-spindle",
    varName: "cinnabarSpindle",
    name: "Cinnabar Spindle",
    type: "Sword",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "defPct", label: "DEF%", value: 69.0, baseValue: 15.0 },
    passiveName: "Spotless Heart",
    passiveDesc: "Elemental Skill DMG is increased by 40~80% of DEF. The effect will be triggered no more than once every 1.5s and will be cleared 0.1s after the Elemental Skill deals DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "cinnabar-def", label: "Character Total DEF", control: "stacks", max: 10000, defaultValue: 2500, hint: "Total DEF used for Cinnabar flat Skill DMG bonus" },
    ],
    buffs: [
      { id: "cinnabar-flat-skill", label: "Flat Skill DMG from DEF (Cinnabar Spindle)", stat: "flatDmgBonus", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, computeCode: "(r, ctx) => { const def = Number(ctx.inputs?.['cinnabar-def'] ?? 2500); const ratio = [0.4, 0.5, 0.6, 0.7, 0.8][r - 1]; return def * ratio; }" },
    ],
    signatureFor: ["albedo"],
  },
  {
    id: "favonius-sword",
    varName: "favoniusSword",
    name: "Favonius Sword",
    type: "Sword",
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
    id: "festering-desire",
    varName: "festeringDesire",
    name: "Festering Desire",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Undying Admiration",
    passiveDesc: "Increases Elemental Skill DMG by 16~32% and Elemental Skill CRIT Rate by 6~12%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "festering-skill-dmg", label: "Elemental Skill DMG Bonus (Festering Desire)", stat: "skillDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
      { id: "festering-skill-crit", label: "Elemental Skill CRIT Rate% (Festering Desire)", stat: "critRate", refinementValues: [6, 7.5, 9, 10.5, 12], isTeamBuff: false, computeCode: "(r) => [6, 7.5, 9, 10.5, 12][r - 1]" },
    ],
  },
  {
    id: "finale-of-the-deep",
    varName: "finaleOfTheDeep",
    name: "Finale of the Deep",
    type: "Sword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "An End Sublime",
    passiveDesc: "When using an Elemental Skill, ATK will be increased by 12~24% for 15s, and a Bond of Life equal to 25% of Max HP will be granted. When cleared, grants 150~300 flat ATK.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "finale-cleared-bol", label: "Bond of Life Cleared (Flat ATK Buff)", control: "toggle", defaultValue: 1, hint: "+150~300 Flat ATK for 15s" },
    ],
    buffs: [
      { id: "finale-atk-pct", label: "ATK% (Finale of the Deep)", stat: "atk", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk" },
      { id: "finale-flat-atk", label: "Flat ATK from Cleared BoL (Finale of the Deep)", stat: "atk", refinementValues: [150, 187.5, 225, 262.5, 300], isTeamBuff: false, conditionKey: "finale-cleared-bol", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['finale-cleared-bol'] ?? '1') === '1' || Number(ctx.inputs?.['finale-cleared-bol'] ?? 1) > 0; return on ? [150, 187.5, 225, 262.5, 300][r - 1] : 0; }" },
    ],
  },
  {
    id: "fleuve-cendre-ferryman",
    varName: "fleuveCendreFerryman",
    name: "Fleuve Cendre Ferryman",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Ironbone",
    passiveDesc: "Increases Elemental Skill CRIT Rate by 8~16%. Additionally, increases Energy Recharge by 16~32% for 5s after using an Elemental Skill.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "fleuve-er-active", label: "Post-Skill ER Buff Active", control: "toggle", defaultValue: 1, hint: "+16~32% Energy Recharge for 5s" },
    ],
    buffs: [
      { id: "fleuve-skill-crit", label: "Elemental Skill CRIT Rate% (Fleuve Cendre)", stat: "critRate", refinementValues: [8, 10, 12, 14, 16], isTeamBuff: false, computeCode: "(r) => [8, 10, 12, 14, 16][r - 1]" },
      { id: "fleuve-er-buff", label: "Energy Recharge% (Fleuve Cendre)", stat: "energyRecharge", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, conditionKey: "fleuve-er-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['fleuve-er-active'] ?? '1') === '1' || Number(ctx.inputs?.['fleuve-er-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }" },
    ],
  },
  {
    id: "flute-of-ezpitzal",
    varName: "fluteOfEzpitzal",
    name: "Flute of Ezpitzal",
    type: "Sword",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "defPct", label: "DEF%", value: 69.0, baseValue: 15.0 },
    passiveName: "Smoke and Mirrors",
    passiveDesc: "Using an Elemental Skill increases DEF by 16~32% for 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "ezpitzal-def", label: "DEF% (Flute of Ezpitzal)", stat: "def", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    id: "iron-sting",
    varName: "ironSting",
    name: "Iron Sting",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Infusion Stinger",
    passiveDesc: "Dealing Elemental DMG increases all DMG by 6~12% for 6s. Max 2 stacks. Can occur once every 1s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "iron-sting-stacks", label: "Infusion Stinger Stacks (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+6~12% All DMG bonus per stack" },
    ],
    buffs: [
      { id: "iron-sting-dmg", label: "All DMG Bonus (Iron Sting)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, conditionKey: "iron-sting-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['iron-sting-stacks'] ?? 2); return s * [6, 7.5, 9, 10.5, 12][r - 1]; }" },
    ],
  },
  {
    id: "kagotsurube-isshin",
    varName: "kagotsurubeIsshin",
    name: "Kagotsurube Isshin",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Isshin Art Clarity",
    passiveDesc: "When a Normal, Charged, or Plunging Attack hits an opponent, it will deal 180% of ATK as AoE DMG and increase ATK by 15% for 8s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "isshin-atk", label: "ATK% (Kagotsurube Isshin)", stat: "atk", refinementValues: [15, 15, 15, 15, 15], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => (15 / 100) * ctx.baseAtk" },
    ],
  },
  {
    id: "lions-roar",
    varName: "lionsRoar",
    name: "Lion's Roar",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Bane of Fire and Thunder",
    passiveDesc: "Increases DMG against opponents affected by Pyro or Electro by 20~36%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "lions-roar-target", label: "Target Affected by Pyro/Electro", control: "toggle", defaultValue: 1, hint: "+20~36% All DMG bonus vs Pyro/Electro targets" },
    ],
    buffs: [
      { id: "lions-roar-dmg", label: "All DMG Bonus (Lion's Roar)", stat: "dmgBonus", refinementValues: [20, 24, 28, 32, 36], isTeamBuff: false, conditionKey: "lions-roar-target", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['lions-roar-target'] ?? '1') === '1' || Number(ctx.inputs?.['lions-roar-target'] ?? 1) > 0; return on ? [20, 24, 28, 32, 36][r - 1] : 0; }" },
    ],
  },
  {
    id: "prototype-rancour",
    varName: "prototypeRancour",
    name: "Prototype Rancour",
    type: "Sword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 34.5, baseValue: 7.5 },
    passiveName: "Smashed Stone",
    passiveDesc: "On hit, Normal or Charged Attacks increase ATK and DEF by 4~8% for 6s. Max 4 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "rancour-stacks", label: "Smashed Stone Stacks (0-4)", control: "stacks", max: 4, defaultValue: 4, hint: "+4~8% ATK & DEF per stack" },
    ],
    buffs: [
      { id: "rancour-atk", label: "ATK% (Prototype Rancour)", stat: "atk", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, conditionKey: "rancour-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['rancour-stacks'] ?? 4); return ((s * [4, 5, 6, 7, 8][r - 1]) / 100) * ctx.baseAtk; }" },
      { id: "rancour-def", label: "DEF% (Prototype Rancour)", stat: "def", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, conditionKey: "rancour-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['rancour-stacks'] ?? 4); return s * [4, 5, 6, 7, 8][r - 1]; }" },
    ],
  },
  {
    id: "royal-longsword",
    varName: "royalLongsword",
    name: "Royal Longsword",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Focus",
    passiveDesc: "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks. A CRIT hit removes all stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "royal-stacks", label: "Royal Focus Stacks (0-5)", control: "stacks", max: 5, defaultValue: 3, hint: "+8~16% CRIT Rate per stack" },
    ],
    buffs: [
      { id: "royal-crit-rate", label: "CRIT Rate% (Royal Longsword)", stat: "critRate", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "royal-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['royal-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; }" },
    ],
  },
  {
    id: "sacrificial-sword",
    varName: "sacrificialSword",
    name: "Sacrificial Sword",
    type: "Sword",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 61.3, baseValue: 13.3 },
    passiveName: "Composed",
    passiveDesc: "After damaging an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
    isSupport: true,
    buffType: "self",
    buffs: [],
  },
  {
    id: "sturdy-bone",
    varName: "sturdyBone",
    name: "Sturdy Bone",
    type: "Sword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Sprinting Stride",
    passiveDesc: "Sprinting or Alternate Sprinting stamina consumption is decreased by 15%. Additionally, after Sprinting or Alternate Sprinting, Normal Attack DMG is increased by 16~32% of ATK for 6s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "sturdy-bone-na-dmg", label: "Normal Attack DMG Bonus (Sturdy Bone)", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    id: "sword-of-descension",
    varName: "swordOfDescension",
    name: "Sword of Descension",
    type: "Sword",
    rarity: 4,
    baseAtk: 440,
    lvl1BaseAtk: 39,
    subStat: { type: "atkPct", label: "ATK%", value: 35.2, baseValue: 7.7 },
    passiveName: "Descension",
    passiveDesc: "Hitting opponents with Normal and Charged Attacks deals 200% ATK as DMG. If equipped by the Traveler, ATK is increased by 66.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "descension-flat-atk", label: "Traveler Flat ATK (Sword of Descension)", stat: "atk", refinementValues: [66, 66, 66, 66, 66], isTeamBuff: false, computeCode: "() => 66" },
    ],
  },
  {
    id: "sword-of-narzissenkreuz",
    varName: "swordOfNarzissenkreuz",
    name: "Sword of Narzissenkreuz",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Hero's Blade: Ousia / Pneuma",
    passiveDesc: "When the wielder does not have Arkhe alignment, Normal, Charged, and Plunging Attacks will unleash Arkhe Ousia/Pneuma DMG equal to 160~320% of ATK every 12s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "the-alley-flash",
    varName: "theAlleyFlash",
    name: "The Alley Flash",
    type: "Sword",
    rarity: 4,
    baseAtk: 620,
    lvl1BaseAtk: 45,
    subStat: { type: "em", label: "Elemental Mastery", value: 55, baseValue: 12 },
    passiveName: "Itinerant Hero",
    passiveDesc: "Increases DMG dealt by the character equipping this weapon by 12~24%. Taking DMG disables this effect for 5s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "alley-flash-dmg", label: "All DMG Bonus (The Alley Flash)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
    ],
  },
  {
    id: "the-black-sword",
    varName: "theBlackSword",
    name: "The Black Sword",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Justice",
    passiveDesc: "Increases DMG dealt by Normal and Charged Attacks by 20~40%. Additionally, regenerates 60~100% of ATK as HP when Normal and Charged Attacks score a CRIT Hit.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "black-sword-na-dmg", label: "Normal Attack DMG Bonus (The Black Sword)", stat: "normalDmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]" },
      { id: "black-sword-ca-dmg", label: "Charged Attack DMG Bonus (The Black Sword)", stat: "chargedDmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]" },
    ],
  },
  {
    id: "the-dockhands-assistant",
    varName: "theDockhandsAssistant",
    name: "The Dockhand's Assistant",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Sea Shanty",
    passiveDesc: "When the wielder is healed or heals all party members, gain a Stoic's Symbol for 30s. Max 3 symbols. Using an Elemental Skill or Burst consumes all symbols and increases Elemental Mastery by 40~80 and regenerates 2~4 Energy per symbol for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "dockhand-symbols", label: "Stoic Symbols Consumed (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+40~80 EM per symbol (Total +120~240 EM)" },
    ],
    buffs: [
      { id: "dockhand-em", label: "EM (The Dockhand's Assistant)", stat: "em", refinementValues: [120, 150, 180, 210, 240], isTeamBuff: false, conditionKey: "dockhand-symbols", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['dockhand-symbols'] ?? 3); return s * [40, 50, 60, 70, 80][r - 1]; }" },
    ],
  },
  {
    id: "the-flute",
    varName: "theFlute",
    name: "The Flute",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Chord",
    passiveDesc: "Normal or Charged Attacks grant a Harmonic on hit. Gaining 5 Harmonics triggers the power of music and deals 100~200% ATK DMG to surrounding opponents.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "toukabou-shigure",
    varName: "toukabouShigure",
    name: "Toukabou Shigure",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Kaidan: Rain-Tied Talisman",
    passiveDesc: "After an attack hits an opponent, it will inflict an instance of Cursed Parasol upon one of them for 10s. The character equipping this weapon will deal 16~32% more DMG to the opponent affected by Cursed Parasol.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "parasol-target", label: "Target Afflicted by Cursed Parasol", control: "toggle", defaultValue: 1, hint: "+16~32% All DMG against cursed target" },
    ],
    buffs: [
      { id: "parasol-dmg", label: "All DMG Bonus (Toukabou Shigure)", stat: "dmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, conditionKey: "parasol-target", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['parasol-target'] ?? '1') === '1' || Number(ctx.inputs?.['parasol-target'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }" },
    ],
  },
  {
    id: "wolf-fang",
    varName: "wolfFang",
    name: "Wolf-Fang",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Northwind Wolf",
    passiveDesc: "DMG dealt by Elemental Skill and Elemental Burst is increased by 16~32%. When an Elemental Skill or Burst hits an opponent, its CRIT Rate is increased by 2~4% for 10s. Max 4 stacks for each.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "wolf-fang-skill-stacks", label: "Skill Hit CRIT Stacks (0-4)", control: "stacks", max: 4, defaultValue: 4, hint: "+2~4% Skill CRIT Rate per stack" },
      { id: "wolf-fang-burst-stacks", label: "Burst Hit CRIT Stacks (0-4)", control: "stacks", max: 4, defaultValue: 4, hint: "+2~4% Burst CRIT Rate per stack" },
    ],
    buffs: [
      { id: "wolf-fang-skill-dmg", label: "Elemental Skill DMG Bonus (Wolf-Fang)", stat: "skillDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
      { id: "wolf-fang-burst-dmg", label: "Elemental Burst DMG Bonus (Wolf-Fang)", stat: "burstDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
      { id: "wolf-fang-skill-crit", label: "Elemental Skill CRIT Rate% (Wolf-Fang)", stat: "critRate", refinementValues: [8, 10, 12, 14, 16], isTeamBuff: false, conditionKey: "wolf-fang-skill-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['wolf-fang-skill-stacks'] ?? 4); return s * [2, 2.5, 3, 3.5, 4][r - 1]; }" },
    ],
  },

  // 3-STAR, 2-STAR, 1-STAR SWORDS
  {
    id: "cool-steel",
    varName: "coolSteel",
    name: "Cool Steel",
    type: "Sword",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "atkPct", label: "ATK%", value: 35.2, baseValue: 7.7 },
    passiveName: "Bane of Water and Ice",
    passiveDesc: "Increases DMG against opponents affected by Hydro or Cryo by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "cool-steel-target", label: "Target Affected by Hydro/Cryo", control: "toggle", defaultValue: 1, hint: "+12~24% DMG bonus" },
    ],
    buffs: [
      { id: "cool-steel-dmg", label: "All DMG Bonus (Cool Steel)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, conditionKey: "cool-steel-target", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['cool-steel-target'] ?? '1') === '1' || Number(ctx.inputs?.['cool-steel-target'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }" },
    ],
  },
  {
    id: "dark-iron-sword",
    varName: "darkIronSword",
    name: "Dark Iron Sword",
    type: "Sword",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "em", label: "Elemental Mastery", value: 141, baseValue: 31 },
    passiveName: "Overloaded",
    passiveDesc: "Upon triggering an Overloaded, Superconduct, Electro-Charged, Quicken, Aggravate, Hyperbloom, or Electro-infused Swirl reaction, ATK is increased by 20~40% for 12s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "dark-iron-atk", label: "ATK% (Dark Iron Sword)", stat: "atk", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk" },
    ],
  },
  {
    id: "fillet-blade",
    varName: "filletBlade",
    name: "Fillet Blade",
    type: "Sword",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "atkPct", label: "ATK%", value: 35.2, baseValue: 7.7 },
    passiveName: "Gash",
    passiveDesc: "On hit, has a 50% chance to deal 240~400% ATK DMG to a single opponent. Can only occur once every 15~11s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "harbinger-of-dawn",
    varName: "harbingerOfDawn",
    name: "Harbinger of Dawn",
    type: "Sword",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 46.9, baseValue: 10.2 },
    passiveName: "Vigorous",
    passiveDesc: "When HP is above 90%, increases CRIT Rate by 14~28%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "harbinger-hp-90", label: "HP > 90% (Vigorous Active)", control: "toggle", defaultValue: 1, hint: "+14~28% CRIT Rate when HP > 90%" },
    ],
    buffs: [
      { id: "harbinger-crit-rate", label: "CRIT Rate% (Harbinger of Dawn)", stat: "critRate", refinementValues: [14, 17.5, 21, 24.5, 28], isTeamBuff: false, conditionKey: "harbinger-hp-90", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['harbinger-hp-90'] ?? '1') === '1' || Number(ctx.inputs?.['harbinger-hp-90'] ?? 1) > 0; return on ? [14, 17.5, 21, 24.5, 28][r - 1] : 0; }" },
    ],
  },
  {
    id: "skyrider-sword",
    varName: "skyriderSword",
    name: "Skyrider Sword",
    type: "Sword",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 51.7, baseValue: 11.3 },
    passiveName: "Determination",
    passiveDesc: "Using an Elemental Burst increases ATK and Movement SPD by 12~24% for 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "skyrider-atk", label: "ATK% (Skyrider Sword)", stat: "atk", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk" },
    ],
  },
  {
    id: "travelers-handy-sword",
    varName: "travelersHandySword",
    name: "Traveler's Handy Sword",
    type: "Sword",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "defPct", label: "DEF%", value: 29.3, baseValue: 6.4 },
    passiveName: "Journey",
    passiveDesc: "Each Elemental Orb or Particle collected restores 1~2% HP.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "silver-sword",
    varName: "silverSword",
    name: "Silver Sword",
    type: "Sword",
    rarity: 2,
    baseAtk: 243,
    lvl1BaseAtk: 33,
    passiveName: "",
    passiveDesc: "A traditional sword with a silver-plated blade. Light, sharp, and easy to wield.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "dull-blade",
    varName: "dullBlade",
    name: "Dull Blade",
    type: "Sword",
    rarity: 1,
    baseAtk: 185,
    lvl1BaseAtk: 23,
    passiveName: "",
    passiveDesc: "Youthful dreams of wild adventure. Plated with dreams of glory and silver.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
];

function generateSwordFiles() {
  const outDir = path.resolve("src/data/registry/weapons/swords");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const exportNames: string[] = [
    "freedomSworn",
    "keyOfKhajNisut",
    "xiphosMoonlight",
    "sapwoodBlade",
    "peakPatrolSong",
  ];

  for (const w of SWORDS_DATA) {
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
  type: "Sword",
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

  // Update swords/index.ts
  const allSwordImports = [
    'import { freedomSworn } from "./freedom-sworn";',
    'import { keyOfKhajNisut } from "./key-of-khaj-nisut";',
    'import { xiphosMoonlight } from "./xiphos-moonlight";',
    'import { sapwoodBlade } from "./sapwood-blade";',
    'import { peakPatrolSong } from "./peak-patrol-song";',
    ...SWORDS_DATA.map((w) => `import { ${w.varName} } from "./${w.id}";`),
  ].join("\n");

  const indexContent = `${allSwordImports}
import type { WeaponConfig } from "../types";

export {
  ${exportNames.join(",\n  ")},
};

export const SWORDS: WeaponConfig[] = [
  ${exportNames.join(",\n  ")},
];
`;

  fs.writeFileSync(path.join(outDir, "index.ts"), indexContent, "utf-8");
  console.log(`Updated swords/index.ts with ${exportNames.length} swords!`);
}

generateSwordFiles();
