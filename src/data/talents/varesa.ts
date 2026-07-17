import type { CharacterTalentSeed } from "./types";

// Standard growth curves for 5-star character talents
const NA_FACTORS = [
  1.0, 1.08139, 1.16278, 1.27913, 1.36053, 1.45339, 1.58139, 1.70921, 1.83722,
  1.97669, 2.11635, 2.256, 2.4186, 2.5814, 2.7442
];

const SKILL_BURST_FACTORS = [
  1.0, 1.08146, 1.16293, 1.27915, 1.36061, 1.45366, 1.58146, 1.70964, 1.83744,
  1.97683, 2.11659, 2.2560, 2.3957, 2.535, 2.675
];

// Varesa alternate growth curve for normal strikes, charged, and skill rush
const ALTERNATE_FACTORS = [
  1.0, 1.075, 1.15, 1.25, 1.325, 1.40, 1.50, 1.60, 1.70, 1.80,
  1.90, 2.00, 2.125, 2.25, 2.375
];

const scaleNA = (base: number) => NA_FACTORS.map(f => Math.round(base * f * 100) / 100);
const scaleSkillBurst = (base: number) => SKILL_BURST_FACTORS.map(f => Math.round(base * f * 100) / 100);
const scaleAlternate = (base: number) => ALTERNATE_FACTORS.map(f => Math.round(base * f * 100) / 100);

export const varesaSeed: CharacterTalentSeed = {
  characterId: "varesa",
  hits: [
    // Normal Attack (By the Horns)
    { hitKey: "1-hit", talentType: "normal", values: scaleAlternate(46.80) },
    { hitKey: "2-hit", talentType: "normal", values: scaleAlternate(40.00) },
    { hitKey: "3-hit", talentType: "normal", values: scaleAlternate(56.30) },
    { hitKey: "charged", talentType: "normal", values: scaleAlternate(89.30) },
    { hitKey: "plunge", talentType: "normal", values: scaleNA(74.59) },
    { hitKey: "low-plunge", talentType: "normal", values: scaleNA(149.14) },
    { hitKey: "high-plunge", talentType: "normal", values: scaleNA(186.29) },

    // Elemental Skill (Riding the Night-Rainbow)
    { hitKey: "rush-dmg", talentType: "skill", values: scaleAlternate(74.48) },
    { hitKey: "fiery-rush-dmg", talentType: "skill", values: scaleAlternate(106.40) },

    // Elemental Burst (Guardian Vent!)
    { hitKey: "kick-dmg", talentType: "burst", values: scaleSkillBurst(296.79) },
    { hitKey: "fiery-kick-dmg", talentType: "burst", values: scaleSkillBurst(494.65) },
    { hitKey: "volcano-kablam-dmg", talentType: "burst", values: scaleSkillBurst(346.26) },
  ]
};
