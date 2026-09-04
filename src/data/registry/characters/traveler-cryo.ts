import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const travelerCryo: CharacterConfig = {
  id: "traveler-cryo",
  name: "Traveler (Cryo)",
  rarity: 5,
  element: "Cryo",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "ATK%", maxValue: 24.0 },
  dmgBonusLabel: "Cryo DMG Bonus%",
  stats: coreStats("ATK%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Foreign Frostglint",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-1", name: "Charged Attack (Hit 1)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2-aether", name: "Charged Attack (Hit 2 — Aether)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2-lumine", name: "Charged Attack (Hit 2 — Lumine)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Ice Fog Piercer",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill", element: "Cryo" },
        { key: "ice-crystal-dmg", name: "Ice Crystal DMG (Frostpierce Star)", scaling: "atk", hitCategory: "skill", element: "Cryo" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Frostbound Javelin",
      hits: [
        { key: "burst-javelin-dmg", name: "Ice Javelin Single Strike DMG", scaling: "atk", hitCategory: "burst", element: "Cryo" },
        { key: "stellar-conduct-javelin-dmg", name: "Stellar-Conduct Ice Javelin Strike DMG", scaling: "atk", hitCategory: "burst", direct: "stellar", element: "Cryo" },
        { key: "stellar-swirl-javelin-dmg", name: "Stellar Swirl Ice Javelin Strike DMG", scaling: "atk", hitCategory: "burst", direct: "stellar", element: "Cryo" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "frostpierce-active",
      label: "Frostpierce Star Active (A1 Cryo Infusion & +80% ATK Flat DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "A1 Ever-Keen Frost: When Frostpierce Star is on the field, NA/CA/Plunge DMG converts to Cryo and gains flat DMG equal to 80% of ATK."
    },
    {
      id: "frostglow-stacks",
      label: "Frostglow Stacks Consumed (0–8)",
      control: "stacks",
      max: 8,
      defaultValue: 8,
      hint: "Consuming Frostglow stacks on Burst: +4.96% DMG per stack to Ice Javelin hits. At C6, also increases party Stellar Glimmer DMG by +5% per stack."
    },
    {
      id: "c2-stellar-em",
      label: "C2 Frostfall Reverberation (+120 EM Stellar Glimmer)",
      control: "toggle",
      defaultValue: 1,
      hint: "C2: Active character gains +60 EM when hit by Ice Crystal. Boosted to +120 EM if Stellar Glimmer is active."
    }
  ],
  mechanics: [
    "Ever-Keen Frost (A1): When Frostpierce Star is on the field, NA/CA/Plunge DMG converts to Cryo DMG (cannot be overridden) and increases by 80% of ATK as Flat DMG Bonus.",
    "Lucent Ice (A4): Increases the Traveler's Elemental Mastery by 8% of their ATK, up to a maximum of 160 EM.",
    "Illusory Frostmirror (Stellar Jubilee): Base Stellar-Conduct/Stellar-Swirl DMG increases by +0.7% per 100 ATK (cap 14%).",
    "Frostglow Stacks (0–8): Gained via Frostpierce Star coordinated attacks. Consumed on Burst cast for +4.96% DMG per stack on Ice Javelin hits.",
    "Somber Freeze (C1): Regenerates 5 Energy when dealing Stellar Glimmer DMG (once every 0.5s).",
    "Frostfall Reverberation (C2): Active character gains +60 EM for 5s on Ice Crystal hit. Boosted to +120 EM if Stellar Glimmer is active.",
    "Glacier Strike (C3): Increases the Level of Frostbound Javelin by 3.",
    "Enduring Ice (C4): Extends Frostpierce Star duration by 25%.",
    "Bittercold Fog (C5): Increases the Level of Ice Fog Piercer by 3.",
    "Brumal Grimfrost (C6): Each Frostglow stack consumed increases other party members' Stellar Glimmer reaction DMG by +5% per stack (max +40%) for 15s."
  ],
  constellations: [
    { level: 1, name: "Somber Freeze", description: "Regenerates 5 Elemental Energy when dealing Stellar Glimmer DMG. Can trigger once every 0.5s.", effects: [{ type: "informational" }] },
    { level: 2, name: "Frostfall Reverberation", description: "Increases active character's EM by 60 for 5s when hit by an Ice Crystal. Boosted to 120 EM when Stellar Glimmer reaction is active.", effects: [{ type: "informational" }] },
    { level: 3, name: "Glacier Strike", description: "Increases the Level of Frostbound Javelin by 3. Maximum upgrade level is 15.", effects: [{ type: "talent_level_bonus", talentType: "burst" }] },
    { level: 4, name: "Enduring Ice", description: "Extends the duration of the Frostpierce Star by 25%.", effects: [{ type: "informational" }] },
    { level: 5, name: "Bittercold Fog", description: "Increases the Level of Ice Fog Piercer by 3. Maximum upgrade level is 15.", effects: [{ type: "talent_level_bonus", talentType: "skill" }] },
    { level: 6, name: "Brumal Grimfrost", description: "Each Frostglow stack consumed on Burst increases other party members' Stellar Glimmer reaction DMG by 5% per stack (max 40%) for 15s.", effects: [{ type: "informational" }] }
  ],
  support: {
    description: "Cryo Stellar support providing Moonsign Lunar/Stellar Base DMG (+0.7%/100 ATK, cap 14%), party EM share via C2, and Stellar Glimmer reaction amplification at C6.",
    buffExplanations: [
      {
        name: "Stellar Jubilee: Illusory Frostmirror",
        brief: "+0.7% Lunar/Stellar Base DMG per 100 ATK",
        full: "Base Stellar-Conduct and Stellar-Swirl DMG increases by 0.7% for every 100 points of the Traveler's ATK, up to a maximum of 14%.",
        category: "lunar",
      },
      {
        name: "C2: Frostfall Reverberation",
        brief: "+60 / +120 EM",
        full: "Increases active character's EM by 60 for 5s on Ice Crystal hit. Boosted to 120 EM when Stellar Glimmer reaction is active.",
        category: "stat_share",
      },
      {
        name: "C6: Brumal Grimfrost",
        brief: "Up to +40% Stellar Reaction DMG",
        full: "Each Frostglow stack consumed on Burst cast increases other party members' Stellar Glimmer reaction DMG by 5% per stack (max 8 stacks = +40%) for 15s.",
        category: "lunar",
      },
    ],
    statFields: [
      { key: "atk.base", label: "Base ATK", defaultValue: "700" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    lunarBaseBonusCompute: (ctx) => Math.min(14, (ctx.atk / 100) * 0.7),
    buffs: [
      {
        stat: "em",
        label: "Elemental Mastery (Cryo MC C2)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          return (ctx.inputs["c2-stellar-em"] ?? 1) > 0 ? 120 : 60;
        },
      },
      {
        stat: "stellarGlimmerDmgBonus",
        label: "Stellar Glimmer Reaction DMG (Cryo MC C6)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          const stacks = Math.min(8, Math.max(0, ctx.inputs["frostglow-stacks"] ?? 8));
          return stacks * 5;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      const stellarBase = Math.min(14, (ctx.atk / 100) * 0.7);
      return [
        { label: "Total ATK", value: fmt(ctx.atk) },
        { label: "Stellar Base", value: `+${fmt(stellarBase)}%` },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
