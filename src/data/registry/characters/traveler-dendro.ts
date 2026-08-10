import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const travelerDendro: CharacterConfig = {
  id: "traveler-dendro",
  name: "Traveler (Dendro)",
  rarity: 5,
  element: "Dendro",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "ATK%", maxValue: 24.0 },
  dmgBonusLabel: "Dendro DMG Bonus%",
  stats: coreStats("ATK%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Foreign Fieldcleaver",
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
      name: "Elemental Skill — Razor-Grass Blade",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill", element: "Dendro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Surgent Manifestation",
      hits: [
        { key: "lotus-dmg", name: "Lea Lotus Lamp DMG", scaling: "atk", hitCategory: "burst", element: "Dendro" },
        { key: "transfiguration-explosion", name: "Transfiguration Explosion DMG (Pyro)", scaling: "atk", hitCategory: "burst", element: "Pyro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "a1-lotus-light-stacks",
      label: "A1 Verdant Overgrowth — Lotus Light Stacks (+6 EM / stack, max 10)",
      control: "slider",
      min: 0,
      max: 10,
      defaultValue: 10,
      hint: "Lea Lotus Lamp gains 1 stack per second while active, increasing active character's EM by 6 per stack (max +60 EM)."
    },
    {
      id: "c6-dendro-buff",
      label: "C6 Moment of Respite (+12% Dendro DMG Bonus)",
      control: "toggle",
      defaultValue: 1,
      hint: "Characters under Lotus Light Transfiguration gain 12% Dendro DMG Bonus."
    },
    {
      id: "c6-transmuted-element",
      label: "C6 Transmuted Element DMG Bonus (+12% Hydro / Electro / Pyro DMG Bonus)",
      control: "select",
      options: [
        { label: "None (Dendro Only)", value: "none" },
        { label: "Hydro (+12% Hydro DMG)", value: "hydro" },
        { label: "Electro (+12% Electro DMG)", value: "electro" },
        { label: "Pyro (+12% Pyro DMG)", value: "pyro" },
      ],
      defaultValue: "none",
      hint: "If Lea Lotus Lamp underwent Transfiguration, active character gains an additional 12% DMG Bonus of that element."
    }
  ],
  mechanics: [
    "Verdant Overgrowth (A1): Lea Lotus Lamp gains 1 stack per second (max 10), granting +6 EM per stack.",
    "Verdant Luxuriance (A4): Every point of EM increases Razor-Grass Blade DMG by 0.15% and Lea Lotus Lamp DMG by 0.1%.",
    "Viridian Rising (C2): Extends Lea Lotus Lamp duration by 3s.",
    "Treacle Sugar (C4): Instantly grants 5 Lotus Light stacks (+30 EM) upon Transfiguration.",
    "Moment of Respite (C6): Characters under Lotus Light Transfiguration gain +12% Dendro DMG Bonus (and +12% corresponding element if transmuted)."
  ],
  constellations: [
    { level: 1, name: "Symbiotic Creeper", description: "Razor-Grass Blade restores 3.5 Energy upon hitting an opponent.", effects: [{ type: "informational" }] },
    { level: 2, name: "Viridian Rising", description: "Extends Lea Lotus Lamp duration by 3s.", effects: [{ type: "informational" }] },
    { level: 3, name: "Whisking Verses", description: "Increases the Level of Razor-Grass Blade by 3.", effects: [{ type: "talent_level_bonus", talentType: "skill" }] },
    { level: 4, name: "Treacle Sugar", description: "After Lea Lotus Lamp triggers Lotus Light Transfiguration, gains 5 Lotus Light stacks.", effects: [{ type: "informational" }] },
    { level: 5, name: "Viridian Transience", description: "Increases the Level of Surgent Manifestation by 3.", effects: [{ type: "talent_level_bonus", talentType: "burst" }] },
    { level: 6, name: "Moment of Respite", description: "Characters under Lotus Light Transfiguration gain +12% Dendro DMG Bonus. If Lamp transmuted, they also gain +12% corresponding element DMG Bonus.", effects: [{ type: "informational" }] }
  ]
};
