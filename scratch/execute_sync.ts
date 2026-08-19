import fs from "fs";
import path from "path";
import { WEAPONS } from "../src/data/registry/weapons";
import { ALL_246_WEAPONS } from "./master_definitions";
import { USER_246_NAMES, toSlug, toVarName } from "./sync_exact_246";

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Master weapon definitions map (custom definitions for new/missing weapons)
const masterDefsMap = new Map<string, any>();
for (const w of ALL_246_WEAPONS) {
  masterDefsMap.set(norm(w.name), w);
}

// Read definitions from build_full_registry EXTRA_4_STAR_WEAPONS
const extra4Star = [
  {
    name: "The Catch",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Shanty",
    passiveDesc: "Increases Elemental Burst DMG by 16~32% and Elemental Burst CRIT Rate by 6~12%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "catch-burst-dmg", label: "Elemental Burst DMG Bonus (The Catch)", stat: "burstDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
      { id: "catch-burst-crit", label: "Elemental Burst CRIT Rate% (The Catch)", stat: "critRate", refinementValues: [6, 7.5, 9, 10.5, 12], isTeamBuff: false, computeCode: "(r) => [6, 7.5, 9, 10.5, 12][r - 1]" },
    ],
  },
  {
    name: "Ultimate Overlord's Mega Magic Sword",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Melusine's Blessing",
    passiveDesc: "ATK is increased by 12~24%. The Melusines you have helped in Merusea Village further increase your ATK by up to an additional 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [{ id: "overlord-melusines-helped", label: "Melusines Helped (0-24)", control: "stacks", max: 24, defaultValue: 24, hint: "+0.5~1.0% additional ATK per Melusine helped (up to +12~24%)" }],
    buffs: [
      { id: "overlord-base-atk", label: "ATK% (Mega Magic Sword Base)", stat: "atk", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk" },
      { id: "overlord-melusine-atk", label: "ATK% (Melusines Helped)", stat: "atk", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, isPercent: true, conditionKey: "overlord-melusines-helped", computeCode: "(r, ctx) => { const count = Number(ctx.inputs?.['overlord-melusines-helped'] ?? 24); const cap = [12, 15, 18, 21, 24][r - 1]; const perMelusine = cap / 24; return ((Math.min(count, 24) * perMelusine) / 100) * ctx.baseAtk; }" },
    ],
  },
  {
    name: "Portable Power Saw",
    type: "Claymore",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "hpPct", label: "HP%", value: 55.1, baseValue: 12.0 },
    passiveName: "Sea Shanty",
    passiveDesc: "When the wielder is healed or heals all party members, gain a Stoic's Symbol for 30s (max 3). Using an Elemental Skill or Burst consumes all symbols to grant 40~80 EM per symbol for 10s and restore 2~4 Energy per symbol.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [{ id: "saw-symbols", label: "Stoic Symbols Consumed (0-3)", control: "stacks", max: 3, defaultValue: 3, hint: "+40~80 EM per symbol" }],
    buffs: [
      { id: "saw-em", label: "Elemental Mastery (Portable Power Saw)", stat: "em", refinementValues: [120, 150, 180, 210, 240], isTeamBuff: false, conditionKey: "saw-symbols", computeCode: "(r, ctx) => { const s = Number(ctx.inputs?.['saw-symbols'] ?? 3); return s * [40, 50, 60, 70, 80][r - 1]; }" },
    ],
  },
  {
    name: "Prototype Archaic",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Crush",
    passiveDesc: "On hit, Normal or Charged Attacks have a 50% chance to deal an additional 240~480% ATK DMG to opponents in a small AoE. Can only occur once every 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    name: "Sword of Narzissenkreuz Pneuma",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Hero's Blade: Pneuma",
    passiveDesc: "When the equipping character does not have an Arkhe: When Normal, Charged, or Plunging Attacks hit, a Pneuma or Ousia energy blast will be unleashed, dealing 160~320% of ATK as DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    name: "Blackmarrow Lantern",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Marrow Flame",
    passiveDesc: "Increases Elemental Skill DMG by 16~32% for 10s after triggering an Elemental Reaction.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "blackmarrow-skill-dmg", label: "Elemental Skill DMG Bonus", stat: "skillDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Blade of Atonement",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Atonement",
    passiveDesc: "Normal Attack DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "atonement-na-dmg", label: "Normal Attack DMG Bonus", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Clash of Kings",
    type: "Sword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Royal Clash",
    passiveDesc: "Increases Normal and Charged Attack DMG by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "clash-na-ca-dmg", label: "Normal/Charged Attack DMG Bonus", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Covenant of Frost and Snow",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 34.5, baseValue: 7.5 },
    passiveName: "Frost Covenant",
    passiveDesc: "Physical DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "frost-covenant-phys", label: "Physical DMG Bonus", stat: "physicalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Dawning Frost",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 18.4, baseValue: 4.0 },
    passiveName: "Frost Dawn",
    passiveDesc: "Cryo DMG is increased by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "dawning-frost-cryo", label: "Cryo DMG Bonus", stat: "cryoDmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
    ],
  },
  {
    name: "Echoes of the Heart",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Heart Echo",
    passiveDesc: "Elemental Skill DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "echoes-heart-skill", label: "Elemental Skill DMG Bonus", stat: "skillDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Emberwell",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Ember Surge",
    passiveDesc: "Increases Pyro DMG Bonus by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "emberwell-pyro-dmg", label: "Pyro DMG Bonus", stat: "pyroDmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
    ],
  },
  {
    name: "Etherlight Spindlelute",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Spindle Melody",
    passiveDesc: "Elemental Burst DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "spindlelute-burst-dmg", label: "Elemental Burst DMG Bonus", stat: "burstDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Flame-Forged Insight",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Flame Insight",
    passiveDesc: "Increases Normal and Charged Attack DMG by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "flame-insight-na-ca", label: "Normal/Charged Attack DMG Bonus", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Forged by the Golden Melody",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 55.1, baseValue: 12.0 },
    passiveName: "Golden Forge",
    passiveDesc: "Increases All Elemental DMG Bonus by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "golden-melody-elem", label: "All Elemental DMG Bonus", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
    ],
  },
  {
    name: "Frostbreath",
    type: "Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Frost Breath",
    passiveDesc: "Increases Cryo DMG Bonus by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "frostbreath-cryo", label: "Cryo DMG Bonus", stat: "cryoDmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
    ],
  },
  {
    name: "Heretic's Molten Blade",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Molten Heresy",
    passiveDesc: "Elemental Skill DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "molten-blade-skill", label: "Elemental Skill DMG Bonus", stat: "skillDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Jade Vista",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Jade Sight",
    passiveDesc: "Increases Max HP by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "jade-vista-hp", label: "HP%", stat: "hp", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Master Key",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Lockpick",
    passiveDesc: "Using an Elemental Burst increases ATK by 16~32% for 12s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "master-key-atk", label: "ATK%", stat: "atk", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, computeCode: "(r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk" },
    ],
  },
  {
    name: "Moonweaver's Dawn",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Moonweave",
    passiveDesc: "Normal and Charged Attack DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "moonweaver-na-ca", label: "Normal/Charged Attack DMG Bonus", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Prospector's Shovel",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "defPct", label: "DEF%", value: 51.7, baseValue: 11.3 },
    passiveName: "Tunneler",
    passiveDesc: "Increases DEF by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "prospector-shovel-def", label: "DEF%", stat: "def", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Rainbow Serpent's Rain Bow",
    type: "Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Prismatic Rain",
    passiveDesc: "Triggering an Elemental Reaction increases All Elemental DMG Bonus by 12~24% for 8s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "rainbow-serpent-elem", label: "All Elemental DMG Bonus", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
    ],
  },
  {
    name: "Sacrificer's Staff",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Sacrificial Offering",
    passiveDesc: "Increases Max HP by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "sacrificer-staff-hp", label: "HP%", stat: "hp", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, isPercent: true, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Sequence of Solitude",
    type: "Sword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 36.8, baseValue: 8.0 },
    passiveName: "Solitude",
    passiveDesc: "Increases Normal and Charged Attack DMG by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "solitude-na-ca-dmg", label: "Normal/Charged Attack DMG Bonus", stat: "normalDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Serenity's Call",
    type: "Claymore",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Peaceful Mind",
    passiveDesc: "Elemental Burst DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "serenity-burst-dmg", label: "Elemental Burst DMG Bonus", stat: "burstDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
  {
    name: "Snare Hook",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Snaring Strike",
    passiveDesc: "Charged Attack DMG is increased by 20~40%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "snare-hook-ca-dmg", label: "Charged Attack DMG Bonus", stat: "chargedDmgBonus", refinementValues: [20, 25, 30, 35, 40], isTeamBuff: false, computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]" },
    ],
  },
  {
    name: "Song of the Vigil",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Vigilant Song",
    passiveDesc: "All Elemental DMG Bonus is increased by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "vigil-elem-dmg", label: "All Elemental DMG Bonus", stat: "dmgBonus", refinementValues: [12, 15, 18, 21, 24], isTeamBuff: false, computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]" },
    ],
  },
  {
    name: "Tamayuratei no Ohanashi",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Fleeting Story",
    passiveDesc: "Triggering an Elemental Reaction increases Elemental Skill DMG by 16~32% for 8s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      { id: "tamayuratei-skill-dmg", label: "Elemental Skill DMG Bonus", stat: "skillDmgBonus", refinementValues: [16, 20, 24, 28, 32], isTeamBuff: false, computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]" },
    ],
  },
];

