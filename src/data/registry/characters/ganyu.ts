import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const ganyu: CharacterConfig = {
  id: "ganyu",
  name: "Ganyu",
  rarity: 5,
  element: "Cryo",
  weapon: "Bow",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Cryo DMG Bonus%",
  stats: coreStats("Cryo DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Liutian Archery",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "6-hit", name: "6-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "aimed", name: "Aimed Shot", scaling: "atk", element: "Physical" },
        { key: "aimed-charge-1", name: "Aimed Shot Charge Level 1", scaling: "atk", hitCategory: "charged", element: "Cryo" },
        { key: "frostflake-arrow", name: "Frostflake Arrow DMG", scaling: "atk", hitCategory: "charged", element: "Cryo" },
        { key: "frostflake-bloom", name: "Frostflake Arrow Bloom DMG", scaling: "atk", hitCategory: "charged", element: "Cryo" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Trail of the Qilin",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill", element: "Cryo" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Celestial Shower",
      hits: [
        { key: "ice-shard", name: "Ice Shard DMG", scaling: "atk", hitCategory: "burst", element: "Cryo" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "a1-crit-buff",
      label: "A1 Undivided Heart (+20% Frostflake CRIT Rate)",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: Firing a Frostflake Arrow increases the CRIT Rate of subsequent Frostflake Arrows and Bloom effects by 20%."
    },
    {
      id: "a4-cryo-buff",
      label: "A4 Harmony Between Heaven and Earth (+20% Cryo DMG Bonus)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: Active party members within Celestial Shower's AoE gain a 20% Cryo DMG Bonus."
    },
    {
      id: "c1-cryo-res-shred",
      label: "C1 Dew-Drinker (-15% Cryo RES Shred)",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: Taking DMG from Charge Level 2 Frostflake Arrow or Bloom decreases opponent Cryo RES by 15% for 6s."
    },
    {
      id: "c4-dmg-stacks",
      label: "C4 Westward Sojourn Increased DMG Taken Stacks",
      control: "stacks",
      max: 5,
      defaultValue: 0,
      hint: "C4: Opponents in Celestial Shower take increased DMG (+5% per 3s up to +25%)."
    }
  ],
  mechanics: [
    "Undivided Heart (A1): After firing a Frostflake Arrow, CRIT Rate of Frostflake Arrows and Blooms is increased by 20% for 5s.",
    "Harmony Between Heaven and Earth (A4): Celestial Shower grants +20% Cryo DMG Bonus to active characters in its AoE.",
    "Dew-Drinker (C1): Frostflake Arrow or Bloom hits decrease enemy Cryo RES by 15% for 6s.",
    "Westward Sojourn (C4): Enemies inside Celestial Shower take 5% increased DMG every 3s (max 5 stacks = +25% DMG taken)."
  ],
  constellations: [
    {
      level: 1,
      name: "Dew-Drinker",
      description: "Taking DMG from a Charge Level 2 Frostflake Arrow or Bloom decreases opponents' Cryo RES by 15% for 6s. Regenerates 2 Energy on hit.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "The Auspicious",
      description: "Trail of the Qilin gains 1 additional charge.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Cloud-Strider",
      description: "Increases the Level of Celestial Shower by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "Westward Sojourn",
      description: "Opponents in Celestial Shower take increased DMG (+5% every 3s, max +25%).",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "The Merciful",
      description: "Increases the Level of Trail of the Qilin by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "The Clement",
      description: "Using Trail of the Qilin causes the next Frostflake Arrow shot within 30s to not require charging.",
      effects: [{ type: "informational" }]
    }
  ]
};
