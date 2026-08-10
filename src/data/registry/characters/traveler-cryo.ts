import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const travelerCryo: CharacterConfig = {
  id: "traveler-cryo",
  name: "Traveler (Cryo) (Beta)",
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
        { key: "stellar-conduct-javelin-dmg", name: "Stellar-Conduct Ice Javelin Strike DMG", scaling: "atk", hitCategory: "burst", element: "Cryo" },
        { key: "stellar-swirl-javelin-dmg", name: "Stellar Swirl Ice Javelin Strike DMG", scaling: "atk", hitCategory: "burst", element: "Cryo" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "frostglow-stacks",
      label: "Frostglow Stacks (0–8 Stacks)",
      control: "stacks",
      max: 8,
      defaultValue: 8,
      hint: "Consuming Frostglow stacks increases Burst DMG by +4.96% per stack (up to +39.68%). At 8 stacks, grants 2 additional strikes."
    },
    {
      id: "c1-frost-shred",
      label: "C1 Frostbite Glare (-15% Cryo RES)",
      control: "toggle",
      defaultValue: 1,
      hint: "Opponents hit by Ice Fog Piercer have their Cryo RES decreased by 15% for 12s."
    },
    {
      id: "c6-cryo-infusion",
      label: "C6 Glacial Dominion (Cryo Infusion & +40% CRIT DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Converts Normal, Charged, and Plunging Attacks to Cryo DMG and grants +40% CRIT DMG to Cryo attacks."
    }
  ],
  mechanics: [
    "Frostglow Stacks (0–8): Gained via Frostpierce Star coordinated attacks. Consumed on Burst cast for +4.96% DMG per stack.",
    "Frostbite Glare (C1): Decreases target Cryo RES by 15% for 12s on Skill hit.",
    "Glacial Dominion (C6): Cryo Infusion for NA/CA/Plunge + 40% CRIT DMG for Cryo attacks."
  ],
  constellations: [
    { level: 1, name: "Frostbite Glare", description: "Opponents hit by Ice Fog Piercer have their Cryo RES decreased by 15% for 12s.", effects: [{ type: "informational" }] },
    { level: 2, name: "Sub-Zero Aura", description: "Restores 1.5 Energy to the Traveler whenever Frostpierce Star fires an Ice Crystal.", effects: [{ type: "informational" }] },
    { level: 3, name: "Glacier Strike", description: "Increases the Level of Frostbound Javelin by 3.", effects: [{ type: "talent_level_bonus", talentType: "burst" }] },
    { level: 4, name: "Hoarfrost Shield", description: "Creates a Cryo Shield absorbing DMG equal to 12% Max HP when casting Elemental Burst.", effects: [{ type: "informational" }] },
    { level: 5, name: "Rime Spike", description: "Increases the Level of Ice Fog Piercer by 3.", effects: [{ type: "talent_level_bonus", talentType: "skill" }] },
    { level: 6, name: "Glacial Dominion", description: "Converts Normal, Charged, and Plunging Attacks to Cryo DMG and grants 40% CRIT DMG to Cryo attacks.", effects: [{ type: "informational" }] }
  ]
};
