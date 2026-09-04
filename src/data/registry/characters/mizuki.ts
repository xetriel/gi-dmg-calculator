import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const mizuki: CharacterConfig = {
  id: "mizuki",
  name: "Yumemizuki Mizuki",
  rarity: 5,
  element: "Anemo",
  weapon: "Catalyst",
  scalingSource: "em",
  ascensionStat: { label: "Elemental Mastery", maxValue: 115.2 },
  dmgBonusLabel: "Anemo DMG Bonus%",
  stats: coreStats("Anemo DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Pure Heart, Pure Dreams",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "charged", name: "Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Anemo" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Anemo" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Anemo" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Anemo" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Aisa Utamakura Pilgrimage",
      hits: [
        { key: "skill-activation", name: "Skill Activation DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
        { key: "dreamdrift-continuous", name: "Continuous Dreamdrift DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
        { key: "stellar-swirl-hit", name: "Radiance: Stellar Swirl Reaction DMG", scaling: "em", hitCategory: "skill", direct: "stellar", element: "Anemo" },
        { key: "swirl-dmg-bonus", name: "Swirl DMG Bonus per 100 EM", scaling: "em", hitCategory: "skill", kind: "buff", element: "Anemo" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Anraku Secret Spring Therapy",
      hits: [
        { key: "burst-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "burst", element: "Anemo" },
        { key: "munen-shockwave", name: "Munen Shockwave DMG", scaling: "em", hitCategory: "burst", element: "Anemo" },
        { key: "snack-healing", name: "Yumemi Snack Healing", scaling: "em", hitCategory: "burst", kind: "heal", element: "Anemo" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "dreamdrifter-state",
      label: "Dreamdrifter State Active",
      control: "toggle",
      defaultValue: 1,
      hint: "Enters Dreamdrifter state, dealing continuous AoE Anemo DMG and enabling Stellar Swirl reactions."
    },
    {
      id: "hexerei-secret-rite",
      label: "Hexerei: Secret Rite Active (2+ Hexerei Party Members)",
      control: "toggle",
      defaultValue: 1,
      hint: "Activates the Witch's Revelation synergy: Vast Be the Dream and enhances Stellar Swirl reaction capabilities."
    },
    {
      id: "a4-em-buff",
      label: "A4 Thoughts by Day (+100 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: When party members trigger Pyro/Hydro/Cryo/Electro attacks during Dreamdrifter state, increases Mizuki's EM by 100 for 4s."
    },
    {
      id: "c2-em-dmg-buff",
      label: "C2 Team Elemental DMG Buff (0.04% per EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "C2: Increases Pyro, Hydro, Cryo, and Electro DMG Bonuses of nearby party members by 0.04% per point of Mizuki's EM."
    }
  ],
  mechanics: [
    "Bright Moon's Restless Voice (A1): While in the Dreamdrifter state, triggering a Swirl or Stellar Swirl reaction increases the state's duration by 2.5s (up to 2 times, max +5s, total 10s).",
    "Thoughts by Day Bring Dreams by Night (A4): While in the Dreamdrifter state, when nearby party members hit opponents with Pyro, Hydro, Cryo, or Electro attacks, Mizuki's Elemental Mastery increases by 100 for 4s.",
    "Vast Be the Dream (Witch's Revelation Passive): When in Dreamdrifter state and triggering a Swirl reaction, deals additional AoE Anemo DMG equal to 1,000% of Elemental Mastery as Radiance: Stellar Swirl.",
    "Hexerei: Secret Rite: When 2+ Hexerei characters are in the party, enables full Witch's Revelation resonance synergy and empowers Stellar-Swirl reactions.",
    "In Mist-Like Waters (C1): When Swirl or Stellar Swirl is triggered against an opponent in Dreamdrifter state, deals additional DMG equal to 200% of Mizuki's Elemental Mastery.",
    "Your Echo I Meet in Dreams (C2): When entering Dreamdrifter state, every point of Elemental Mastery increases the Pyro, Hydro, Cryo, and Electro DMG Bonuses of nearby party members by 0.04% until the state ends.",
    "Till Dawn's Moon Ends Night (C3): Increases the Level of Elemental Skill: Aisa Utamakura Pilgrimage by 3. Maximum upgrade level is 15.",
    "Buds Warm Lucid Springs (C4): Picking up a Yumemi Style Special Snack restores 5 Energy to Mizuki.",
    "As Setting Moon Brings Year's End (C5): Increases the Level of Elemental Burst: Anraku Secret Spring Therapy by 3. Maximum upgrade level is 15.",
    "The Heart Lingers Long (C6): While in Dreamdrifter state, Swirl reaction DMG dealt by party members can score CRIT Hits (fixed 30% CRIT Rate, 100% CRIT DMG). Additionally, Stellar Swirl reaction DMG gains +20% CRIT Rate and +40% CRIT DMG."
  ],
  constellations: [
    {
      level: 1,
      name: "In Mist-Like Waters",
      description: "When Swirl or Stellar Swirl is triggered against an opponent in Dreamdrifter state, deals additional DMG equal to 200% of Mizuki's Elemental Mastery.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Your Echo I Meet in Dreams",
      description: "When entering Dreamdrifter state, every point of Elemental Mastery increases the Pyro, Hydro, Cryo, and Electro DMG Bonuses of nearby party members by 0.04% until the state ends.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Till Dawn's Moon Ends Night",
      description: "Increases the Level of Elemental Skill: Aisa Utamakura Pilgrimage by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Buds Warm Lucid Springs",
      description: "Picking up a Yumemi Style Special Snack restores 5 Energy to Mizuki.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "As Setting Moon Brings Year's End",
      description: "Increases the Level of Elemental Burst: Anraku Secret Spring Therapy by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "The Heart Lingers Long",
      description: "While in Dreamdrifter state, Swirl reaction DMG dealt by party members can score CRIT Hits (fixed 30% CRIT Rate, 100% CRIT DMG). Additionally, Stellar Swirl reaction DMG gains +20% CRIT Rate and +40% CRIT DMG.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Anemo sub-DPS and elemental amplifier. Grants team-wide Pyro, Hydro, Cryo, and Electro DMG Bonuses scaling with her Elemental Mastery at C2 (+0.04% per EM, up to +40%).",
    buffExplanations: [
      {
        name: "C2: Your Echo I Meet in Dreams",
        brief: "Up to +40% Pyro/Hydro/Cryo/Electro DMG Bonus",
        full: "While in Dreamdrifter state, every point of Elemental Mastery increases the Pyro, Hydro, Cryo, and Electro DMG Bonuses of nearby party members by 0.04%, capped at +40.0%.",
        category: "dmg_bonus",
      },
    ],
    statFields: [
      { key: "em", label: "Elemental Mastery", defaultValue: "900" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "pyroDmgBonus",
        label: "Pyro DMG (Mizuki C2)",
        compute: (ctx) => (ctx.constellationLevel >= 2 ? Math.min(ctx.em * 0.04, 40) : 0),
      },
      {
        stat: "hydroDmgBonus",
        label: "Hydro DMG (Mizuki C2)",
        compute: (ctx) => (ctx.constellationLevel >= 2 ? Math.min(ctx.em * 0.04, 40) : 0),
      },
      {
        stat: "cryoDmgBonus",
        label: "Cryo DMG (Mizuki C2)",
        compute: (ctx) => (ctx.constellationLevel >= 2 ? Math.min(ctx.em * 0.04, 40) : 0),
      },
      {
        stat: "electroDmgBonus",
        label: "Electro DMG (Mizuki C2)",
        compute: (ctx) => (ctx.constellationLevel >= 2 ? Math.min(ctx.em * 0.04, 40) : 0),
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
