import type { CharacterTalentSeed } from "./types";

export const xilonenSeed: CharacterTalentSeed = {
  characterId: "xilonen",
  hits: [
    // Normal Attack — Ehecatl's Roar
    {
      hitKey: "1-hit",
      talentType: "normal",
      values: [51.79, 56.01, 60.22, 66.25, 70.46, 75.28, 81.90, 88.53, 95.15, 102.38, 109.61, 116.84, 124.07, 131.30],
    },
    {
      hitKey: "2-hit",
      talentType: "normal",
      values: [27.37, 29.60, 31.83, 35.01, 37.24, 39.79, 43.29, 46.79, 50.29, 54.11, 57.93, 61.75, 65.57, 69.39],
    },
    {
      hitKey: "3-hit",
      talentType: "normal",
      values: [72.95, 78.89, 84.82, 93.31, 99.25, 106.03, 115.36, 124.69, 134.02, 144.20, 154.38, 164.56, 174.74, 184.92],
    },
    {
      hitKey: "charged",
      talentType: "normal",
      values: [91.33, 98.77, 106.20, 116.82, 124.25, 132.75, 144.43, 156.11, 167.80, 180.54, 193.28, 206.02, 218.76, 231.50],
    },
    {
      hitKey: "plunge",
      talentType: "normal",
      values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.92, 101.10, 109.28, 117.46, 126.38, 135.30, 144.22, 153.14, 162.06],
    },
    {
      hitKey: "low-plunge",
      talentType: "normal",
      values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.70, 270.54, 288.38, 306.22, 324.06],
    },
    {
      hitKey: "high-plunge",
      talentType: "normal",
      values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92, 360.20, 382.48, 404.76],
    },
    {
      hitKey: "blade-roller-1",
      talentType: "normal",
      values: [56.02, 60.58, 65.14, 71.66, 76.22, 81.43, 88.59, 95.76, 102.92, 110.74, 118.56, 126.38, 134.20, 142.02],
    },
    {
      hitKey: "blade-roller-2",
      talentType: "normal",
      values: [55.05, 59.53, 64.01, 70.41, 74.89, 80.01, 87.05, 94.09, 101.13, 108.82, 116.50, 124.18, 131.86, 139.54],
    },
    {
      hitKey: "blade-roller-3",
      talentType: "normal",
      values: [65.82, 71.17, 76.53, 84.18, 89.54, 95.66, 104.08, 112.50, 120.92, 130.10, 139.28, 148.46, 157.64, 166.82],
    },
    {
      hitKey: "blade-roller-4",
      talentType: "normal",
      values: [86.03, 93.03, 100.03, 110.04, 117.04, 125.04, 136.04, 147.05, 158.05, 170.05, 182.06, 194.07, 206.08, 218.09],
    },

    // Elemental Skill — Yohual's Scratch
    {
      hitKey: "rush-dmg",
      talentType: "skill",
      values: [179.20, 192.64, 206.08, 224.00, 237.44, 250.88, 268.80, 286.72, 304.64, 322.56, 340.48, 358.40, 380.80, 403.20],
    },

    // Elemental Burst — Ocelotlicue Point!
    {
      hitKey: "burst-dmg",
      talentType: "burst",
      values: [281.28, 302.38, 323.47, 351.60, 372.70, 393.79, 421.92, 450.05, 478.18, 506.30, 534.43, 562.56, 597.72, 632.88],
    },
    {
      hitKey: "follow-up-beat",
      talentType: "burst",
      values: [281.28, 302.38, 323.47, 351.60, 372.70, 393.79, 421.92, 450.05, 478.18, 506.30, 534.43, 562.56, 597.72, 632.88],
    },
    {
      hitKey: "burst-heal",
      talentType: "burst",
      kind: "heal",
      values: [104.00, 111.80, 119.60, 130.00, 137.80, 145.60, 156.00, 166.40, 176.80, 187.20, 197.60, 208.00, 221.00, 234.00],
    },
  ],
};
