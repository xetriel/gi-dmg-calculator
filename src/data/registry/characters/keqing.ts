import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const keqing: CharacterConfig = {
  id: "keqing",
  name: "Keqing",
  rarity: 5,
  element: "Electro",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG%", maxValue: 38.4 },
  dmgBonusLabel: "Electro DMG Bonus%",
  stats: coreStats("CRIT DMG%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Yunlai Swordsmanship",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit-a", name: "4-Hit A DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit-b", name: "4-Hit B DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-1", name: "Charged Attack 1-Hit DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2", name: "Charged Attack 2-Hit DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Stellar Restoration",
      hits: [
        { key: "stiletto-dmg", name: "Lightning Stiletto DMG", scaling: "atk", hitCategory: "skill", element: "Electro" },
        { key: "slashing-dmg", name: "Slashing DMG", scaling: "atk", hitCategory: "skill", element: "Electro" },
        { key: "thunderclap-slash", name: "Thunderclap Slash DMG (each)", scaling: "atk", hitCategory: "skill", element: "Electro" },
        { key: "c1-thundering-might", name: "Thundering Might DMG (C1)", scaling: "atk", hitCategory: "skill", element: "Electro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Starward Sword",
      hits: [
        { key: "burst-initial", name: "Skill DMG", scaling: "atk", hitCategory: "burst", element: "Electro" },
        { key: "burst-slash", name: "Consecutive Slash DMG (each)", scaling: "atk", hitCategory: "burst", element: "Electro" },
        { key: "burst-final", name: "Last Attack DMG", scaling: "atk", hitCategory: "burst", element: "Electro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "a1-electro-infusion",
      label: "Thundering Penance Electro Infusion",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: Recasting Stellar Restoration while a Stiletto is present infuses weapon with Electro for 5s."
    },
    {
      id: "a4-crit-er-buff",
      label: "Aristocratic Dignity Burst Buff (+15% CRIT Rate & +15% ER)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: Casting Starward Sword increases CRIT Rate by 15% and Energy Recharge by 15% for 8s."
    },
    {
      id: "c4-atk-buff",
      label: "C4 Attunement (+25% ATK)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: Triggering an Electro-related reaction increases ATK by 25% for 10s."
    },
    {
      id: "c6-electro-stacks",
      label: "C6 Tenacious Star (0–4 Stacks, +6% Electro DMG/stack)",
      control: "stacks",
      max: 4,
      defaultValue: 4,
      hint: "C6: Initiating NA, CA, Skill, or Burst grants +6% Electro DMG Bonus for 8s (up to 4 stacks = +24%)."
    }
  ],
  mechanics: [
    "Thundering Penance (A1): Recasting Stellar Restoration while a Stiletto is present infuses weapon with Electro for 5s.",
    "Aristocratic Dignity (A4): Casting Starward Sword increases CRIT Rate by 15% and Energy Recharge by 15% for 8s.",
    "Thundering Might (C1): Recasting Stellar Restoration while a Stiletto is present deals 50% ATK as AoE Electro DMG at start point and terminus.",
    "Attunement (C4): Triggering an Electro-related reaction increases ATK by 25% for 10s.",
    "Tenacious Star (C6): NA, CA, Skill, and Burst independent actions grant +6% Electro DMG Bonus for 8s (max 4 stacks = +24%)."
  ],
  constellations: [
    {
      level: 1,
      name: "Thundering Might",
      description: "Recasting Stellar Restoration while a Lightning Stiletto is present causes Keqing to deal 50% of her ATK as AoE Electro DMG at the start point and terminus of her Blink.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Keen Extraction",
      description: "When Keqing's Normal and Charged Attacks hit opponents affected by Electro, they have a 50% chance of producing an Elemental Particle (5s CD).",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Foreseen Reformation",
      description: "Increases the Level of Starward Sword by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "Attunement",
      description: "For 10s after Keqing triggers an Electro-related Elemental Reaction, her ATK is increased by 25%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Beckoning Stars",
      description: "Increases the Level of Stellar Restoration by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "Tenacious Star",
      description: "When initiating a Normal Attack, a Charged Attack, Elemental Skill, or Elemental Burst, Keqing gains a 6% Electro DMG Bonus for 8s. Effects triggered by these actions are independent.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Pure on-field Electro sword carry specializing in swift Blink attacks and multi-hit Bursts. Provides team presence, Electro resonance, and team CRIT passthrough.",
    buffExplanations: [
      {
        name: "Electro Hypercarry",
        brief: "On-Field Electro Hypercarry",
        full: "Keqing infuses her sword with Electro via Stellar Restoration and casts Starward Sword for rapid Electro DMG, without granting party buffs.",
        category: "elemental",
      },
    ],
    statFields: [
      { key: "atk.base", label: "Base ATK", defaultValue: "850" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "65" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "170" },
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
