import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const columbina: CharacterConfig = {
  id: "columbina", name: "Columbina", rarity: 5,
  element: "Hydro", weapon: "Catalyst", scalingSource: "hp",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "Hydro DMG Bonus%",
  stats: coreStats("Hydro DMG Bonus%"),
  talents: [
    {
      type: "normal", name: "Normal Attack — Moondew Cascade", hits: [
        { key: "1-hit", name: "1-Hit", scaling: "atk", hitCategory: "normal" },
        { key: "2-hit", name: "2-Hit", scaling: "atk", hitCategory: "normal" },
        { key: "3-hit", name: "3-Hit", scaling: "atk", hitCategory: "normal" },
        { key: "charged", name: "Charged Attack", scaling: "atk", hitCategory: "charged" },
        { key: "moondew-cleanse", name: "Moondew Cleanse DMG (% Max HP ×3)", scaling: "hp", direct: "lunar", lunarType: "lunar-bloom", element: "Dendro" },
        { key: "plunge", name: "Plunge", scaling: "atk", hitCategory: "plunge" },
        { key: "low-plunge", name: "Low Plunge", scaling: "atk", hitCategory: "plunge" },
        { key: "high-plunge", name: "High Plunge", scaling: "atk", hitCategory: "plunge" },
      ]
    },
    {
      type: "skill", name: "Elemental Skill — Eternal Tides", hits: [
        { key: "skill-dmg", name: "Skill DMG (% Max HP)", scaling: "hp", hitCategory: "skill" },
        { key: "ripple-dmg", name: "Gravity Ripple: Continuous DMG (% Max HP)", scaling: "hp", hitCategory: "skill" },
        { key: "gi-charged", name: "Gravity Interference: Lunar-Charged DMG (% Max HP)", scaling: "hp", direct: "lunar", lunarType: "lunar-charged", element: "Electro" },
        { key: "gi-bloom", name: "Gravity Interference: Lunar-Bloom DMG (% Max HP)", scaling: "hp", direct: "lunar", lunarType: "lunar-bloom", element: "Dendro" },
        { key: "gi-crystallize", name: "Gravity Interference: Lunar-Crystallize DMG (% Max HP)", scaling: "hp", direct: "lunar", lunarType: "lunar-crystallize", element: "Geo" },
      ]
    },
    {
      type: "burst", name: "Elemental Burst — Moonlit Melancholy", hits: [
        { key: "burst-dmg", name: "Burst DMG (% Max HP)", scaling: "hp", hitCategory: "burst" },
      ]
    }
  ],
  mechanics: [
    "All damage from skill, burst, Moondew Cleanse, and Gravity Interference scales off Max HP",
    "A1 Lunacy stacks (+5% CRIT Rate per stack, max 3) gained from Gravity Interference",
    "C2 Lunar Brilliance: increases Max HP by 40% when active. Active character gains ATK (1% Max HP), EM (0.35% Max HP), or DEF (1% Max HP) based on dominant Lunar reaction type (Lunar-Charged, Lunar-Bloom, or Lunar-Crystallize)",
    "C6 CRIT DMG buff: increases CRIT DMG of corresponding elements by 80% inside Burst's Lunar Domain",
  ],
  mechanicDefs: [
    {
      id: "lunar-domain", label: "Lunar Domain (Burst active)", control: "toggle", defaultValue: 1,
      hint: "Burst: Characters in the Lunar Domain gain Lunar Reaction DMG Bonus based on Burst Level"
    },
    {
      id: "lunacy-stacks", label: "A1 Lunacy stacks", control: "stacks", max: 3, defaultValue: 3,
      hint: "A1: +5% CRIT Rate per stack (max 3)"
    },
    {
      id: "c2-lunar-brilliance", label: "C2 Lunar Brilliance (+40% Max HP)", control: "toggle", defaultValue: 1,
      hint: "C2: +40% Max HP (Lunar Brilliance)"
    },
    {
      id: "c2-gleam-charged", label: "C2 Ascendant Gleam: Lunar-Charged (ATK)", control: "toggle", defaultValue: 1,
      hint: "C2: Active character gains ATK equal to 1% of Columbina's Max HP"
    },
    {
      id: "c2-gleam-bloom", label: "C2 Ascendant Gleam: Lunar-Bloom (EM)", control: "toggle", defaultValue: 0,
      hint: "C2: Active character gains EM equal to 0.35% of Columbina's Max HP"
    },
    {
      id: "c2-gleam-crystallize", label: "C2 Ascendant Gleam: Lunar-Crystallize (DEF)", control: "toggle", defaultValue: 0,
      hint: "C2: Active character gains DEF equal to 1% of Columbina's Max HP"
    },
    {
      id: "c6-crit-dmg-buff", label: "C6 CRIT DMG buff", control: "toggle", defaultValue: 1,
      hint: "C6: +80% CRIT DMG to active elements inside Lunar Domain"
    }
  ],
  wikiTalents: [
    {
      name: "Moondew Cascade",
      type: "Normal Attack",
      description: "Normal Attack: Summons Moonlit Tides, performing up to 3 attacks that deal Hydro DMG. Charged Attack: Consumes Stamina to deal AoE Hydro DMG. If you have at least 1 Verdant Dew, Charged Attack is replaced by Moondew Cleanse: consumes 1 Dew to deal 3 instances of Dendro DMG considered Lunar-Bloom DMG. Plunging Attack: Deals AoE Hydro DMG upon impact."
    },
    {
      name: "Eternal Tides",
      type: "Elemental Skill",
      description: "Deals AoE Hydro DMG and summons Gravity Ripple. Ripple follows the active character, dealing continuous AoE Hydro DMG. Triggering Lunar reactions accrues Gravity (max 60); at limit, triggers Gravity Interference depending on elements involved (Lunar-Charged Electro DMG, Lunar-Bloom Dendro DMG, or Lunar-Crystallize Geo DMG)."
    },
    {
      name: "Moonlit Melancholy",
      type: "Elemental Burst",
      description: "Deals AoE Hydro DMG and summons a Lunar Domain. Characters inside get a Lunar Reaction DMG Bonus based on level."
    },
    {
      name: "Lunacy's Lure",
      type: "1st Ascension Passive",
      description: "Triggering Gravity Interference grants Lunacy stacks, increasing CRIT Rate by 5% for 10s (max 3 stacks)."
    },
    {
      name: "Law of the New Moon",
      type: "4th Ascension Passive",
      description: "Triggering reactions in Lunar Domain grants: Lunar-Charged (33% chance of extra lightning strike), Lunar-Bloom (special Moonridge Dew, max 3 every 18s), Lunar-Crystallize (33% chance of extra attack)."
    },
    {
      name: "Moonlight, Lent Unto You",
      type: "Moonsign Benediction Passive",
      description: "Converts Electro-Charged, Bloom, and Hydro-Crystallize triggered by party members to Lunar-Charged, Lunar-Bloom, and Lunar-Crystallize respectively. Increases Lunar Reaction DMG by 0.2% per 1000 Max HP (max 7%). Party Moonsign level +1."
    },
    {
      name: "Lunar Vigil",
      type: "Utility Passive",
      description: "Revives fallen characters in Nod-Krai once every 100s. Exclusive dialogue/interactions with certain animals in Nod-Krai."
    }
  ],
  constellations: [
    {
      level: 1, name: "Radiance Over Blossoms and Peaks",
      description: "Skill immediately triggers Gravity Interference (cooldown 15s). Ascendant Gleam triggers active character effects based on reaction type. All nearby party members' Lunar Reaction DMG is elevated by 1.5%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "Not in Lone Splendor",
      description: "Rate of accumulating Gravity increases by 34%. When Gravity Interference is triggered, Columbina will receive the Lunar Brilliance effect, which increases her Max HP by 40% for 8s. Moonsign: Ascendant Gleam: When Lunar Brilliance is active, if, during the current trigger of Gravity Interference, the Lunar reaction type that has accumulated the most Gravity for Columbina is: Lunar-Charged: ATK of your current active character increases. Increase in ATK is equal to 1% of Columbina's Max HP; Lunar-Bloom: Elemental Mastery of your current active character increases. Increase in Elemental Mastery is equal to 0.35% of Columbina's Max HP; Lunar-Crystallize: DEF of your current active character increases. Increase in DEF is equal to 1% of Columbina's Max HP. All nearby party members' Lunar Reaction DMG is elevated by 7%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "Dreamlike Glow Across Tranquil Waters",
      description: "Increases the level of Eternal Tides by 3.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "Cloudveiled Ridges in Floral Mists",
      description: "Gravity Interference restores 4 energy. Gravity Interference reaction damage increased by 12.5% (Charged/Crystallize) or 2.5% (Bloom) of Columbina's Max HP. All nearby party members' Lunar Reaction DMG elevated by 1.5%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Silence Tending One Lone Song",
      description: "Increases the level of Moonlit Melancholy by 3.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "Through Darkness Led by Moonlight",
      description: "Triggering Lunar reactions in Lunar Domain increases CRIT DMG of corresponding elements by 80% for 8s. All nearby party members' Lunar Reaction DMG elevated by 7%.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Moonsign Hydro sub-DPS and Lunar reaction buffer. Enhances party Lunar reactions scaling from Max HP, provides active character buffs at C2 (ATK, EM, or DEF based on dominant Lunar reaction), and grants +80% CRIT DMG at C6.",
    buffExplanations: [
      {
        name: "Moonsign Benediction",
        brief: "+0.2% Lunar Reaction Base DMG per 1,000 Max HP (max 7%)",
        full: "Converts Electro-Charged, Bloom, and Hydro-Crystallize to Lunar variants. Increases Lunar Reaction Base DMG by 0.2% per 1,000 Max HP (capped at 7%).",
        category: "lunar",
      },
      {
        name: "Lunar Elevation (C1/C2/C4/C6)",
        brief: "Up to +17% Lunar Reaction DMG Elevation",
        full: "Elevates nearby party members' Lunar Reaction DMG: +1.5% at C1, +7.0% at C2, +1.5% at C4, and +7.0% at C6 (accumulating up to +17.0%).",
        category: "lunar",
      },
      {
        name: "C2: Lunar Brilliance (Ascendant Gleam)",
        brief: "Active ATK (1% HP), EM (0.35% HP), or DEF (1% HP)",
        full: "When Lunar Brilliance is active at C2, if during the current trigger of Gravity Interference the Lunar reaction type that accumulated the most Gravity is: Lunar-Charged: ATK increases by 1% of Columbina's Max HP; Lunar-Bloom: Elemental Mastery increases by 0.35% of Columbina's Max HP; Lunar-Crystallize: DEF increases by 1% of Columbina's Max HP. All nearby party members' Lunar Reaction DMG is elevated by 7%.",
        category: "stat_share",
      },
      {
        name: "C6: Lunar Domain CRIT DMG",
        brief: "+80% CRIT DMG inside Lunar Domain",
        full: "Triggering Lunar reactions inside Lunar Domain grants +80% CRIT DMG for 8s.",
        category: "dmg_bonus",
      },
    ],
    statFields: [
      { key: "hp", label: "Max HP", defaultValue: "40000" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "70" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "140" },
    ],
    buffs: [
      {
        stat: "lunarChargedElevation",
        label: "Lunar-Charged Elevation (Columbina Cons)",
        compute: (ctx) => {
          let elevation = 0;
          if (ctx.constellationLevel >= 1) elevation += 1.5;
          if (ctx.constellationLevel >= 2) elevation += 7.0;
          if (ctx.constellationLevel >= 4) elevation += 1.5;
          if (ctx.constellationLevel >= 6) elevation += 7.0;
          return elevation;
        },
      },
      {
        stat: "lunarBloomElevation",
        label: "Lunar-Bloom Elevation (Columbina Cons)",
        compute: (ctx) => {
          let elevation = 0;
          if (ctx.constellationLevel >= 1) elevation += 1.5;
          if (ctx.constellationLevel >= 2) elevation += 7.0;
          if (ctx.constellationLevel >= 4) elevation += 1.5;
          if (ctx.constellationLevel >= 6) elevation += 7.0;
          return elevation;
        },
      },
      {
        stat: "lunarCrystallizeElevation",
        label: "Lunar-Crystallize Elevation (Columbina Cons)",
        compute: (ctx) => {
          let elevation = 0;
          if (ctx.constellationLevel >= 1) elevation += 1.5;
          if (ctx.constellationLevel >= 2) elevation += 7.0;
          if (ctx.constellationLevel >= 4) elevation += 1.5;
          if (ctx.constellationLevel >= 6) elevation += 7.0;
          return elevation;
        },
      },
      {
        stat: "atk",
        label: "ATK (Columbina C2 Ascendant Gleam: Lunar-Charged)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          const lbActive = ((ctx.inputs["c2-lunar-brilliance"] ?? ctx.inputs["lunar-brilliance"] ?? 0) > 0);
          if (!lbActive) return 0;
          const isGleamActive = (ctx.inputs["c2-gleam-charged"] ?? 1) > 0;
          if (!isGleamActive) return 0;
          const effHp = ctx.hp + (ctx.baseHp > 0 && ctx.baseHp < ctx.hp ? 0.40 * ctx.baseHp : 0);
          return 0.01 * effHp;
        },
      },
      {
        stat: "em",
        label: "EM (Columbina C2 Ascendant Gleam: Lunar-Bloom)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          const lbActive = ((ctx.inputs["c2-lunar-brilliance"] ?? ctx.inputs["lunar-brilliance"] ?? 0) > 0);
          if (!lbActive) return 0;
          const isGleamActive = (ctx.inputs["c2-gleam-bloom"] ?? 0) > 0;
          if (!isGleamActive) return 0;
          const effHp = ctx.hp + (ctx.baseHp > 0 && ctx.baseHp < ctx.hp ? 0.40 * ctx.baseHp : 0);
          return 0.0035 * effHp;
        },
      },
      {
        stat: "def",
        label: "DEF (Columbina C2 Ascendant Gleam: Lunar-Crystallize)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          const lbActive = ((ctx.inputs["c2-lunar-brilliance"] ?? ctx.inputs["lunar-brilliance"] ?? 0) > 0);
          if (!lbActive) return 0;
          const isGleamActive = (ctx.inputs["c2-gleam-crystallize"] ?? 0) > 0;
          if (!isGleamActive) return 0;
          const effHp = ctx.hp + (ctx.baseHp > 0 && ctx.baseHp < ctx.hp ? 0.40 * ctx.baseHp : 0);
          return 0.01 * effHp;
        },
      },
      {
        stat: "critDmg",
        label: "CRIT DMG (Columbina C6 Lunar Domain)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-crit-dmg-buff"] ?? 0) <= 0) return 0;
          return 80;
        },
      },
    ],
    lunarBaseBonusCompute: (ctx) => Math.min(0.2 * (ctx.hp / 1000), 7),
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Max HP", value: fmt(ctx.hp) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
