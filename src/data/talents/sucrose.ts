import type { CharacterTalentSeed } from "./types";

export const sucroseSeed: CharacterTalentSeed = {
  characterId: "sucrose",
  hits: [
    // Normal Attack — Wind Spirit Creation
    {
      hitKey: "1-hit",
      talentType: "normal",
      values: [33.46, 35.97, 38.48, 41.83, 44.34, 46.85, 50.19, 53.54, 56.89, 60.23, 63.58, 66.92, 71.11, 75.29],
    },
    {
      hitKey: "2-hit",
      talentType: "normal",
      values: [30.62, 32.92, 35.21, 38.28, 40.57, 42.87, 45.93, 48.99, 52.05, 55.12, 58.18, 61.24, 65.07, 68.90],
    },
    {
      hitKey: "3-hit",
      talentType: "normal",
      values: [38.44, 41.32, 44.21, 48.05, 50.93, 53.82, 57.66, 61.50, 65.35, 69.19, 73.04, 76.88, 81.69, 86.49],
    },
    {
      hitKey: "4-hit",
      talentType: "normal",
      values: [47.92, 51.51, 55.11, 59.90, 63.50, 67.09, 71.88, 76.67, 81.46, 86.26, 91.05, 95.84, 101.83, 107.82],
    },
    {
      hitKey: "charged",
      talentType: "normal",
      values: [120.16, 129.17, 138.18, 150.20, 159.21, 168.22, 180.24, 192.26, 204.27, 216.29, 228.30, 240.32, 255.34, 270.36],
    },
    {
      hitKey: "plunge",
      talentType: "normal",
      values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.13, 144.06],
    },
    {
      hitKey: "low-plunge",
      talentType: "normal",
      values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.22, 208.74, 224.62, 240.50, 256.38, 272.26, 288.14],
    },
    {
      hitKey: "high-plunge",
      talentType: "normal",
      values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.47, 242.63, 260.79, 280.57, 300.35, 320.13, 339.91, 359.69],
    },

    // Elemental Skill — Astable Anemohypostasis Creation - 6308
    {
      hitKey: "skill-dmg",
      talentType: "skill",
      values: [211.20, 227.04, 242.88, 264.00, 279.84, 295.68, 316.80, 337.92, 359.04, 380.16, 401.28, 422.40, 448.80, 475.20],
    },

    // Elemental Burst — Forbidden Creation - Isomer 75 / Type II
    {
      hitKey: "burst-dot",
      talentType: "burst",
      values: [148.00, 159.10, 170.20, 185.00, 196.10, 207.20, 222.00, 236.80, 251.60, 266.40, 281.20, 296.00, 314.50, 333.00],
    },
    {
      hitKey: "burst-infusion",
      talentType: "burst",
      values: [44.00, 47.30, 50.60, 55.00, 58.30, 61.60, 66.00, 70.40, 74.80, 79.20, 83.60, 88.00, 93.50, 99.00],
    },
  ],
};
