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

const scaleNA = (base: number) => NA_FACTORS.map(f => Math.round(base * f * 100) / 100);
const scaleSkillBurst = (base: number) => SKILL_BURST_FACTORS.map(f => Math.round(base * f * 100) / 100);

export const skirkSeed: CharacterTalentSeed = {
  characterId: "skirk",
  hits: [
    // Normal Attack (Havoc: Sunder) - ATK-scaled
    { hitKey: "1-hit", talentType: "normal", values: scaleNA(54.52) },
    { hitKey: "2-hit", talentType: "normal", values: scaleNA(49.79) },
    { hitKey: "3-hit-a", talentType: "normal", values: scaleNA(32.42) },
    { hitKey: "3-hit-b", talentType: "normal", values: scaleNA(32.42) },
    { hitKey: "4-hit", talentType: "normal", values: scaleNA(60.80) },
    { hitKey: "5-hit", talentType: "normal", values: scaleNA(82.90) },
    { hitKey: "charged-a", talentType: "normal", values: scaleNA(66.84) },
    { hitKey: "charged-b", talentType: "normal", values: scaleNA(66.84) },
    { hitKey: "plunge", talentType: "normal", values: scaleNA(63.93) },
    { hitKey: "low-plunge", talentType: "normal", values: scaleNA(127.84) },
    { hitKey: "high-plunge", talentType: "normal", values: scaleNA(159.68) },

    // Seven-Phase Flash (Havoc: Warp) - converted to Cryo, scales off Skill level
    { hitKey: "sf-1-hit", talentType: "skill", values: scaleSkillBurst(132.82) },
    { hitKey: "sf-2-hit", talentType: "skill", values: scaleSkillBurst(119.80) },
    { hitKey: "sf-3-hit-a", talentType: "skill", values: scaleSkillBurst(75.72) },
    { hitKey: "sf-3-hit-b", talentType: "skill", values: scaleSkillBurst(75.72) },
    { hitKey: "sf-4-hit-a", talentType: "skill", values: scaleSkillBurst(80.54) },
    { hitKey: "sf-4-hit-b", talentType: "skill", values: scaleSkillBurst(80.54) },
    { hitKey: "sf-5-hit", talentType: "skill", values: scaleSkillBurst(196.62) },
    // C1 crystal blade deals flat 500% ATK across all levels
    { hitKey: "c1-blade", talentType: "skill", values: Array(15).fill(500.0) },

    // Elemental Burst (Havoc: Ruin)
    // Slashes: 220.968% at L10 -> base 111.78%
    { hitKey: "slash-dmg", talentType: "burst", values: scaleSkillBurst(111.78) },
    // Final Slash: 368.28% at L10 -> base 186.30%
    { hitKey: "final-dmg", talentType: "burst", values: scaleSkillBurst(186.30) },
    // C6 Sever DMG deals flat 750% ATK across all levels
    { hitKey: "sever-dmg", talentType: "burst", values: Array(15).fill(750.0) },
  ],
};
