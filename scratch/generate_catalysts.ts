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
  type: "Catalyst";
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

const CATALYSTS_DATA: WeaponData[] = [
  // 5-STAR CATALYSTS
  {
    id: "cashflow-supervision",
    varName: "cashflowSupervision",
    name: "Cashflow Supervision",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 22.1, baseValue: 4.8 },
    passiveName: "Golden Blood-Tide",
    passiveDesc: "ATK is increased by 16~32%. When current HP increases or decreases, Normal Attack DMG is increased by 16~32% and Charged Attack DMG is increased by 14~28% for 4s. Max 3 stacks. At 3 stacks, ATK SPD is increased by 8~16%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "cashflow-stacks", label: "HP Change Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+16~32% NA DMG and +14~28% CA DMG per stack (up to +48~96% NA, +42~84% CA)" },
    ],
    buffs: [
      { id: "cashflow-atk", label: "ATK% (Cashflow Supervision)", stat: "atk", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk" },
      { id: "cashflow-na-dmg", label: "Normal Attack DMG Bonus (Cashflow Supervision)", stat: "normalDmgBonus", refinementValues: [48, 60, 72, 84, 96], isTeamBuff: false, conditionKey: "cashflow-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['cashflow-stacks'] ?? 3); return s * [16, 20, 24, 28, 32][r - 1]; }" },
      { id: "cashflow-ca-dmg", label: "Charged Attack DMG Bonus (Cashflow Supervision)", stat: "chargedDmgBonus", refinementValues: [42, 52.5, 63, 73.5, 84], isTeamBuff: false, conditionKey: "cashflow-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['cashflow-stacks'] ?? 3); return s * [14, 17.5, 21, 24.5, 28][r - 1]; }" },
    ],
    signatureFor: ["wriothesley"],
  },
  {
    id: "crane-echoing-call",
    varName: "craneEchoingCall",
    name: "Crane's Echoing Call",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 741,
    lvl1BaseAtk: 49,
    subStat: { type: "atkPct", label: "ATK%", value: 16.5, baseValue: 3.6 },
    passiveName: "Pavonian Whispers",
    passiveDesc: "After the equipping character hits an opponent with a Plunging Attack, all nearby party members' Plunging Attacks deal 28~80% increased DMG for 20s. When nearby party members hit opponents with Plunging Attacks, they will restore 2.5~3.5 Energy to the equipping character.",
    isSupport: true,
    buffType: "both",
    buffs: [
      { id: "crane-party-plunge", label: "Party Plunging Attack DMG Bonus (Crane's Echoing Call)", description: "All nearby party members deal +28~80% increased Plunging Attack DMG", stat: "plungeDmgBonus", refinementValues: [28, 41, 54, 67, 80], isTeamBuff: true, computeCode: "(r) => [28, 41, 54, 67, 80][r - 1]" },
    ],
    signatureFor: ["xianyun"],
  },
  {
    id: "kaguras-verity",
    varName: "kagurasVerity",
    name: "Kagura's Verity",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 66.2, baseValue: 14.4 },
    passiveName: "Kagura Dance",
    passiveDesc: "Gains the Kagura Dance effect when using an Elemental Skill, causing the Elemental Skill DMG of the character equipping this weapon to increase by 12~24% for 16s. Max 3 stacks. At 3 stacks, this character will gain 12~24% All Elemental DMG Bonus.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "kagura-stacks", label: "Kagura Dance Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+12~24% Skill DMG per stack; +12~24% All Elem DMG at 3 stacks" },
    ],
    buffs: [
      { id: "kagura-skill-dmg", label: "Elemental Skill DMG Bonus (Kagura's Verity)", stat: "skillDmgBonus", refinementValues: [36, 45, 54, 63, 72], isTeamBuff: false, conditionKey: "kagura-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['kagura-stacks'] ?? 3); return s * [12, 15, 18, 21, 24][r - 1]; }" },
      { id: "kagura-elem-dmg", label: "All Elemental DMG Bonus (Kagura Max Stacks)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, conditionKey: "kagura-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['kagura-stacks'] ?? 3); return s >= 3 ? [12, 15, 18, 21, 24][r - 1] : 0; }" },
    ],
    signatureFor: ["yae-miko"],
  },
  {
    id: "lost-prayer-to-the-sacred-winds",
    varName: "lostPrayerToTheSacredWinds",
    name: "Lost Prayer to the Sacred Winds",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Boundless Blessing",
    passiveDesc: "Increases Movement SPD by 10%. When in battle, gain an 8~16% Elemental DMG Bonus every 4s. Max 4 stacks. Lasts until the character falls or leaves combat.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "lost-prayer-stacks", label: "On-Field Time Stacks (0-4)", control: "stacks", max: 4, defaultValue: 4, hint: "+8~16% Elemental DMG Bonus every 4s (up to +32~64%)" },
    ],
    buffs: [
      { id: "lost-prayer-elem-dmg", label: "Elemental DMG Bonus (Lost Prayer)", stat: "dmgBonus", refinementValues: [32, 40, 48, 56, 64], isTeamBuff: false, conditionKey: "lost-prayer-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['lost-prayer-stacks'] ?? 4); return s * [8, 10, 12, 14, 16][r - 1]; }" },
    ],
  },
  {
    id: "memory-of-dust",
    varName: "memoryOfDust",
    name: "Memory of Dust",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Golden Majesty",
    passiveDesc: "Increases Shield Strength by 20~40%. Scoring hits on opponents increases ATK by 4~8% for 8s. Max 5 stacks. While protected by a shield, this ATK increase effect is increased by 100%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "memory-dust-stacks", label: "Golden Majesty Stacks (0-5)", control: "stacks", max: 5, defaultValue: 5, hint: "+4~8% ATK per stack" },
      { id: "memory-dust-shielded", label: "Protected by Shield (2x ATK Buff)", control: "toggle", defaultValue: 1, hint: "Doubles ATK bonus from stacks" },
    ],
    buffs: [
      { id: "memory-dust-atk", label: "ATK% (Memory of Dust Stacks)", stat: "atk", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, conditionKey: "memory-dust-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['memory-dust-stacks'] ?? 5); const shielded = (ctx.inputs?.['memory-dust-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['memory-dust-shielded'] ?? 1) > 0; const mult = shielded ? 2 : 1; return ((s * [4, 5, 6, 7, 8][r - 1] * mult) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "skyward-atlas",
    varName: "skywardAtlas",
    name: "Skyward Atlas",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "atkPct", label: "ATK%", value: 33.1, baseValue: 7.2 },
    passiveName: "Wandering Clouds",
    passiveDesc: "Increases Elemental DMG Bonus by 12~24%. Normal Attack hits have a 50% chance to earn the favor of the clouds, actively seeking surrounding opponents to deal 160~320% ATK DMG for 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "skyward-atlas-elem-dmg", label: "All Elemental DMG Bonus (Skyward Atlas)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
    ],
  },
  {
    id: "surfs-up",
    varName: "surfsUp",
    name: "Surf's Up",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Aqua-Bound Wave",
    passiveDesc: "Max HP is increased by 20~40%. Using an Elemental Skill grants 4 stacks of Scorching Summer: increases Normal Attack DMG by 12~24% per stack. Every 1.5s after Normal Attack hits, 1 stack is lost; after triggering Vaporize on an opponent, 1 stack is added. Max 4 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "surfs-up-stacks", label: "Scorching Summer Stacks (0-4)", control: "stacks", max: 4, defaultValue: 4, hint: "+12~24% Normal Attack DMG per stack (up to +48~96%)" },
    ],
    buffs: [
      { id: "surfs-up-hp", label: "Max HP% (Surf's Up)", stat: "hp", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]" },
      { id: "surfs-up-na-dmg", label: "Normal Attack DMG Bonus (Surf's Up)", stat: "normalDmgBonus", refinementValues: [48, 60, 72, 84, 96], isTeamBuff: false, conditionKey: "surfs-up-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['surfs-up-stacks'] ?? 4); return s * [12, 15, 18, 21, 24][r - 1]; }" },
    ],
    signatureFor: ["mualani"],
  },
  {
    id: "tulaytullahs-remembrance",
    varName: "tulaytullahsRemembrance",
    name: "Tulaytullah's Remembrance",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Bygone Azure Tear",
    passiveDesc: "Normal Attack SPD is increased by 10%. After using an Elemental Skill, Normal Attack DMG increases by 4.8~9.6% each second and by 9.6~19.2% after hitting opponents. Max increase is 48~96%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "tulaytullah-na-buff", label: "Normal Attack DMG Bonus % (0-96%)", control: "stacks", max: 96, defaultValue: 48, hint: "Dynamic NA DMG buildup from skill (up to 48% at R1, up to 96% at R5)" },
    ],
    buffs: [
      { id: "tulaytullah-na-dmg", label: "Normal Attack DMG Bonus (Tulaytullah)", stat: "normalDmgBonus", refinementValues: [48, 60, 72, 84, 96], isTeamBuff: false, conditionKey: "tulaytullah-na-buff", computeCode: "(r, ctx) => { const cap = [48, 60, 72, 84, 96][r - 1]; const input = Number(ctx.inputs?.['tulaytullah-na-buff'] ?? 48); return Math.min(input, cap); }" },
    ],
    signatureFor: ["wanderer"],
  },

  // 4-STAR CATALYSTS
  {
    id: "ballad-of-the-boundless-blue",
    varName: "balladOfTheBoundlessBlue",
    name: "Ballad of the Boundless Blue",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Azure Skies",
    passiveDesc: "Within 6s after Normal or Charged Attacks hit opponents, Normal Attack DMG is increased by 8~16% and Charged Attack DMG is increased by 6~12%. Max 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "boundless-blue-stacks", label: "Azure Skies Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+8~16% NA DMG & +6~12% CA DMG per stack" },
    ],
    buffs: [
      { id: "boundless-na-dmg", label: "Normal Attack DMG Bonus (Boundless Blue)", stat: "normalDmgBonus", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "boundless-blue-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['boundless-blue-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; }" },
      { id: "boundless-ca-dmg", label: "Charged Attack DMG Bonus (Boundless Blue)", stat: "chargedDmgBonus", refinementValues: [18, 22.5, 27, 31.5, 36], isTeamBuff: false, conditionKey: "boundless-blue-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['boundless-blue-stacks'] ?? 3); return s * [6, 7.5, 9, 10.5, 12][r - 1]; }" },
    ],
  },
  {
    id: "blackcliff-agate",
    varName: "blackcliffAgate",
    name: "Blackcliff Agate",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 55.1, baseValue: 12.0 },
    passiveName: "Press the Advantage",
    passiveDesc: "After defeating an opponent, ATK is increased by 12~24% for 30s. Max 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "blackcliff-agate-stacks", label: "Defeat Stacks (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+12~24% ATK per defeat" },
    ],
    buffs: [
      { id: "blackcliff-agate-atk", label: "ATK% (Blackcliff Agate)", stat: "atk", refinementValues: [36, 45, 54, 63, 72], isTeamBuff: false, isPercent: true, conditionKey: "blackcliff-agate-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['blackcliff-agate-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "dodoco-tales",
    varName: "dodocoTales",
    name: "Dodoco Tales",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Dodoventure!",
    passiveDesc: "Normal Attack hits increase Charged Attack DMG by 16~32% for 6s. Charged Attack hits increase ATK by 8~16% for 6s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "dodoco-na-hit", label: "Normal Attack Hit (+16~32% CA DMG)", control: "toggle", defaultValue: 1, hint: "+16~32% Charged Attack DMG" },
      { id: "dodoco-ca-hit", label: "Charged Attack Hit (+8~16% ATK)", control: "toggle", defaultValue: 1, hint: "+8~16% ATK" },
    ],
    buffs: [
      { id: "dodoco-ca-dmg", label: "Charged Attack DMG Bonus (Dodoco Tales)", stat: "chargedDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, conditionKey: "dodoco-na-hit", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['dodoco-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['dodoco-na-hit'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }" },
      { id: "dodoco-atk", label: "ATK% (Dodoco Tales)", stat: "atk", refinementValues: [8, 10, 12, 14, 16], isTeamBuff: false, isPercent: true, conditionKey: "dodoco-ca-hit", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['dodoco-ca-hit'] ?? '1') === '1' || Number(ctx.inputs?.['dodoco-ca-hit'] ?? 1) > 0; return on ? ([8, 10, 12, 14, 16][r - 1] / 100) * ctx.baseAtk : 0; }" },
    ],
    signatureFor: ["klee"],
  },
  {
    id: "eye-of-perception",
    varName: "eyeOfPerception",
    name: "Eye of Perception",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Echo",
    passiveDesc: "Normal and Charged Attacks have a 50% chance to fire a Bolt of Perception dealing 240~360% ATK as DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "favonius-codex",
    varName: "favoniusCodex",
    name: "Favonius Codex",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Windfall",
    passiveDesc: "CRIT hits have a 60~100% chance to generate 1 Elemental Orb, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
    isSupport: true,
    buffType: "team",
    buffs: [],
  },
  {
    id: "flowing-purity",
    varName: "flowingPurity",
    name: "Flowing Purity",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Unfinished Masterpiece",
    passiveDesc: "When using an Elemental Skill, All Elemental DMG Bonus is increased by 8~16% for 15s and grants a Bond of Life equal to 24% of Max HP. When cleared, each 1,000 BoL cleared grants 2~4% All Elemental DMG Bonus (up to 12~24%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "flowing-purity-cleared-bol", label: "Bond of Life Cleared (+12~24% Elem DMG)", control: "toggle", defaultValue: 1, hint: "Max cleared BoL bonus" },
    ],
    buffs: [
      { id: "flowing-base-elem", label: "All Elemental DMG Bonus (Flowing Purity Base)", stat: "dmgBonus", refinementValues: [8, 10, 12, 14, 16], isTeamBuff: false, computeCode: "(r) => [8, 10, 12, 14, 16][r - 1]" },
      { id: "flowing-bol-elem", label: "All Elemental DMG Bonus from Cleared BoL", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, conditionKey: "flowing-purity-cleared-bol", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['flowing-purity-cleared-bol'] ?? '1') === '1' || Number(ctx.inputs?.['flowing-purity-cleared-bol'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }" },
    ],
  },
  {
    id: "frostbearer",
    varName: "frostbearer",
    name: "Frostbearer",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Frost Burial",
    passiveDesc: "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of forming and dropping an Everfrost Icicle dealing 80~140% AoE ATK DMG. Opponents affected by Cryo take 200~360% ATK DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "fruit-of-fulfillment",
    varName: "fruitOfFulfillment",
    name: "Fruit of Fulfillment",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Full Circle",
    passiveDesc: "Triggering an Elemental Reaction grants the Wax and Wane effect: increases Elemental Mastery by 24~36, but decreases ATK by 5%. Max 5 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "fulfillment-stacks", label: "Wax and Wane Stacks (0-5)", control: "stacks", max: 5, defaultValue: 5, hint: "+24~36 EM per stack (Total +120~180 EM, -25% ATK)" },
    ],
    buffs: [
      { id: "fulfillment-em", label: "Elemental Mastery (Fruit of Fulfillment)", stat: "em", refinementValues: [120, 135, 150, 165, 180], isTeamBuff: false, conditionKey: "fulfillment-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['fulfillment-stacks'] ?? 5); return s * [24, 27, 30, 33, 36][r - 1]; }" },
      { id: "fulfillment-atk-penalty", label: "ATK% Penalty (Fruit of Fulfillment)", stat: "atk", refinementValues: [-25, -25, -25, -25, -25], isTeamBuff: false, isPercent: true, conditionKey: "fulfillment-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['fulfillment-stacks'] ?? 5); return ((-s * 5) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    id: "mappa-mare",
    varName: "mappaMare",
    name: "Mappa Mare",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Infusion Scroll",
    passiveDesc: "Triggering an Elemental reaction grants a 8~16% Elemental DMG Bonus for 10s. Max 2 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "mappa-stacks", label: "Infusion Scroll Stacks (0-2)", control: "stacks", max: 2, defaultValue: 2, hint: "+8~16% Elemental DMG Bonus per stack" },
    ],
    buffs: [
      { id: "mappa-elem-dmg", label: "Elemental DMG Bonus (Mappa Mare)", stat: "dmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, conditionKey: "mappa-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['mappa-stacks'] ?? 2); return s * [8, 10, 12, 14, 16][r - 1]; }" },
    ],
  },
  {
    id: "oathsworn-eye",
    varName: "oathswornEye",
    name: "Oathsworn Eye",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "People of the Faltering Light",
    passiveDesc: "Increases Energy Recharge by 24~48% for 10s after using an Elemental Skill.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "oathsworn-skill-active", label: "Post-Skill ER Buff Active", control: "toggle", defaultValue: 1, hint: "+24~48% Energy Recharge" },
    ],
    buffs: [
      { id: "oathsworn-er", label: "Energy Recharge% (Oathsworn Eye)", stat: "energyRecharge", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "oathsworn-skill-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['oathsworn-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['oathsworn-skill-active'] ?? 1) > 0; return on ? [24, 30, 36, 42, 48][r - 1] : 0; }" },
    ],
  },
  {
    id: "ring-of-yaxche",
    varName: "ringOfYaxche",
    name: "Ring of Yaxche",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Echoing Chime",
    passiveDesc: "Using an Elemental Skill increases Normal Attack DMG by 0.6~1.2% for every 1,000 Max HP for 10s. Max increase is 16~32%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "yaxche-max-hp", label: "Character Max HP", control: "stacks", max: 100000, defaultValue: 35000, hint: "Max HP used for NA DMG bonus conversion" },
    ],
    buffs: [
      { id: "yaxche-na-dmg", label: "Normal Attack DMG Bonus (Ring of Yaxche)", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r, ctx) => { const hp = Number(ctx.inputs?.['yaxche-max-hp'] ?? 35000); const per1k = [0.6, 0.75, 0.9, 1.05, 1.2][r - 1]; const cap = [16, 20, 24, 28, 32][r - 1]; return Math.min((hp / 1000) * per1k, cap); }" },
    ],
  },
  {
    id: "royal-grimoire",
    varName: "royalGrimoire",
    name: "Royal Grimoire",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Focus",
    passiveDesc: "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks. A CRIT hit removes all stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "royal-grimoire-stacks", label: "Focus Stacks (0-5)", control: "stacks", max: 5, defaultValue: 3, hint: "+8~16% CRIT Rate per stack" },
    ],
    buffs: [
      { id: "royal-grimoire-crit", label: "CRIT Rate% (Royal Grimoire)", stat: "critRate", refinementValues: [24, 30, 36, 42, 48], isTeamBuff: false, conditionKey: "royal-grimoire-stacks", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['royal-grimoire-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; }" },
    ],
  },
  {
    id: "sacrificial-fragments",
    varName: "sacrificialFragments",
    name: "Sacrificial Fragments",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "em", label: "Elemental Mastery", value: 221, baseValue: 48 },
    passiveName: "Composed",
    passiveDesc: "After damaging an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
    isSupport: true,
    buffType: "self",
    buffs: [],
  },
  {
    id: "sacrificial-jade",
    varName: "sacrificialJade",
    name: "Sacrificial Jade",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 36.8, baseValue: 8.0 },
    passiveName: "Jade Precept",
    passiveDesc: "When not on the field for more than 5s, Max HP will be increased by 32~64% and Elemental Mastery will be increased by 40~80. These effects will be canceled after the wielder has been on the field for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "sac-jade-active", label: "Jade Precept Active (Off-field >5s)", control: "toggle", defaultValue: 1, hint: "+32~64% Max HP and +40~80 EM" },
    ],
    buffs: [
      { id: "sac-jade-hp", label: "Max HP% (Sacrificial Jade)", stat: "hp", refinementValues: [32, 40, 48, 56, 64], isTeamBuff: false, isPercent: true, conditionKey: "sac-jade-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['sac-jade-active'] ?? '1') === '1' || Number(ctx.inputs?.['sac-jade-active'] ?? 1) > 0; return on ? [32, 40, 48, 56, 64][r - 1] : 0; }" },
      { id: "sac-jade-em", label: "Elemental Mastery (Sacrificial Jade)", stat: "em", refinementValues: [40, 50, 60, 70, 80], isTeamBuff: false, conditionKey: "sac-jade-active", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['sac-jade-active'] ?? '1') === '1' || Number(ctx.inputs?.['sac-jade-active'] ?? 1) > 0; return on ? [40, 50, 60, 70, 80][r - 1] : 0; }" },
    ],
  },
  {
    id: "solar-pearl",
    varName: "solarPearl",
    name: "Solar Pearl",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Solar Shine",
    passiveDesc: "Normal Attack hits increase Elemental Skill and Elemental Burst DMG by 20~40% for 6s. Elemental Skill or Burst hits increase Normal Attack DMG by 20~40% for 6s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "solar-na-hit", label: "Normal Attack Hit (+20~40% Skill/Burst DMG)", control: "toggle", defaultValue: 1, hint: "+20~40% Skill and Burst DMG" },
      { id: "solar-skill-hit", label: "Skill/Burst Hit (+20~40% NA DMG)", control: "toggle", defaultValue: 1, hint: "+20~40% Normal Attack DMG" },
    ],
    buffs: [
      { id: "solar-skill-dmg", label: "Elemental Skill DMG Bonus (Solar Pearl)", stat: "skillDmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, conditionKey: "solar-na-hit", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['solar-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['solar-na-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }" },
      { id: "solar-burst-dmg", label: "Elemental Burst DMG Bonus (Solar Pearl)", stat: "burstDmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, conditionKey: "solar-na-hit", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['solar-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['solar-na-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }" },
      { id: "solar-na-dmg", label: "Normal Attack DMG Bonus (Solar Pearl)", stat: "normalDmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, conditionKey: "solar-skill-hit", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['solar-skill-hit'] ?? '1') === '1' || Number(ctx.inputs?.['solar-skill-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }" },
    ],
  },
  {
    id: "the-widsith",
    varName: "theWidsith",
    name: "The Widsith",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 55.1, baseValue: 12.0 },
    passiveName: "Debut",
    passiveDesc: "When a character takes the field, one of three random theme songs is gained for 10s: Recitative (+60~120% ATK), Aria (+48~96% All Elemental DMG), or Intermezzo (+240~480 Elemental Mastery). Can only occur once every 30s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "widsith-song", label: "Active Theme Song (0=None, 1=Recitative ATK, 2=Aria Elem, 3=Intermezzo EM)", control: "stacks", max: 3, defaultValue: 2, hint: "Select active random song buff" },
    ],
    buffs: [
      { id: "widsith-atk", label: "ATK% (The Widsith Recitative)", stat: "atk", refinementValues: [60, 75, 90, 105, 120], isTeamBuff: false, isPercent: true, conditionKey: "widsith-song", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['widsith-song'] ?? 2); return s === 1 ? ([60, 75, 90, 105, 120][r - 1] / 100) * ctx.baseAtk : 0; }" },
      { id: "widsith-elem-dmg", label: "All Elemental DMG Bonus (The Widsith Aria)", stat: "dmgBonus", refinementValues: [48, 60, 72, 84, 96], isTeamBuff: false, conditionKey: "widsith-song", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['widsith-song'] ?? 2); return s === 2 ? [48, 60, 72, 84, 96][r - 1] : 0; }" },
      { id: "widsith-em", label: "Elemental Mastery (The Widsith Intermezzo)", stat: "em", refinementValues: [240, 300, 360, 420, 480], isTeamBuff: false, conditionKey: "widsith-song", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['widsith-song'] ?? 2); return s === 3 ? [240, 300, 360, 420, 480][r - 1] : 0; }" },
    ],
  },
  {
    id: "wandering-evenstar",
    varName: "wanderingEvenstar",
    name: "Wandering Evenstar",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Wildling's Night Song",
    passiveDesc: "The equipping character gains 24~48% of their Elemental Mastery as extra ATK for 12s. Nearby party members gain 30% of this buff for the same duration.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      { id: "evenstar-wielder-em", label: "Evenstar Wielder EM", control: "stacks", max: 2000, defaultValue: 800, hint: "Wielder's EM used for party ATK sharing" },
    ],
    buffs: [
      { id: "evenstar-party-atk", label: "Party ATK from Wielder EM (Wandering Evenstar)", description: "Party members gain 30% of wielder's EM-to-ATK conversion", stat: "atk", refinementValues: [7.2, 9.0, 10.8, 12.6, 14.4], isTeamBuff: true, computeCode: "(r, ctx) => { const em = Number(ctx.inputs?.['evenstar-wielder-em'] ?? 800); const ratio = [0.24 * 0.3, 0.30 * 0.3, 0.36 * 0.3, 0.42 * 0.3, 0.48 * 0.3][r - 1]; return em * ratio; }" },
    ],
  },

  // 3-STAR, 2-STAR, 1-STAR CATALYSTS
  {
    id: "emerald-orb",
    varName: "emeraldOrb",
    name: "Emerald Orb",
    type: "Catalyst",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "em", label: "Elemental Mastery", value: 94, baseValue: 20 },
    passiveName: "Rapid",
    passiveDesc: "Upon causing an Electro-Charged, Superconduct, Overloaded, Bloom, or Hydro-infused Swirl reaction, increases ATK by 20~40% for 12s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "emerald-orb-atk", label: "ATK% (Emerald Orb)", stat: "atk", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk" },
    ],
  },
  {
    id: "magic-guide",
    varName: "magicGuide",
    name: "Magic Guide",
    type: "Catalyst",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "em", label: "Elemental Mastery", value: 187, baseValue: 41 },
    passiveName: "Bane of Storm and Tide",
    passiveDesc: "Increases DMG against opponents affected by Hydro or Electro by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      { id: "magic-guide-target", label: "Target Affected by Hydro/Electro", control: "toggle", defaultValue: 1, hint: "+12~24% All DMG bonus" },
    ],
    buffs: [
      { id: "magic-guide-dmg", label: "All DMG Bonus (Magic Guide)", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, conditionKey: "magic-guide-target", computeCode: "(r, ctx) => { const on = (ctx.inputs?.['magic-guide-target'] ?? '1') === '1' || Number(ctx.inputs?.['magic-guide-target'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }" },
    ],
  },
  {
    id: "otherworldly-story",
    varName: "otherworldlyStory",
    name: "Otherworldly Story",
    type: "Catalyst",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 39.0, baseValue: 8.5 },
    passiveName: "Energy Shower",
    passiveDesc: "Each Elemental Orb or Particle collected restores 1~2% HP.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "twin-nephrite",
    varName: "twinNephrite",
    name: "Twin Nephrite",
    type: "Catalyst",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 15.6, baseValue: 3.4 },
    passiveName: "Guerilla Tactics",
    passiveDesc: "Defeating an opponent increases Movement SPD and ATK by 12~20% for 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "twin-nephrite-atk", label: "ATK% (Twin Nephrite)", stat: "atk", refinementValues: [12, 14, 16, 18, 20], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([12, 14, 16, 18, 20][r - 1] / 100) * ctx.baseAtk" },
    ],
  },
  {
    id: "pocket-grimoire",
    varName: "pocketGrimoire",
    name: "Pocket Grimoire",
    type: "Catalyst",
    rarity: 2,
    baseAtk: 243,
    lvl1BaseAtk: 33,
    passiveName: "",
    passiveDesc: "A carefully compiled grimoire containing various elemental notes.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "apprentices-notes",
    varName: "apprenticesNotes",
    name: "Apprentice's Notes",
    type: "Catalyst",
    rarity: 1,
    baseAtk: 185,
    lvl1BaseAtk: 23,
    passiveName: "",
    passiveDesc: "Notes left behind by an apprentice studying elemental magic.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
];

