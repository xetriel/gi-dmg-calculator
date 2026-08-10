import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const travelerPyro: CharacterConfig = {
  id: "traveler-pyro",
  name: "Traveler (Pyro)",
  rarity: 5,
  element: "Pyro",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "ATK%", maxValue: 24.0 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("ATK%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Foreign Starfire",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged-1", name: "Charged Attack (Hit 1)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2-aether", name: "Charged Attack (Hit 2 — Aether)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-2-lumine", name: "Charged Attack (Hit 2 — Lumine)", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-inferno", name: "Charged Attack: Inferno (Special Passive)", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Flowfire Blade",
      hits: [
        { key: "blazing-threshold-dmg", name: "Blazing Threshold DMG (Tap Skill)", scaling: "atk", hitCategory: "skill", element: "Pyro" },
        { key: "hold-dmg", name: "Hold Skill DMG", scaling: "atk", hitCategory: "skill", element: "Pyro" },
        { key: "scorching-threshold-dmg", name: "Scorching Threshold DMG (Hold Interval)", scaling: "atk", hitCategory: "skill", element: "Pyro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Plains Scorcher",
      hits: [
        { key: "burst-dmg", name: "Skill DMG (Mark Blast)", scaling: "atk", hitCategory: "burst", element: "Pyro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "c1-starfire",
      label: "C1 Starfire's Flowing Light (+6% DMG, or +15% if Nightsoul Active)",
      control: "toggle",
      defaultValue: 1,
      hint: "Active character deals +6% DMG while Blazing/Scorching Threshold is active (+15% total if in Nightsoul's Blessing)."
    },
    {
      id: "c1-nightsoul-active",
      label: "C1 Nightsoul's Blessing Active (+15% total DMG instead of +6%)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases C1 DMG Bonus from +6% to +15% when in Nightsoul's Blessing state."
    },
    {
      id: "c4-ravaging-flame",
      label: "C4 Ravaging Flame (+20% Pyro DMG Bonus)",
      control: "toggle",
      defaultValue: 1,
      hint: "After using Elemental Burst, increases Pyro DMG Bonus by 20% for 12s."
    },
    {
      id: "c6-sacred-flame",
      label: "C6 The Sacred Flame Imperishable (Pyro Infusion & +40% CRIT DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Converts Normal, Charged, and Plunging Attacks to Pyro DMG and grants +40% CRIT DMG to Pyro attacks."
    }
  ],
  mechanics: [
    "Firekin Resonating: Pyro elemental attacks and Nightsoul Blessing mechanics.",
    "Starfire's Flowing Light (C1): Grants +6% DMG Bonus (+15% in Nightsoul's Blessing).",
    "Ever-Lit Candle (C2): Restores Nightsoul points on Pyro elemental reactions.",
    "Ravaging Flame (C4): Grants +20% Pyro DMG Bonus after casting Burst.",
    "The Sacred Flame Imperishable (C6): Pyro Infusion for NA/CA/Plunge + 40% CRIT DMG for Pyro Attacks."
  ],
  constellations: [
    { level: 1, name: "Starfire's Flowing Light", description: "While Blazing Threshold or Scorching Threshold is active, the active character deals 6% increased DMG. If in Nightsoul's Blessing, they deal an additional 9% DMG.", effects: [{ type: "informational" }] },
    { level: 2, name: "Ever-Lit Candle", description: "Restores Nightsoul points when nearby party members trigger Pyro-related reactions.", effects: [{ type: "informational" }] },
    { level: 3, name: "Relayed Beacon", description: "Increases the Level of Flowfire Blade by 3.", effects: [{ type: "talent_level_bonus", talentType: "skill" }] },
    { level: 4, name: "Ravaging Flame", description: "After using Elemental Burst, grants 20% Pyro DMG Bonus for 12s.", effects: [{ type: "informational" }] },
    { level: 5, name: "The Fire Inextinguishable", description: "Increases the Level of Plains Scorcher by 3.", effects: [{ type: "talent_level_bonus", talentType: "burst" }] },
    { level: 6, name: "The Sacred Flame Imperishable", description: "Normal, Charged, and Plunging Attacks deal Pyro DMG while in Nightsoul's Blessing state and gain 40% CRIT DMG.", effects: [{ type: "informational" }] }
  ]
};
