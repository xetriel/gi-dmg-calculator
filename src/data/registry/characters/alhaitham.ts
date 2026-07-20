import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const alhaitham: CharacterConfig = {
  id: "alhaitham",
  name: "Alhaitham",
  rarity: 5,
  element: "Dendro",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "Dendro DMG Bonus", maxValue: 28.8 },
  dmgBonusLabel: "Dendro DMG Bonus%",
  stats: coreStats("Dendro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Abductive Reasoning",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        atk("4-hit", "4-Hit"),
        atk("5-hit", "5-Hit"),
        atkCharged("charged", "Charged Attack"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Universality: An Elaboration on Form",
      hits: [
        { key: "rush-dmg", name: "Rush DMG", scaling: "atk", hitCategory: "skill" },
        { key: "projection-1", name: "1-Mirror Projection DMG", scaling: "atk", hitCategory: "skill" },
        { key: "projection-2", name: "2-Mirror Projection DMG", scaling: "atk", hitCategory: "skill" },
        { key: "projection-3", name: "3-Mirror Projection DMG", scaling: "atk", hitCategory: "skill" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Particular Field: Fetters of Phenomena",
      hits: [
        { key: "burst-dmg", name: "Single-Instance DMG", scaling: "atk", hitCategory: "burst" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "dendro-infusion",
      label: "Dendro Infusion (Chisel-Light Mirror)",
      control: "toggle",
      defaultValue: 1,
      hint: "Converts Normal, Charged, and Plunging Attacks into Dendro DMG."
    },
    {
      id: "alhaitham-c2-stacks",
      label: "C2 Rhetoric EM Stacks",
      control: "stacks",
      max: 4,
      defaultValue: 0,
      hint: "C2: Generating Chisel-Light Mirrors increases EM by 50 per stack (max 4 stacks)."
    },
    {
      id: "alhaitham-c4-dmg-bonus-stacks",
      label: "C4 Elucidation Dendro DMG Stacks",
      control: "stacks",
      max: 3,
      defaultValue: 0,
      hint: "C4: Generates Chisel-Light Mirrors to gain 10% Dendro DMG Bonus per stack (max 3 stacks)."
    },
    {
      id: "alhaitham-c6-crit",
      label: "C6 Structuration Max Mirrors CRIT Buff",
      control: "toggle",
      defaultValue: 0,
      hint: "C6: Generating mirrors at maximum count increases CRIT Rate by 10% and CRIT DMG by 70%."
    }
  ],
  mechanics: [
    "Mysteries Laid Bare (A4): Skill Projection and Burst DMG increased by 0.1% for every point of EM (max 100%).",
    "Rhetoric (C2): Mirror generation grants 50 EM per stack (max 4 stacks).",
    "Elucidation (C4): Mirror generation grants 10% Dendro DMG Bonus per stack (max 3 stacks).",
    "Structuration (C6): Redundant mirror generation increases CRIT Rate by 10% and CRIT DMG by 70%."
  ],
  constellations: [
    {
      level: 1,
      name: "Intuition",
      description: "Projection Attack hits reduce Elemental Skill CD by 1.2s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Rhetoric",
      description: "Mirror generation increases EM by 50 for 8s. Max 4 stacks.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Negation",
      description: "Increases the Level of Elemental Skill by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Elucidation",
      description: "Mirror generation increases Alhaitham's Dendro DMG Bonus by 10% per stack (max 3 stacks).",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Sagacity",
      description: "Increases the Level of Elemental Burst by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Structuration",
      description: "Generating mirrors at maximum stack count increases CRIT Rate by 10% and CRIT DMG by 70% for 6s.",
      effects: [{ type: "informational" }]
    }
  ]
};
