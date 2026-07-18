import type { CharacterTalentSeed } from "./types";

// Standard growth curves for 5-star character talents
const NA_FACTORS = [
  1.0, 1.08139, 1.16278, 1.27913, 1.36053, 1.45339, 1.58139, 1.70921, 1.83722,
  1.97669, 2.11635, 2.256, 2.4186, 2.5814, 2.7442
];

// Alternate growth curve for Durin's Skill, Burst and Summons (with 1.80 factor at Level 10)
const ALTERNATE_FACTORS = [
  1.0, 1.075, 1.15, 1.25, 1.325, 1.40, 1.50, 1.60, 1.70, 1.80,
  1.90, 2.00, 2.125, 2.25, 2.375
];

const scaleNA = (base: number) => NA_FACTORS.map(f => Math.round(base * f * 100) / 100);
const scaleAlternate = (base: number) => ALTERNATE_FACTORS.map(f => Math.round(base * f * 100) / 100);

export const durinSeed: CharacterTalentSeed = {
  characterId: "durin",
  hits: [
    // Normal Attack (Radiant Wingslash)
    { hitKey: "1-hit", talentType: "normal", values: scaleNA(45.65) },
    { hitKey: "2-hit", talentType: "normal", values: scaleNA(41.00) },
    { hitKey: "3-hit", talentType: "normal", values: scaleNA(58.32) },
    { hitKey: "4-hit", talentType: "normal", values: scaleNA(71.15) },
    { hitKey: "charged", talentType: "normal", values: scaleNA(113.43) },
    { hitKey: "plunge", talentType: "normal", values: scaleNA(63.93) },
    { hitKey: "low-plunge", talentType: "normal", values: scaleNA(127.84) },
    { hitKey: "high-plunge", talentType: "normal", values: scaleNA(159.68) },

    // Elemental Skill (Binary Form: Convergence and Division)
    { hitKey: "purity-skill-dmg", talentType: "skill", values: scaleAlternate(105.60) },
    { hitKey: "darkness-skill-1", talentType: "skill", values: scaleAlternate(72.24) },
    { hitKey: "darkness-skill-2", talentType: "skill", values: scaleAlternate(53.20) },
    { hitKey: "darkness-skill-3", talentType: "skill", values: scaleAlternate(64.64) },

    // Elemental Burst (Principles of Purity & Darkness)
    { hitKey: "purity-burst-1", talentType: "burst", values: scaleAlternate(45.65) },
    { hitKey: "purity-burst-2", talentType: "burst", values: scaleAlternate(41.00) },
    { hitKey: "purity-burst-3", talentType: "burst", values: scaleAlternate(58.32) },
    { hitKey: "white-flame-dmg", talentType: "burst", values: scaleAlternate(94.64) },
    { hitKey: "darkness-burst-1", talentType: "burst", values: scaleAlternate(45.65) },
    { hitKey: "darkness-burst-2", talentType: "burst", values: scaleAlternate(41.00) },
    { hitKey: "darkness-burst-3", talentType: "burst", values: scaleAlternate(58.32) },
    { hitKey: "dark-decay-dmg", talentType: "burst", values: scaleAlternate(129.84) },
  ]
};