function generateCatalystFiles() {
  const outDir = path.resolve("src/data/registry/weapons/catalysts");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const exportNames: string[] = [
    "aThousandFloatingDreams",
    "thrillingTalesOfDragonSlayers",
    "hakushinRing",
    "prototypeAmber",
    "tomeOfTheEternalFlow",
  ];

  for (const w of CATALYSTS_DATA) {
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
  type: "Catalyst",
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

  // Update catalysts/index.ts
  const allCatalystImports = [
    'import { aThousandFloatingDreams } from "./a-thousand-floating-dreams";',
    'import { thrillingTalesOfDragonSlayers } from "./thrilling-tales-of-dragon-slayers";',
    'import { hakushinRing } from "./hakushin-ring";',
    'import { prototypeAmber } from "./prototype-amber";',
    'import { tomeOfTheEternalFlow } from "./tome-of-the-eternal-flow";',
    ...CATALYSTS_DATA.map((w) => `import { ${w.varName} } from "./${w.id}";`),
  ].join("\n");

  const indexContent = `${allCatalystImports}
import type { WeaponConfig } from "../types";

export {
  ${exportNames.join(",\n  ")},
};

export const CATALYSTS: WeaponConfig[] = [
  ${exportNames.join(",\n  ")},
];
`;

  fs.writeFileSync(path.join(outDir, "index.ts"), indexContent, "utf-8");
  console.log(`Updated catalysts/index.ts with ${exportNames.length} catalysts!`);
}

generateCatalystFiles();