for (const w of extra4Star) {
  masterDefsMap.set(norm(w.name), w);
}

// Map existing WEAPONS in codebase
const codebaseMap = new Map<string, any>();
for (const w of WEAPONS) {
  codebaseMap.set(norm(w.name), w);
}

// Generate code for a weapon
function generateWeaponCode(w: any): string {
  const buffCode = (w.buffs || [])
    .map(
      (b: any) => `    {
      id: "${b.id}",
      label: "${b.label}",
      ${b.description ? `description: "${b.description}",\n      ` : ""}stat: "${b.stat}",
      refinementValues: [${b.refinementValues.join(", ")}],
      isTeamBuff: ${b.isTeamBuff},
      ${b.isPercent ? "isPercent: true,\n      " : ""}${b.conditionKey ? `conditionKey: "${b.conditionKey}",\n      ` : ""}${b.computeCode ? `compute: ${b.computeCode},` : (b.compute ? `compute: ${b.compute.toString()},` : "")}
    }`
    )
    .join(",\n");

  const mechanicCode = w.mechanicDefs?.length
    ? `  mechanicDefs: [\n` +
      w.mechanicDefs
        .map(
          (m: any) => `    {
      id: "${m.id}",
      label: "${m.label}",
      control: "${m.control}",
      ${m.defaultValue !== undefined ? `defaultValue: ${typeof m.defaultValue === "string" ? `"${m.defaultValue}"` : m.defaultValue},\n      ` : ""}${m.max !== undefined ? `max: ${m.max},\n      ` : ""}${m.min !== undefined ? `min: ${m.min},\n      ` : ""}${m.hint ? `hint: "${m.hint}",\n    ` : ""}}`
        )
        .join(",\n") +
      `\n  ],`
    : "";

  return `import type { WeaponConfig } from "../types";

export const ${w.varName}: WeaponConfig = {
  id: "${w.id}",
  name: "${w.name.replace(/"/g, '\\"')}",
  type: "${w.type}",
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
  isSupport: ${w.isSupport || false},
  buffType: "${w.buffType || "self"}",
${mechanicCode ? mechanicCode + "\n" : ""}  buffs: [
${buffCode}
  ],
  ${w.signatureFor ? `signatureFor: [${w.signatureFor.map((s: string) => `"${s}"`).join(", ")}],` : ""}
};
`;
}

