import type { CharacterTalentSeed } from "./types";

export const baizhuSeed: CharacterTalentSeed = {
  characterId: "baizhu",
  hits: [
    // Normal Attack — The Classics of Acupuncture
    {
      hitKey: "1-hit",
      talentType: "normal",
      values: [37.37, 40.17, 42.98, 46.71, 49.52, 52.32, 56.06, 59.79, 63.53, 67.27, 71.00, 74.74, 79.41, 84.08],
    },
    {
      hitKey: "2-hit",
      talentType: "normal",
      values: [36.42, 39.16, 41.89, 45.53, 48.26, 50.99, 54.64, 58.28, 61.92, 65.56, 69.21, 72.85, 77.40, 81.95],
    },
    {
      hitKey: "3-hit-a",
      talentType: "normal",
      values: [22.54, 24.23, 25.92, 28.18, 29.87, 31.56, 33.81, 36.07, 38.32, 40.57, 42.83, 45.08, 47.90, 50.72],
    },
    {
      hitKey: "3-hit-b",
      talentType: "normal",
      values: [22.54, 24.23, 25.92, 28.18, 29.87, 31.56, 33.81, 36.07, 38.32, 40.57, 42.83, 45.08, 47.90, 50.72],
    },
    {
      hitKey: "4-hit",
      talentType: "normal",
      values: [54.14, 58.20, 62.26, 67.67, 71.73, 75.79, 81.21, 86.62, 92.03, 97.45, 102.86, 108.27, 115.04, 121.82],
    },
    {
      hitKey: "charged",
      talentType: "normal",
      values: [121.04, 130.12, 139.20, 151.30, 160.38, 169.46, 181.56, 193.66, 205.77, 217.87, 229.98, 242.08, 257.21, 272.34],
    },
    {
      hitKey: "plunge",
      talentType: "normal",
      values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.13, 144.06],
    },
    {
      hitKey: "low-plunge",
      talentType: "normal",
      values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.23, 208.77, 224.62, 240.48, 256.33, 272.24, 288.14],
    },
    {
      hitKey: "high-plunge",
      talentType: "normal",
      values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.45, 242.61, 260.76, 280.57, 300.37, 320.18, 340.05, 359.69],
    },

    // Elemental Skill — Universal Diagnosis
    {
      hitKey: "skill-dmg",
      talentType: "skill",
      values: [79.20, 85.14, 91.08, 99.00, 104.94, 110.88, 118.80, 126.72, 134.64, 142.56, 150.48, 158.40, 168.30, 178.20],
    },
    {
      hitKey: "skill-heal",
      talentType: "skill",
      kind: "heal",
      values: [8.00, 8.60, 9.20, 10.00, 10.60, 11.20, 12.00, 12.80, 13.60, 14.40, 15.20, 16.00, 17.00, 18.00],
    },
    {
      hitKey: "c2-splice-dmg",
      talentType: "skill",
      values: [250.00, 250.00, 250.00, 250.00, 250.00, 250.00, 250.00, 250.00, 250.00, 250.00, 250.00, 250.00, 250.00, 250.00],
    },

    // Elemental Burst — Holistic Revivification
    {
      hitKey: "burst-spiritvein",
      talentType: "burst",
      values: [97.06, 104.34, 111.62, 121.33, 128.61, 135.89, 145.60, 155.30, 165.01, 174.72, 184.42, 194.13, 206.26, 218.39],
    },
    {
      hitKey: "burst-heal",
      talentType: "burst",
      kind: "heal",
      values: [5.20, 5.59, 5.98, 6.50, 6.89, 7.28, 7.80, 8.32, 8.84, 9.36, 9.88, 10.40, 11.05, 11.70],
    },
    {
      hitKey: "burst-shield",
      talentType: "burst",
      kind: "shield",
      values: [0.80, 0.86, 0.92, 1.00, 1.06, 1.12, 1.20, 1.28, 1.36, 1.44, 1.52, 1.60, 1.70, 1.80],
    },
  ],
};
