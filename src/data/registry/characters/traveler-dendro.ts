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
        { key: "charged-2", name: "Charged Attack (Hit 2)", scaling: "atk", hitCategory: "charged", element: "Physical" },
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
      name: "Elemental Burst — Lea Lotus Lamp",
      hits: [
        { key: "lotus-dmg", name: "Lea Lotus Lamp DMG", scaling: "atk", hitCategory: "burst", element: "Dendro" },
        { key: "transfiguration-explosion", name: "Transfiguration Explosion DMG (Pyro)", scaling: "atk", hitCategory: "burst", element: "Dendro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "c6-dendro-buff",
      label: "C6 Moment of Respite (+12% Dendro DMG Bonus)",
      control: "toggle",
      defaultValue: 1,
      hint: "Characters under Lotus Light Transfiguration gain 12% Dendro DMG Bonus."
    }
  ],
  mechanics: [
    "Verdant Overgrowth (A1): Lea Lotus Lamp gains Lotus Light stacks when active.",
    "Verdant Luxuriance (A4): Every point of EM increases Razor-Grass Blade DMG by 0.15% and Lea Lotus Lamp DMG by 0.1%.",
    "Viridian Rising (C2): Extends Lea Lotus Lamp duration by 3s.",
    "Moment of Respite (C6): Characters under Lotus Light Transfiguration gain +12% Dendro DMG Bonus."
  ],
  constellations: [
    { level: 1, name: "Symbiotic Creeper", description: "Razor-Grass Blade restores 3.5 Energy upon hitting an opponent.", effects: [{ type: "informational" }] },
    { level: 2, name: "Viridian Rising", description: "Extends Lea Lotus Lamp duration by 3s.", effects: [{ type: "informational" }] },
    { level: 3, name: "Whisking Verses", description: "Increases the Level of Razor-Grass Blade by 3.", effects: [{ type: "talent_level_bonus", talentType: "skill" }] },
    { level: 4, name: "Treacle Sugar", description: "After Lea Lotus Lamp triggers Lotus Light Transfiguration, gains 5 Lotus Light stacks.", effects: [{ type: "informational" }] },
    { level: 5, name: "Viridian Transience", description: "Increases the Level of Lea Lotus Lamp by 3.", effects: [{ type: "talent_level_bonus", talentType: "burst" }] },
    { level: 6, name: "Moment of Respite", description: "Characters under Lotus Light Transfiguration gain +12% Dendro DMG Bonus.", effects: [{ type: "informational" }] }
  ]
};
