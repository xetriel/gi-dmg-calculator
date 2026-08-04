import type { CharacterTalentSeed } from "./types";

export const aloySeed: CharacterTalentSeed = {
  characterId: "aloy",
  hits: [
    // Normal Attack — Rapid Fire
    { hitKey: "1-hit-a", talentType: "normal", values: [21.14, 22.86, 24.58, 26.86, 28.58, 30.53, 33.22, 35.91, 38.60, 41.53, 44.46, 47.39, 50.32, 53.25] },
    { hitKey: "1-hit-b", talentType: "normal", values: [23.76, 25.69, 27.63, 30.19, 32.12, 34.31, 37.33, 40.35, 43.37, 46.66, 49.95, 53.24, 56.53, 59.82] },
    { hitKey: "2-hit", talentType: "normal", values: [43.12, 46.63, 50.14, 54.79, 58.30, 62.27, 67.75, 73.23, 78.72, 84.69, 90.66, 96.63, 102.60, 108.57] },
    { hitKey: "3-hit", talentType: "normal", values: [52.82, 57.12, 61.42, 67.12, 71.42, 76.28, 83.00, 89.72, 96.44, 103.76, 111.08, 118.40, 125.72, 133.04] },
    { hitKey: "4-hit", talentType: "normal", values: [65.60, 70.94, 76.28, 83.35, 88.69, 94.73, 103.08, 111.42, 119.77, 128.87, 137.97, 147.07, 156.17, 165.27] },
    { hitKey: "aimed", talentType: "normal", values: [43.86, 47.43, 51.00, 55.73, 59.29, 63.32, 68.91, 74.49, 80.08, 86.15, 92.22, 98.29, 104.36, 110.43] },
    { hitKey: "fully-charged-aimed", talentType: "normal", values: [124.00, 133.30, 142.60, 155.00, 164.30, 173.60, 186.00, 198.40, 210.80, 223.20, 235.60, 248.00, 263.50, 279.00] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.12, 144.05] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.23, 208.77, 224.62, 240.48, 256.34, 272.19, 288.05] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.45, 242.61, 260.76, 280.57, 300.37, 320.18, 339.98, 359.79] },

    // Elemental Skill — Frozen Wilds
    { hitKey: "freeze-bomb", talentType: "skill", values: [177.60, 190.93, 204.24, 222.00, 235.32, 248.64, 266.40, 284.16, 301.92, 319.68, 337.44, 355.20, 377.40, 399.60] },
    { hitKey: "chillwater-bomblet", talentType: "skill", values: [40.00, 43.00, 46.00, 50.00, 53.00, 56.00, 60.00, 64.00, 68.00, 72.00, 76.00, 80.00, 85.00, 90.00] },
    { hitKey: "coil-1", talentType: "skill", kind: "buff", values: [5.30, 5.70, 6.10, 6.63, 7.02, 7.42, 7.95, 8.48, 9.01, 9.54, 10.07, 10.60, 11.26, 11.93] },
    { hitKey: "coil-2", talentType: "skill", kind: "buff", values: [10.60, 11.39, 12.19, 13.25, 14.04, 14.84, 15.90, 16.96, 18.02, 19.08, 20.14, 21.20, 22.53, 23.85] },
    { hitKey: "coil-3", talentType: "skill", kind: "buff", values: [15.90, 17.09, 18.28, 19.87, 21.07, 22.26, 23.85, 25.44, 27.03, 28.62, 30.21, 31.80, 33.79, 35.78] },
    { hitKey: "rushing-ice", talentType: "skill", kind: "buff", values: [26.47, 28.46, 30.44, 33.09, 35.07, 37.06, 39.71, 42.35, 45.00, 47.65, 50.29, 52.94, 56.25, 59.56] },

    // Elemental Burst — Prophecies of Dawn
    { hitKey: "burst-dmg", talentType: "burst", values: [359.20, 386.14, 413.08, 449.00, 475.94, 502.88, 538.80, 574.72, 610.64, 646.56, 682.48, 718.40, 763.30, 808.20] },
  ]
};
