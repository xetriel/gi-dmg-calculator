import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const travelerAnemo: CharacterConfig = {
  id: "traveler-anemo",
  name: "Traveler (Anemo)",
  rarity: 5,
  element: "Anemo",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "ATK%", maxValue: 24.0 },
  dmgBonusLabel: "Anemo DMG Bonus%",
  stats: coreStats("ATK%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Foreign Ironwind",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-1", name: "Charged Attack (Hit 1)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2-aether", name: "Charged Attack (Hit 2 — Aether)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2-lumine", name: "Charged Attack (Hit 2 — Lumine)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "slashing-wind", name: "Slashing Wind (A1 Passive)", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Palm Vortex",
      hits: [
        { key: "initial-cutting", name: "Initial Cutting DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
        { key: "max-cutting", name: "Max Cutting DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
        { key: "initial-storm", name: "Initial Storm DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
        { key: "max-storm", name: "Max Storm DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Gust Surge",
      hits: [
        { key: "tornado-dmg", name: "Tornado DMG", scaling: "atk", hitCategory: "burst", element: "Anemo" },
        { key: "absorption-dmg", name: "Additional Elemental DMG", scaling: "atk", hitCategory: "burst", element: "Anemo" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "c2-er-bonus",
      label: "C2 Uprising Whirlwind (+16% ER)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases Energy Recharge by 16%."
    },
    {
      id: "c6-res-shred",
      label: "C6 Intertwined Winds (-20% Anemo RES & Absorbed Element RES)",
      control: "toggle",
      defaultValue: 1,
      hint: "Targets hit by Gust Surge have Anemo RES decreased by 20%."
    }
  ],
  mechanics: [
    "Slashing Wind (A1): The last hit of a Normal Attack combo unleashes a wind blade, dealing 60% of ATK as Anemo DMG.",
    "Second Wind (A4): Palm Vortex kills regenerate 2% HP.",
    "Raging Vortex (C1): Palm Vortex pulls enemies.",
    "Uprising Whirlwind (C2): Increases ER by 16%.",
    "Cherishing Breeze (C4): Reduces DMG taken while casting Palm Vortex by 10%.",
    "Intertwined Winds (C6): Targets hit by Gust Surge have Anemo RES decreased by 20%."
  ],
  constellations: [
    { level: 1, name: "Raging Vortex", description: "Palm Vortex pulls in opponents.", effects: [{ type: "informational" }] },
    { level: 2, name: "Uprising Whirlwind", description: "Increases Energy Recharge by 16%.", effects: [{ type: "informational" }] },
    { level: 3, name: "Sweeping Nipper", description: "Increases the Level of Gust Surge by 3.", effects: [{ type: "talent_level_bonus", talentType: "burst" }] },
    { level: 4, name: "Cherishing Breeze", description: "Reduces DMG taken while casting Palm Vortex by 10%.", effects: [{ type: "informational" }] },
    { level: 5, name: "Vortex Stellaris", description: "Increases the Level of Palm Vortex by 3.", effects: [{ type: "talent_level_bonus", talentType: "skill" }] },
    { level: 6, name: "Intertwined Winds", description: "Targets hit by Gust Surge have Anemo RES decreased by 20%.", effects: [{ type: "informational" }] }
  ],
  support: {
    description: "Anemo support providing crowd control and -20% Anemo / absorbed element RES shred via Intertwined Winds (C6).",
    buffExplanations: [
      {
        name: "C6: Intertwined Winds",
        brief: "-20% Anemo / Absorbed Element RES Shred",
        full: "Targets who take DMG from Gust Surge have their Anemo RES decreased by 20%. If an elemental absorption occurred, their RES towards the corresponding Element is also decreased by 20%.",
        category: "elemental",
      },
    ],
    statFields: [
      { key: "atk.base", label: "Base ATK", defaultValue: "700" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "enemyRes",
        label: "Anemo / Element RES Shred (Anemo MC C6)",
        compute: (ctx) => (ctx.constellationLevel >= 6 ? -20 : 0),
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Base ATK", value: fmt(ctx.baseAtk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
