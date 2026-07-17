import type { CharacterTalentSeed } from "./types";

// Standard growth curves for 5-star character talents (Gaming NA & Skill Plunge use standard)
const NA_FACTORS = [
  1.0, 1.08139, 1.16278, 1.27913, 1.36053, 1.45339, 1.58139, 1.70921, 1.83722,
  1.97669, 2.11635, 2.256, 2.4186, 2.5814, 2.7442
];

const SKILL_BURST_FACTORS = [
  1.0, 1.08146, 1.16293, 1.27915, 1.36061, 1.45366, 1.58146, 1.70964, 1.83744,
  1.97683, 2.11659, 2.2560, 2.3957, 2.535, 2.675
];

// Alternate growth curve for Gaming Burst (with 1.80 factor at Level 10)
const ALTERNATE_FACTORS = [
  1.0, 1.075, 1.15, 1.25, 1.325, 1.40, 1.50, 1.60, 1.70, 1.80,
  1.90, 2.00, 2.125, 2.25, 2.375
];

const scaleNA = (base: number) => NA_FACTORS.map(f => Math.round(base * f * 100) / 100);
const scaleSkillBurst = (base: number) => SKILL_BURST_FACTORS.map(f => Math.round(base * f * 100) / 100);
const scaleAlternate = (base: number) => ALTERNATE_FACTORS.map(f => Math.round(base * f * 100) / 100);

export const gamingSeed: CharacterTalentSeed = {
  characterId: "gaming",
  hits: [
    // Normal Attack (Stellar Rend)
    { hitKey: "1-hit", talentType: "normal", values: scaleNA(83.90) },
    { hitKey: "2-hit", talentType: "normal", values: scaleNA(79.00) },
    { hitKey: "3-hit", talentType: "normal", values: scaleNA(106.60) },
    { hitKey: "4-hit", talentType: "normal", values: scaleNA(127.90) },
    { hitKey: "charged-cyclic", talentType: "normal", values: scaleNA(62.50) },
    { hitKey: "charged-final", talentType: "normal", values: scaleNA(113.10) },
    { hitKey: "plunge", talentType: "normal", values: scaleNA(74.59) },
    { hitKey: "low-plunge", talentType: "normal", values: scaleNA(149.14) },
    { hitKey: "high-plunge", talentType: "normal", values: scaleNA(186.29) },

    // Elemental Skill (Bestial Ascent)
    { hitKey: "charmed-cloudstrider-dmg", talentType: "skill", values: scaleSkillBurst(230.40) },

    // Elemental Burst (Suanni's Gilded Dance)
    { hitKey: "smash-dmg", talentType: "burst", values: scaleAlternate(370.40) },
  ]
};
