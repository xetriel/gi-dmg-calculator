import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const xiao: CharacterConfig = {
  id: "xiao",
  name: "Xiao",
  rarity: 5,
  element: "Anemo",
  weapon: "Polearm",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate%", maxValue: 19.2 },
  dmgBonusLabel: "Anemo DMG Bonus%",
  stats: coreStats("CRIT Rate%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Whirlwind Thrust",
      hits: [
        { key: "1-hit-1", name: "1-Hit DMG (Hit 1)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "1-hit-2", name: "1-Hit DMG (Hit 2)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit-1", name: "4-Hit DMG (Hit 1)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit-2", name: "4-Hit DMG (Hit 2)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "6-hit", name: "6-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged", name: "Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Lemniscatic Wind Cycling",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Bane of All Evil",
      hits: []
    }
  ],
  mechanicDefs: [
    {
      id: "burst-active",
      label: "Bane of All Evil (Yaksha's Mask / Anemo Infusion + Plunging/NA/CA DMG Bonus)",
      control: "toggle",
      defaultValue: 1,
      hint: "Converts Normal, Charged, and Plunging Attacks to Anemo DMG and grants Plunging/NA/CA DMG Bonus %."
    },
    {
      id: "a1-dmg-stacks",
      label: "A1 Conqueror of Evil: Tamer of Demons (0–5 Stacks, +5% to +25% DMG Bonus)",
      control: "stacks",
      max: 5,
      defaultValue: 5,
      hint: "A1: While under Bane of All Evil, grants +5% DMG Bonus, increasing by +5% every 3s (max +25%)."
    },
    {
      id: "a4-skill-stacks",
      label: "A4 Dissolution Eon: Heaven Fall (0–3 Stacks, +15% to +45% Skill DMG Bonus)",
      control: "stacks",
      max: 3,
      defaultValue: 0,
      hint: "A4: Using Lemniscatic Wind Cycling increases DMG of subsequent uses by +15% for 7s (max +45%)."
    },
    {
      id: "c2-off-field-er",
      label: "C2 Annihilation Eon: Blossom of Kaleidos (+25% Off-Field ER)",
      control: "toggle",
      defaultValue: 0,
      hint: "C2: When in party but not on field, Xiao's Energy Recharge is increased by 25%."
    },
    {
      id: "c4-low-hp-def",
      label: "C4 Transcendent Eon: Cataclysm (+100% Base DEF when HP < 50%)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: When Xiao's HP falls below 50%, he gains a 100% DEF bonus."
    }
  ],
  mechanics: [
    "Bane of All Evil (Burst): Converts Normal, Charged, and Plunging Attacks to Anemo DMG and grants Plunging/NA/CA DMG Bonus.",
    "Tamer of Demons (A1): Increases DMG dealt by 5% upon Burst activation, plus 5% every 3s (max +25% DMG Bonus).",
    "Dissolution Eon: Heaven Fall (A4): Skill uses increase DMG of subsequent Skill uses by +15% for 7s (max 3 stacks = +45%).",
    "Dissolution Eon: Destroyer of Worlds (C1): Increases Lemniscatic Wind Cycling charges by 1.",
    "Annihilation Eon: Blossom of Kaleidos (C2): When off-field, Xiao's Energy Recharge increases by 25%.",
    "Transcendent Eon: Cataclysm (C4): When HP falls below 50%, gains +100% DEF.",
    "Conqueror of Evil: Guardian Yaksha (C6): While under Bane of All Evil, hitting 2+ opponents with Plunging Attack grants 1 Skill charge and resets Skill CD for 1s."
  ],
  constellations: [
    {
      level: 1,
      name: "Dissolution Eon: Destroyer of Worlds",
      description: "Increases Lemniscatic Wind Cycling's charges by 1.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Annihilation Eon: Blossom of Kaleidos",
      description: "When in party but not on the field, Xiao's Energy Recharge is increased by 25%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Conqueror of Evil: Wrath Deity",
      description: "Increases the Level of Lemniscatic Wind Cycling by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Transcendent Eon: Cataclysm",
      description: "When Xiao's HP falls below 50%, he gains a 100% DEF Bonus.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Evolution Eon: Origin of Ignorance",
      description: "Increases the Level of Bane of All Evil by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Conqueror of Evil: Guardian Yaksha",
      description: "While under the effects of Bane of All Evil, hitting at least 2 opponents with a Plunging Attack grants 1 charge of Lemniscatic Wind Cycling, and for the next 1s, he can use Lemniscatic Wind Cycling while ignoring its CD.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Pure on-field Anemo plunging hypercarry. Provides team presence, Anemo resonance, and team CRIT passthrough.",
    buffExplanations: [
      {
        name: "Anemo Plunge Hypercarry",
        brief: "On-Field Anemo Hypercarry",
        full: "Xiao unleashes continuous high-flying Anemo plunging attacks during Bane of All Evil without conferring buffs to party members.",
        category: "elemental",
      },
    ],
    statFields: [
      { key: "atk.base", label: "Base ATK", defaultValue: "900" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "70" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "180" },
    ],
    buffs: [],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Base ATK", value: fmt(ctx.baseAtk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
