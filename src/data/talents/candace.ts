import type { CharacterTalentSeed } from "./types";

export const candaceSeed: CharacterTalentSeed = {
  characterId: "candace",
  hits: [
    // Normal Attack — Gleaming Spear - Guardian Stance
    {
      hitKey: "1-hit",
      talentType: "normal",
      values: [60.80, 65.75, 70.70, 77.77, 82.72, 88.38, 96.15, 103.93, 111.71, 120.19, 128.67, 137.15, 145.63, 154.11],
    },
    {
      hitKey: "2-hit",
      talentType: "normal",
      values: [61.15, 66.12, 71.10, 78.21, 83.19, 88.88, 96.70, 104.52, 112.34, 120.87, 129.40, 137.93, 146.46, 154.99],
    },
    {
      hitKey: "3-hit-1",
      talentType: "normal",
      values: [35.49, 38.38, 41.27, 45.39, 48.28, 51.58, 56.12, 60.66, 65.20, 70.15, 75.10, 80.05, 85.00, 89.95],
    },
    {
      hitKey: "3-hit-2",
      talentType: "normal",
      values: [43.37, 46.90, 50.43, 55.48, 59.01, 63.04, 68.59, 74.14, 79.69, 85.74, 91.79, 97.84, 103.89, 109.94],
    },
    {
      hitKey: "4-hit",
      talentType: "normal",
      values: [94.94, 102.67, 110.40, 121.44, 129.17, 138.00, 150.14, 162.29, 174.43, 187.68, 200.93, 214.18, 227.43, 240.68],
    },
    {
      hitKey: "charged",
      talentType: "normal",
      values: [124.18, 134.29, 144.40, 158.84, 168.95, 180.50, 196.38, 212.27, 228.15, 245.48, 262.81, 280.14, 297.47, 314.80],
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

    // Elemental Skill — Sacred Rite: Heron's Sanctum
    {
      hitKey: "basic-dmg",
      talentType: "skill",
      values: [12.00, 12.90, 13.80, 15.00, 15.90, 16.80, 18.00, 19.20, 20.40, 21.60, 22.80, 24.00, 25.50, 27.00],
    },
    {
      hitKey: "charged-up-dmg",
      talentType: "skill",
      values: [19.04, 20.47, 21.90, 23.80, 25.23, 26.66, 28.56, 30.46, 32.37, 34.27, 36.18, 38.08, 40.46, 42.84],
    },
    {
      hitKey: "shield",
      talentType: "skill",
      kind: "shield",
      values: [12.00, 12.90, 13.80, 15.00, 15.90, 16.80, 18.00, 19.20, 20.40, 21.60, 22.80, 24.00, 25.50, 27.00],
    },

    // Elemental Burst — Sacred Rite: Wagtail's Tide
    {
      hitKey: "skill-dmg",
      talentType: "burst",
      values: [6.61, 7.11, 7.60, 8.26, 8.76, 9.25, 9.92, 10.58, 11.24, 11.90, 12.56, 13.22, 14.05, 14.87],
    },
    {
      hitKey: "wave-impact-dmg",
      talentType: "burst",
      values: [6.61, 7.11, 7.60, 8.26, 8.76, 9.25, 9.92, 10.58, 11.24, 11.90, 12.56, 13.22, 14.05, 14.87],
    },
    {
      hitKey: "c6-the-overflow",
      talentType: "burst",
      values: [15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00],
    },
  ],
};
