import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const kaveh: CharacterConfig = {
  id: "kaveh",
  name: "Kaveh",
  rarity: 4,
  element: "Dendro",
  weapon: "Claymore",
  scalingSource: "atk",
  ascensionStat: { label: "Elemental Mastery", maxValue: 96 },
  dmgBonusLabel: "Dendro DMG Bonus%",
  stats: coreStats("Elemental Mastery"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Schematic Setup",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-spin", name: "Charged Attack Spin DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-final", name: "Charged Attack Final DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Artistic Ingenuity",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill", element: "Dendro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Painted Dome",
      hits: [
        { key: "burst-dmg", name: "Burst Skill DMG", scaling: "atk", hitCategory: "burst", element: "Dendro" },
        { key: "bloom-dmg-bonus", name: "Bloom DMG Bonus (%)", scaling: "atk", hitCategory: "burst", kind: "buff" },
        { key: "c6-pairidaeza", name: "Pairidaeza's Light DMG (C6)", scaling: "atk", hitCategory: "burst", element: "Dendro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "burst-painted-dome",
      label: "Painted Dome State (Dendro Infusion & Bloom DMG Bonus)",
      control: "toggle",
      defaultValue: 1,
      hint: "Painted Dome converts Normal, Charged, and Plunging Attacks to Dendro DMG, increases attack AoE, and grants a Bloom DMG Bonus."
    },
    {
      id: "a4-em-stacks",
      label: "A4 A Craftsman's Curious Conceptions (0–4 Stacks, +25 EM/stack)",
      control: "stacks",
      max: 4,
      defaultValue: 4,
      hint: "A4: Hits during Painted Dome increase Kaveh's Elemental Mastery by 25 per stack (max 4 stacks = +100 EM)."
    },
    {
      id: "c1-buff",
      label: "C1 Sublime Salutations (+50% Dendro RES & +50% Healing Received)",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: Within 3.5s after using Artistic Ingenuity, Kaveh gains +50% Dendro RES and +50% Healing Received."
    },
    {
      id: "c4-bloom-buff",
      label: "C4 Feast of Apadana (+60% Bloom DMG Bonus)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: Dendro Cores created via Bloom reactions triggered by Kaveh deal +60% DMG when they burst."
    }
  ],
  mechanics: [
    "Painted Dome: Converts Normal, Charged, and Plunging Attacks to non-overrideable Dendro DMG, increases attack AoE, and boosts party Bloom DMG.",
    "An Architect's Undertaking (A1): Heals Kaveh HP equal to 300% of his EM when hit by Dendro Cores (0.4s CD).",
    "A Craftsman's Curious Conceptions (A4): Hits during Painted Dome increase Kaveh's EM by 25 per stack (max 4 stacks = +100 EM).",
    "Pairidaeza's Dreams (C6): Normal, Charged, and Plunging hits during Painted Dome trigger Pairidaeza's Light dealing 61.8% of ATK as AoE Dendro DMG."
  ],
  constellations: [
    {
      level: 1,
      name: "Sublime Salutations",
      description: "Within 3.5s after using Artistic Ingenuity, Kaveh's Dendro RES is increased by 50% and his Healing Received is increased by 50%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Grace of Royal Roads",
      description: "Kaveh's Normal Attack SPD is increased by 15% during Painted Dome.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Profferings of Dur Untash",
      description: "Increases the Level of Painted Dome by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "Feast of Apadana",
      description: "Dendro Cores created by party members via Bloom reactions triggered by Kaveh deal 60% more DMG when they burst.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Treasures of Bonkhanak",
      description: "Increases the Level of Artistic Ingenuity by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "Pairidaeza's Dreams",
      description: "When Kaveh's Normal, Charged, or Plunging Attacks hit opponents during Painted Dome, it will trigger Pairidaeza's Light at the opponent's position, dealing 61.8% of Kaveh's ATK as AoE Dendro DMG and causing all Dendro Cores within its AoE to burst.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Dendro Bloom enabler and rupture driver. Painted Dome boosts party Bloom reaction DMG (+27.5%), and C4 Feast of Apadana grants +60% Bloom DMG to Dendro Cores.",
    buffExplanations: [
      {
        name: "Painted Dome (Burst)",
        brief: "+27.5% Bloom DMG Bonus",
        full: "Painted Dome increases the Bloom reaction DMG dealt by all nearby party members by +27.5%.",
        category: "dmg_bonus",
      },
      {
        name: "C4: Feast of Apadana",
        brief: "+60% Bloom DMG Bonus",
        full: "Dendro Cores created by party members via Bloom deal 60% more DMG when they burst.",
        category: "dmg_bonus",
      },
    ],
    statFields: [
      { key: "em", label: "Elemental Mastery", defaultValue: "600" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "lunarBloomDmgBonus",
        label: "Bloom DMG (Kaveh Burst & C4)",
        compute: (ctx) => {
          const base = 27.5;
          const c4 = ctx.constellationLevel >= 4 ? 60 : 0;
          return base + c4;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "EM", value: fmt(ctx.em) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
