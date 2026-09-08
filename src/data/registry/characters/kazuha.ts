import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const kazuha: CharacterConfig = {
  id: "kazuha",
  name: "Kaedehara Kazuha",
  rarity: 5,
  element: "Anemo",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "Elemental Mastery", maxValue: 115.2 },
  dmgBonusLabel: "Anemo DMG Bonus%",
  stats: coreStats("Anemo DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack: Garyuu Bladework",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit-1", name: "3-Hit DMG (Hit 1)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit-2", name: "3-Hit DMG (Hit 2)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG (×3)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-1", name: "Charged Attack 1-Hit DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2", name: "Charged Attack 2-Hit DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge Collision DMG", scaling: "atk", hitCategory: "plunge", plungeSubtype: "collision", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", plungeSubtype: "impact", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", plungeSubtype: "impact", element: "Physical" },
        { key: "midare-ranzan-low", name: "Midare Ranzan: Low Plunge DMG", scaling: "atk", hitCategory: "plunge", plungeSubtype: "impact", element: "Anemo" },
        { key: "midare-ranzan-high", name: "Midare Ranzan: High Plunge DMG", scaling: "atk", hitCategory: "plunge", plungeSubtype: "impact", element: "Anemo" },
        { key: "soumon-pyro", name: "Soumon Swordsmanship: Pyro DMG", scaling: "atk", hitCategory: "plunge", plungeSubtype: "impact", element: "Pyro" },
        { key: "soumon-hydro", name: "Soumon Swordsmanship: Hydro DMG", scaling: "atk", hitCategory: "plunge", plungeSubtype: "impact", element: "Hydro" },
        { key: "soumon-electro", name: "Soumon Swordsmanship: Electro DMG", scaling: "atk", hitCategory: "plunge", plungeSubtype: "impact", element: "Electro" },
        { key: "soumon-cryo", name: "Soumon Swordsmanship: Cryo DMG", scaling: "atk", hitCategory: "plunge", plungeSubtype: "impact", element: "Cryo" },
      ],
    },
    {
      type: "skill",
      name: "Chihayaburu",
      hits: [
        { key: "press-dmg", name: "Press Skill DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
        { key: "hold-dmg", name: "Hold Skill DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
      ],
    },
    {
      type: "burst",
      name: "Kazuha Slash",
      hits: [
        { key: "slashing-dmg", name: "Slashing DMG", scaling: "atk", hitCategory: "burst", element: "Anemo" },
        { key: "dot", name: "Autumn Whirlwind DoT", scaling: "atk", hitCategory: "burst", element: "Anemo" },
        { key: "dot-pyro", name: "Additional Elemental DMG (Pyro)", scaling: "atk", hitCategory: "burst", element: "Pyro" },
        { key: "dot-hydro", name: "Additional Elemental DMG (Hydro)", scaling: "atk", hitCategory: "burst", element: "Hydro" },
        { key: "dot-electro", name: "Additional Elemental DMG (Electro)", scaling: "atk", hitCategory: "burst", element: "Electro" },
        { key: "dot-cryo", name: "Additional Elemental DMG (Cryo)", scaling: "atk", hitCategory: "burst", element: "Cryo" },
      ],
    },
  ],
  mechanics: [
    "Soumon Swordsmanship (A1): If Chihayaburu comes into contact with Hydro/Pyro/Cryo/Electro when cast, Plunging Attack: Midare Ranzan will deal an additional 200% ATK of that element as Plunging Attack DMG.",
    "Poetics of Fuubutsu (A4): Upon triggering a Swirl reaction, Kaedehara Kazuha will grant all party members a 0.04% Elemental DMG Bonus to the element absorbed by the Swirl reaction for every point of Elemental Mastery he possesses for 8s. Bonuses for different elements obtained through this method can coexist.",
    "Yamaarashi Tailwind (C2): The Autumn Whirlwind field created by Kazuha Slash increases Kaedehara Kazuha's own Elemental Mastery by 200 and increases the Elemental Mastery of characters within the field by 200. Does not stack.",
    "Crimson Momiji (C6): After using Chihayaburu or Kazuha Slash, Kaedehara Kazuha gains an Anemo Infusion for 5s. Each point of Elemental Mastery increases the DMG dealt by his Normal, Charged, and Plunging Attacks by 0.2%.",
  ],
  mechanicDefs: [
    {
      id: "a4-pyro-swirl",
      label: "A4: Swirled Pyro (+0.04% Pyro DMG per EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4 Poetics of Fuubutsu: Grants +0.04% Pyro DMG Bonus per point of Elemental Mastery for 8s upon triggering a Pyro Swirl.",
    },
    {
      id: "a4-hydro-swirl",
      label: "A4: Swirled Hydro (+0.04% Hydro DMG per EM)",
      control: "toggle",
      defaultValue: 0,
      hint: "A4 Poetics of Fuubutsu: Grants +0.04% Hydro DMG Bonus per point of Elemental Mastery for 8s upon triggering a Hydro Swirl.",
    },
    {
      id: "a4-electro-swirl",
      label: "A4: Swirled Electro (+0.04% Electro DMG per EM)",
      control: "toggle",
      defaultValue: 0,
      hint: "A4 Poetics of Fuubutsu: Grants +0.04% Electro DMG Bonus per point of Elemental Mastery for 8s upon triggering an Electro Swirl.",
    },
    {
      id: "a4-cryo-swirl",
      label: "A4: Swirled Cryo (+0.04% Cryo DMG per EM)",
      control: "toggle",
      defaultValue: 0,
      hint: "A4 Poetics of Fuubutsu: Grants +0.04% Cryo DMG Bonus per point of Elemental Mastery for 8s upon triggering a Cryo Swirl.",
    },
    {
      id: "c2-tailwind-active",
      label: "C2: Inside Autumn Whirlwind Field (+200 EM)",
      control: "toggle",
      defaultValue: 1,
      minConstellation: 2,
      hint: "Autumn Whirlwind field increases Kazuha's and party members' Elemental Mastery by 200. Requires C2.",
    },
    {
      id: "c6-crimson-momiji",
      label: "C6: Crimson Momiji (Anemo Infusion & +0.2% Normal/Charged/Plunge DMG per EM)",
      control: "toggle",
      defaultValue: 1,
      minConstellation: 6,
      hint: "After using Skill or Burst, gains Anemo Infusion and +0.2% Normal, Charged, and Plunging Attack DMG per point of EM for 5s. Requires C6.",
    },
  ],
  wikiTalents: [
    {
      name: "Garyuu Bladework",
      type: "Normal Attack",
      description:
        "Normal Attack: Performs up to 5 rapid strikes. Charged Attack: Consumes Stamina to unleash 2 rapid sword strikes. Plunging Attack: Plunges from mid-air to strike the ground below. Plunging Attack: Midare Ranzan: When performed via Chihayaburu, Plunging Attack DMG is converted to Anemo DMG and creates a small wind tunnel that pulls in nearby objects and opponents.",
    },
    {
      name: "Chihayaburu",
      type: "Elemental Skill",
      description:
        "Unleashes a secret technique that pulls objects and opponents towards Kazuha's current position before launching opponents within the AoE, dealing Anemo DMG and lifting Kazuha into the air on a rushing gust of wind. Press: Can be used in mid-air (CD 6s). Hold: Charges up before unleashing greater Anemo DMG over a larger AoE (CD 9s).",
    },
    {
      name: "Kazuha Slash",
      type: "Elemental Burst",
      description:
        "The signature technique of Kazuha's self-styled bladework — a single slash that strikes with the force of the first winds of autumn, dealing AoE Anemo DMG. Leaves behind an 'Autumn Whirlwind' field that periodically deals AoE Anemo DMG to opponents. Elemental Absorption: If Autumn Whirlwind comes into contact with Hydro/Pyro/Cryo/Electro, it will deal additional elemental DMG of that type.",
    },
    {
      name: "Soumon Swordsmanship",
      type: "Passive Talent",
      description:
        "If Chihayaburu comes into contact with Hydro/Pyro/Cryo/Electro when cast, Chihayaburu will absorb that element and if Plunging Attack: Midare Ranzan is used before the effect expires, it will deal an additional 200% ATK of the absorbed element as Plunging Attack DMG.",
    },
    {
      name: "Poetics of Fuubutsu",
      type: "Passive Talent",
      description:
        "Upon triggering a Swirl reaction, Kaedehara Kazuha will grant all party members a 0.04% Elemental DMG Bonus to the element absorbed by the Swirl reaction for every point of Elemental Mastery he possesses for 8s. Bonuses for different elements obtained through this method can coexist.",
    },
    {
      name: "Cloud Strider",
      type: "Utility Passive",
      description: "Decreases sprinting Stamina consumption for your own party members by 20%. Not stackable with Passive Talents that provide the exact same effects.",
    },
  ],
  constellations: [
    {
      level: 1,
      name: "Scarlet Hills",
      description: "Decreases Chihayaburu's CD by 10%. Using Kazuha Slash resets the CD of Chihayaburu.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "Yamaarashi Tailwind",
      description:
        "The Autumn Whirlwind field created by Kazuha Slash increases Kaedehara Kazuha's own Elemental Mastery by 200 and increases the Elemental Mastery of characters within the field by 200. The EM-increasing effects of this Constellation do not stack.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "Maple Monogatari",
      description: "Increases the Level of Chihayaburu by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 4,
      name: "Oozora Genpou",
      description:
        "When Kaedehara Kazuha's Energy is lower than 45, pressing Chihayaburu regenerates 3 Energy, holding regenerates 4 Energy, and gliding regenerates 2 Energy per second.",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "Wisdom of Bansei",
      description: "Increases the Level of Kazuha Slash by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 6,
      name: "Crimson Momiji",
      description:
        "After using Chihayaburu or Kazuha Slash, Kaedehara Kazuha gains an Anemo Infusion for 5s. Additionally, each point of Elemental Mastery will increase the DMG dealt by Kaedehara Kazuha's Normal, Charged, and Plunging Attack by 0.2%.",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description:
      "Premier 5-star Anemo support providing universal team-wide Elemental DMG Bonuses (0.04% per EM via A4 Poetics of Fuubutsu) on Swirl, +200 Elemental Mastery to party members within Autumn Whirlwind (C2), and universal Viridescent Venerer RES shred synergy.",
    buffExplanations: [
      {
        name: "A4: Poetics of Fuubutsu",
        brief: "+0.04% Elemental DMG per EM",
        full: "Upon triggering a Swirl reaction, Kaedehara Kazuha grants all party members a 0.04% Elemental DMG Bonus to the swirled element for every point of Elemental Mastery he possesses for 8s. Multiple elemental bonuses can coexist.",
        category: "dmg_bonus",
      },
      {
        name: "C2: Yamaarashi Tailwind",
        brief: "+200 EM inside Autumn Whirlwind field",
        full: "The Autumn Whirlwind field created by Kazuha Slash increases Kaedehara Kazuha's own Elemental Mastery by 200 and increases the Elemental Mastery of characters within the field by 200. Requires C2.",
        category: "stat_share",
      },
    ],
    statFields: [
      { key: "em", label: "Elemental Mastery", defaultValue: "950" },
      { key: "er", label: "Energy Recharge%", defaultValue: "160" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
      { key: "baseAtk", label: "Base ATK", defaultValue: "800" },
    ],
    buffs: [
      {
        stat: "pyroDmgBonus",
        label: "Pyro DMG (Kazuha A4 Poetics of Fuubutsu)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-pyro-swirl"] ?? 0) <= 0) return 0;
          const em = ctx.em + (ctx.constellationLevel >= 2 && (ctx.inputs["c2-tailwind-active"] ?? 1) > 0 ? 200 : 0);
          return 0.04 * em;
        },
      },
      {
        stat: "hydroDmgBonus",
        label: "Hydro DMG (Kazuha A4 Poetics of Fuubutsu)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-hydro-swirl"] ?? 0) <= 0) return 0;
          const em = ctx.em + (ctx.constellationLevel >= 2 && (ctx.inputs["c2-tailwind-active"] ?? 1) > 0 ? 200 : 0);
          return 0.04 * em;
        },
      },
      {
        stat: "electroDmgBonus",
        label: "Electro DMG (Kazuha A4 Poetics of Fuubutsu)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-electro-swirl"] ?? 0) <= 0) return 0;
          const em = ctx.em + (ctx.constellationLevel >= 2 && (ctx.inputs["c2-tailwind-active"] ?? 1) > 0 ? 200 : 0);
          return 0.04 * em;
        },
      },
      {
        stat: "cryoDmgBonus",
        label: "Cryo DMG (Kazuha A4 Poetics of Fuubutsu)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-cryo-swirl"] ?? 0) <= 0) return 0;
          const em = ctx.em + (ctx.constellationLevel >= 2 && (ctx.inputs["c2-tailwind-active"] ?? 1) > 0 ? 200 : 0);
          return 0.04 * em;
        },
      },
      {
        stat: "em",
        label: "Elemental Mastery (Kazuha C2 Yamaarashi Tailwind)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          if ((ctx.inputs["c2-tailwind-active"] ?? 1) <= 0) return 0;
          return 200;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      const effEm = ctx.em + (ctx.constellationLevel >= 2 && (ctx.inputs["c2-tailwind-active"] ?? 1) > 0 ? 200 : 0);
      return [
        { label: "Total EM", value: fmt(effEm) },
        { label: "A4 Bonus", value: `+${(effEm * 0.04).toFixed(1)}%` },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
