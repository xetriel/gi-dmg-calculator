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

export const mavuikaSeed: CharacterTalentSeed = {
  characterId: "mavuika",
  hits: [
    // Normal Attack — Flames Weave Life (standard claymore)
    { hitKey: "1-hit", talentType: "normal", values: scaleNA(80.0) },
    { hitKey: "2-hit", talentType: "normal", values: scaleNA(36.5) },         // ×2 hits
    { hitKey: "3-hit", talentType: "normal", values: scaleNA(33.2) },         // ×3 hits
    { hitKey: "4-hit", talentType: "normal", values: scaleNA(116.2) },
    { hitKey: "charged-cyclic", talentType: "normal", values: scaleNA(68.8) },
    { hitKey: "charged-final", talentType: "normal", values: scaleNA(125.2) },
    { hitKey: "plunge", talentType: "normal", values: scaleNA(74.59) },
    { hitKey: "low-plunge", talentType: "normal", values: scaleNA(149.14) },
    { hitKey: "high-plunge", talentType: "normal", values: scaleNA(186.29) },

    // Elemental Skill — The Named Moment (Flamestrider attacks scale with Skill level)
    { hitKey: "skill-dmg", talentType: "skill", values: scaleSkillBurst(74.4) },
    { hitKey: "ring-dmg", talentType: "skill", values: scaleSkillBurst(128.0) },
    { hitKey: "flamestrider-1-hit", talentType: "skill", values: scaleSkillBurst(57.3) },
    { hitKey: "flamestrider-2-hit", talentType: "skill", values: scaleSkillBurst(59.1) },
    { hitKey: "flamestrider-3-hit", talentType: "skill", values: scaleSkillBurst(70.0) },
    { hitKey: "flamestrider-4-hit", talentType: "skill", values: scaleSkillBurst(69.7) },
    { hitKey: "flamestrider-5-hit", talentType: "skill", values: scaleSkillBurst(91.0) },
    { hitKey: "flamestrider-charged-cyclic", talentType: "skill", values: scaleSkillBurst(98.9) },
    { hitKey: "flamestrider-charged-final", talentType: "skill", values: scaleSkillBurst(137.6) },

    // Elemental Burst — Hour of Burning Skies
    { hitKey: "sunfell-slice", talentType: "burst", values: scaleSkillBurst(444.8) },
    // Fighting Spirit per-point flat DMG bonuses (% of ATK per point of Fighting Spirit)
    { hitKey: "fs-sunfell-bonus", talentType: "burst", kind: "buff", values: scaleSkillBurst(1.6) },
    { hitKey: "fs-na-bonus", talentType: "burst", kind: "buff", values: scaleSkillBurst(0.26) },
    { hitKey: "fs-ca-bonus", talentType: "burst", kind: "buff", values: scaleSkillBurst(0.52) },
  ]
};
