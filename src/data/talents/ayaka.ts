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

export const ayakaSeed: CharacterTalentSeed = {
  characterId: "ayaka",
  hits: [
    // Normal Attack — Kamisato Art: Kabuki
    { hitKey: "1-hit", talentType: "normal", values: scaleNA(45.73) },
    { hitKey: "2-hit", talentType: "normal", values: scaleNA(48.68) },
    { hitKey: "3-hit", talentType: "normal", values: scaleNA(62.62) },
    { hitKey: "4-hit", talentType: "normal", values: scaleNA(22.65) },
    { hitKey: "5-hit", talentType: "normal", values: scaleNA(78.18) },
    { hitKey: "charged", talentType: "normal", values: scaleNA(55.13) },
    { hitKey: "plunge", talentType: "normal", values: scaleNA(63.93) },
    { hitKey: "low-plunge", talentType: "normal", values: scaleNA(127.84) },
    { hitKey: "high-plunge", talentType: "normal", values: scaleNA(159.68) },

    // Elemental Skill — Kamisato Art: Hyouka
    { hitKey: "skill-dmg", talentType: "skill", values: scaleAlternate(239.20) },

    // Elemental Burst — Kamisato Art: Soumetsu
    { hitKey: "cutting-dmg", talentType: "burst", values: scaleAlternate(112.30) },
    { hitKey: "bloom-dmg", talentType: "burst", values: scaleAlternate(168.45) },
  ]
};