// Category folder map
const categoryPlural = {
  Sword: "swords",
  Claymore: "claymores",
  Polearm: "polearms",
  Bow: "bows",
  Catalyst: "catalysts",
} as const;

// Track generated files per category
const categoryExports: Record<string, { varName: string; id: string }[]> = {
  swords: [],
  claymores: [],
  polearms: [],
  bows: [],
  catalysts: [],
};

const processedSlugs = new Set<string>();

// Step 1: Clean out existing category folders of stale files
const baseDir = path.resolve("src/data/registry/weapons");
for (const cat of ["swords", "claymores", "polearms", "bows", "catalysts"]) {
  const dir = path.join(baseDir, cat);
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f !== "index.ts") {
      fs.unlinkSync(path.join(dir, f));
    }
  }
}

// Step 2: Write all 246 weapons
for (const rawName of USER_246_NAMES) {
  const n = norm(rawName);
  const id = toSlug(rawName);
  const varName = toVarName(rawName);

  let def = masterDefsMap.get(n) || codebaseMap.get(n);
  if (!def) {
    throw new Error(`Definition not found for: ${rawName}`);
  }

  // Ensure id and varName are set properly
  def = {
    ...def,
    id,
    varName,
    name: rawName, // Exact display name
  };

  const catFolder = categoryPlural[def.type as keyof typeof categoryPlural];
  if (!catFolder) {
    throw new Error(`Unknown type ${def.type} for ${rawName}`);
  }

  const filePath = path.join(baseDir, catFolder, `${id}.ts`);
  const code = generateWeaponCode(def);
  fs.writeFileSync(filePath, code, "utf-8");

  categoryExports[catFolder].push({ varName, id });
  processedSlugs.add(id);
}

// Step 3: Write category index.ts files
for (const [cat, items] of Object.entries(categoryExports)) {
  const catUpper = cat.toUpperCase();
  const imports = items.map(i => `import { ${i.varName} } from "./${i.id}";`).join("\n");
  const names = items.map(i => i.varName).join(",\n  ");

  const indexContent = `${imports}
import type { WeaponConfig } from "../types";

export {
  ${names},
};

export const ${catUpper}: WeaponConfig[] = [
  ${names},
];
`;
  fs.writeFileSync(path.join(baseDir, cat, "index.ts"), indexContent, "utf-8");
  console.log(`Updated ${cat}/index.ts with ${items.length} weapons.`);
}

console.log(`Total weapons synced: ${processedSlugs.size}`);
