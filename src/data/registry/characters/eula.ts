import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const eula: CharacterConfig = {
  id: "eula",
  name: "Eula",
  rarity: 5,
  element: "Cryo",
  weapon: "Claymore",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Physical DMG Bonus%",
  stats: coreStats("Physical DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Favonius Bladework: Edelweiss",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG (2 Hits)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG (2 Hits)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-spin", name: "Charged Attack Cyclic DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-final", name: "Charged Attack Final DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Icetide Vortex",
      hits: [
        { key: "press-dmg", name: "Press Skill DMG", scaling: "atk", hitCategory: "skill", element: "Cryo" },
        { key: "hold-dmg", name: "Hold Skill DMG", scaling: "atk", hitCategory: "skill", element: "Cryo" },
        { key: "icewhirl-brand", name: "Icewhirl Brand DMG", scaling: "atk", hitCategory: "skill", element: "Cryo" },
        { key: "shattered-lightfall", name: "Shattered Lightfall Sword DMG (A1)", scaling: "atk", hitCategory: "skill", element: "Physical" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Glacial Illumination",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "burst", element: "Cryo" },
        { key: "lightfall-base", name: "Lightfall Sword Base DMG", scaling: "atk", hitCategory: "burst", element: "Physical" },
        { key: "lightfall-stack", name: "Lightfall Sword DMG per Energy Stack", scaling: "atk", hitCategory: "burst", element: "Physical" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "grimheart-stacks",
      label: "Grimheart Stacks (+30% DEF per stack)",
      control: "stacks",
      max: 2,
      defaultValue: 0,
      hint: "Skill press/hold grants Grimheart stacks (max 2 stacks = +60% DEF and increased interruption resistance)."
    },
    {
      id: "hold-res-shred",
      label: "Hold Skill Physical & Cryo RES Shred (-25%)",
      control: "toggle",
      defaultValue: 1,
      hint: "Consuming Grimheart stacks via Hold Skill decreases enemy Physical & Cryo RES by 25% for 7s."
    },
    {
      id: "lightfall-energy-stacks",
      label: "Lightfall Sword Energy Stacks",
      control: "stacks",
      max: 30,
      defaultValue: 10,
      hint: "Number of energy stacks accumulated by Lightfall Sword during Burst duration (0–30 stacks)."
    },
    {
      id: "c1-phys-buff",
      label: "C1 Tidal Illusion (+30% Physical DMG Bonus)",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: Consuming Grimheart stacks increases Physical DMG Bonus by 30% for 6s (+6s per stack consumed)."
    },
    {
      id: "c4-low-hp-buff",
      label: "C4 The Obstinacy of One's Inferiors (+25% DMG vs <50% HP)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: Lightfall Swords deal 25% increased DMG against opponents with less than 50% HP."
    }
  ],
  mechanics: [
    "Grimheart: Grants +30% DEF per stack (max 2 stacks = +60% DEF) and interruption resistance.",
    "Icetide Vortex (Hold): Consuming Grimheart stacks decreases enemy Physical RES and Cryo RES by 25% for 7s.",
    "Roiling Rime (A1): Consuming 2 Grimheart stacks creates a Shattered Lightfall Sword dealing 50% of Lightfall Sword Base DMG.",
    "Glacial Illumination: Creates a Lightfall Sword that accumulates energy stacks upon dealing attack DMG, exploding after 7s to deal massive Physical DMG.",
    "Tidal Illusion (C1): Consuming Grimheart stacks grants +30% Physical DMG Bonus for 6s.",
    "The Obstinacy of One's Inferiors (C4): Lightfall Swords deal +25% DMG to enemies under 50% HP.",
    "Noble Obligation (C6): Lightfall Sword starts with 5 energy stacks and has a 50% chance per hit to gain an additional stack."
  ],
  constellations: [
    {
      level: 1,
      name: "Tidal Illusion",
      description: "Every time Grimheart stacks are consumed, Eula's Physical DMG is increased by 30% for 6s. Each stack extends duration by 6s up to 18s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Lady of Seafoam",
      description: "Decreases the cooldown of Icetide Vortex's Holding Mode to match the Tapping Mode cooldown (4s).",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Lawrence Pedigree",
      description: "Increases the Level of Glacial Illumination by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "The Obstinacy of One's Inferiors",
      description: "Lightfall Swords deal 25% increased DMG against opponents with less than 50% HP.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Chivalric Quality",
      description: "Increases the Level of Icetide Vortex by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "Noble Obligation",
      description: "Lightfall Swords start with 5 stacks of energy. Hits dealing DMG have a 50% chance to grant an extra stack.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Physical DPS providing Physical and Cryo RES shred via Icetide Vortex (Hold Mode) consuming Grimheart stacks.",
    buffExplanations: [
      {
        name: "Skill (Hold): Icetide Vortex",
        brief: "-16% to -25% Physical & Cryo RES Shred",
        full: "Consuming Grimheart stacks decreases nearby opponents' Physical RES and Cryo RES (scales with Skill talent level, 25% at Lv 10) for 7s.",
        category: "elemental",
      },
    ],
    statFields: [
      { key: "atk.base", label: "Base ATK", defaultValue: "900" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "160" },
    ],
    buffs: [
      {
        stat: "enemyRes",
        label: "Phys & Cryo RES Shred (Eula Skill Hold)",
        compute: (ctx) => {
          const lvl = ctx.talentLevels?.skill ?? 10;
          return -(15 + Math.min(10, lvl));
        },
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
