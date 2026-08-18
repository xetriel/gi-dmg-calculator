import type { CharacterTalentSeed } from "./types";

const NA_FACTORS = [
  1.0, 1.08139, 1.16278, 1.27913, 1.36053, 1.45339, 1.58139, 1.70921, 1.83722,
  1.97669, 2.11635, 2.256, 2.4186, 2.5814, 2.7442
];

const SKILL_BURST_FACTORS = [
  1.0, 1.075, 1.15, 1.25, 1.325, 1.40, 1.50, 1.60, 1.70, 1.80,
  1.90, 2.00, 2.125, 2.25, 2.375
];

const scaleNA = (base: number) => NA_FACTORS.map(f => Math.round(base * f * 100) / 100);
const scaleSkillBurst = (base: number) => SKILL_BURST_FACTORS.map(f => Math.round(base * f * 100) / 100);

export const mizukiSeed: CharacterTalentSeed = {
  characterId: "mizuki",
  hits: [
    // Normal Attack (Pure Heart, Pure Dreams)
    { hitKey: "1-hit", talentType: "normal", values: scaleNA(47.60) },
    { hitKey: "2-hit", talentType: "normal", values: scaleNA(42.70) },
    { hitKey: "3-hit", talentType: "normal", values: scaleNA(65.00) },
    { hitKey: "charged", talentType: "normal", values: scaleNA(120.00) },
    { hitKey: "plunge", talentType: "normal", values: scaleNA(56.83) },
    { hitKey: "low-plunge", talentType: "normal", values: scaleNA(113.63) },
    { hitKey: "high-plunge", talentType: "normal", values: scaleNA(141.93) },

    // Elemental Skill (Aisa Utamakura Pilgrimage)
    { hitKey: "skill-activation", talentType: "skill", values: scaleSkillBurst(57.70) },
    { hitKey: "dreamdrift-continuous", talentType: "skill", values: scaleSkillBurst(44.90) },
    {
      hitKey: "stellar-swirl-hit",
      talentType: "skill",
      values: Array(15).fill(1000.00)
    },
    { hitKey: "swirl-dmg-bonus", talentType: "skill", values: scaleSkillBurst(10.00), kind: "buff" },

    // Elemental Burst (Anraku Secret Spring Therapy)
    { hitKey: "burst-dmg", talentType: "burst", values: scaleSkillBurst(242.00) },
    { hitKey: "munen-shockwave", talentType: "burst", values: scaleSkillBurst(150.00) },
    { hitKey: "snack-healing", talentType: "burst", values: scaleSkillBurst(100.00), kind: "heal" },
  ]
};
