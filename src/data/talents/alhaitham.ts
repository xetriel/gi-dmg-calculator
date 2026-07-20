import type { CharacterTalentSeed } from "./types";

// Standard growth curves for 5-star character talents
const NA_FACTORS = [
  1.0, 1.08139, 1.16278, 1.27913, 1.36053, 1.45339, 1.58139, 1.70921, 1.83722,
  1.97669, 2.11635, 2.256, 2.4186, 2.5814, 2.7442
];

// Alternate growth curve for Skill & Burst (1.80 factor at Level 10)
const ALTERNATE_FACTORS = [
  1.0, 1.075, 1.15, 1.25, 1.325, 1.40, 1.50, 1.60, 1.70, 1.80,
  1.90, 2.00, 2.125, 2.25, 2.375
];

const scaleNA = (base: number) => NA_FACTORS.map(f => Math.round(base * f * 100) / 100);
const scaleAlternate = (base: number) => ALTERNATE_FACTORS.map(f => Math.round(base * f * 100) / 100);

export const alhaithamSeed: CharacterTalentSeed = {
  characterId: "alhaitham",
  hits: [
    // Normal Attack — Abductive Reasoning
    { hitKey: "1-hit", talentType: "normal", values: scaleNA(49.50) },
    { hitKey: "2-hit", talentType: "normal", values: scaleNA(50.70) },
    { hitKey: "3-hit", talentType: "normal", values: scaleNA(68.40) },
    { hitKey: "4-hit", talentType: "normal", values: scaleNA(66.80) },
    { hitKey: "5-hit", talentType: "normal", values: scaleNA(83.90) },
    { hitKey: "charged", talentType: "normal", values: scaleNA(110.60) },
    { hitKey: "plunge", talentType: "normal", values: scaleNA(63.90) },
    { hitKey: "low-plunge", talentType: "normal", values: scaleNA(127.80) },
    { hitKey: "high-plunge", talentType: "normal", values: scaleNA(159.70) },

    // Elemental Skill — Universality: An Elaboration on Form
    { hitKey: "rush-dmg", talentType: "skill", values: scaleAlternate(193.60) },
    { hitKey: "projection-1", talentType: "skill", values: scaleAlternate(67.20) },
    { hitKey: "projection-2", talentType: "skill", values: scaleAlternate(134.40) },
    { hitKey: "projection-3", talentType: "skill", values: scaleAlternate(201.60) },

    // Elemental Burst — Particular Field: Fetters of Phenomena
    { hitKey: "burst-dmg", talentType: "burst", values: scaleAlternate(121.60) },
  ]
};
