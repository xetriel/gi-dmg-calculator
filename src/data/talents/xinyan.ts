import type { CharacterTalentSeed } from "./types";

const SKILL_BURST_FACTORS = [
  1.0, 1.075, 1.15, 1.25, 1.325, 1.40, 1.50, 1.60, 1.70, 1.80,
  1.90, 2.00, 2.125, 2.25, 2.375
];

const scaleSkillBurst = (base: number) => SKILL_BURST_FACTORS.map(f => Math.round(base * f * 100) / 100);

export const xinyanSeed: CharacterTalentSeed = {
  characterId: "xinyan",
  hits: [
    // Normal Attack (Dance on Fire)
    {
      hitKey: "1-hit",
      talentType: "normal",
      values: [76.5, 82.8, 89.0, 97.9, 104.1, 111.3, 121.0, 130.8, 140.6, 151.3, 162.0, 172.7, 184.4, 196.1, 207.8]
    },
    {
      hitKey: "2-hit",
      talentType: "normal",
      values: [74.0, 80.0, 86.0, 94.6, 100.6, 107.5, 117.0, 126.4, 135.9, 146.2, 156.5, 166.9, 178.2, 189.5, 200.8]
    },
    {
      hitKey: "3-hit",
      talentType: "normal",
      values: [95.5, 103.2, 111.0, 122.1, 129.9, 138.8, 151.0, 163.2, 175.4, 188.7, 202.0, 215.3, 229.9, 244.5, 259.1]
    },
    {
      hitKey: "4-hit",
      talentType: "normal",
      values: [115.8, 125.3, 134.7, 148.2, 157.6, 168.4, 183.2, 198.0, 212.8, 229.0, 245.2, 261.4, 279.1, 296.8, 314.5]
    },
    {
      hitKey: "charged-cyclic",
      talentType: "normal",
      values: [62.6, 67.6, 72.7, 80.0, 85.1, 90.9, 98.9, 106.9, 114.9, 123.6, 132.4, 141.1, 150.7, 160.2, 169.8]
    },
    {
      hitKey: "charged-final",
      talentType: "normal",
      values: [113.0, 122.0, 132.0, 145.0, 154.0, 164.0, 179.0, 193.0, 208.0, 224.0, 239.0, 255.0, 272.0, 290.0, 307.0]
    },
    {
      hitKey: "plunge",
      talentType: "normal",
      values: [74.59, 80.7, 86.7, 95.4, 101.5, 108.4, 118.0, 127.5, 137.0, 147.44, 157.8, 168.3, 179.7, 191.1, 202.5]
    },
    {
      hitKey: "low-plunge",
      talentType: "normal",
      values: [149.14, 161.4, 173.3, 190.8, 203.0, 216.7, 235.9, 255.0, 274.0, 294.82, 315.6, 336.5, 359.3, 382.1, 404.9]
    },
    {
      hitKey: "high-plunge",
      talentType: "normal",
      values: [186.29, 201.6, 216.5, 238.3, 253.5, 270.7, 294.7, 318.5, 342.3, 368.25, 394.2, 420.3, 448.8, 477.3, 505.8]
    },

    // Elemental Skill (Sweeping Fervor)
    {
      hitKey: "swing-dmg",
      talentType: "skill",
      values: scaleSkillBurst(170.0)
    },
    {
      hitKey: "shield-lv1",
      talentType: "skill",
      values: scaleSkillBurst(104.0),
      kind: "shield"
    },
    {
      hitKey: "shield-lv2",
      talentType: "skill",
      values: scaleSkillBurst(122.4),
      kind: "shield"
    },
    {
      hitKey: "shield-lv3",
      talentType: "skill",
      values: scaleSkillBurst(144.0),
      kind: "shield"
    },
    {
      hitKey: "dot-dmg",
      talentType: "skill",
      values: scaleSkillBurst(33.6)
    },

    // Elemental Burst (Riff Revolution)
    {
      hitKey: "burst-physical",
      talentType: "burst",
      values: scaleSkillBurst(340.8)
    },
    {
      hitKey: "burst-pyro-dot",
      talentType: "burst",
      values: scaleSkillBurst(40.0)
    }
  ]
};
