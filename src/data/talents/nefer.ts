import type { CharacterTalentSeed } from "./types";

export const neferSeed: CharacterTalentSeed = {
  characterId: "nefer",
  hits: [
    // Normal Attack (ATK-scaled)
    { hitKey: "1-hit", talentType: "normal", values: [38.07, 40.93, 43.78, 47.59, 50.44, 53.3, 57.11, 60.91, 64.72, 68.53, 72.34] },
    { hitKey: "2-hit", talentType: "normal", values: [37.56, 40.38, 43.2, 46.96, 49.77, 52.59, 56.35, 60.1, 63.86, 67.62, 71.37] },
    { hitKey: "3-hit", talentType: "normal", values: [25.24, 27.13, 29.03, 31.55, 33.44, 35.34, 37.86, 40.38, 42.91, 45.43, 47.96] },
    { hitKey: "4-hit", talentType: "normal", values: [60.99, 65.57, 70.14, 76.24, 80.82, 85.39, 91.49, 97.59, 103.69, 109.79, 115.89] },
    { hitKey: "charged", talentType: "normal", values: [130.88, 140.7, 150.51, 163.6, 173.42, 183.23, 196.32, 209.41, 222.5, 235.58, 248.67] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.6, 89.87, 97.14, 104.41, 112.34, 120.27] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.7, 194.23, 208.77, 224.62, 240.48] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.1, 206.3, 224.45, 242.61, 260.76, 280.57, 300.37] },

    // Elemental Skill (stored EM-scaled parts)
    { hitKey: "skill-dmg", talentType: "skill", values: [152.77, 164.23, 175.68, 190.96, 202.42, 213.88, 229.15, 244.43, 259.71, 274.98, 290.26, 305.54, 324.63] },
    { hitKey: "phantasm-1-nefer", talentType: "skill", values: [49.28, 52.98, 56.67, 61.6, 65.3, 68.99, 73.92, 78.85, 83.78, 88.7, 93.63, 98.56, 104.72] },
    { hitKey: "phantasm-2-nefer", talentType: "skill", values: [64.06, 68.87, 73.67, 80.08, 84.88, 89.69, 96.1, 102.5, 108.91, 115.32, 121.72, 128.13, 136.14] },
    { hitKey: "phantasm-1-shades", talentType: "skill", values: [96, 103.2, 110.4, 120, 127.2, 134.4, 144, 153.6, 163.2, 172.8, 182.4, 192, 204] },
    { hitKey: "phantasm-2-shades", talentType: "skill", values: [96, 103.2, 110.4, 120, 127.2, 134.4, 144, 153.6, 163.2, 172.8, 182.4, 192, 204] },
    { hitKey: "phantasm-3-shades", talentType: "skill", values: [128, 137.6, 147.2, 160, 169.6, 179.2, 192, 204.8, 217.6, 230.4, 243.2, 256, 272] },
    { hitKey: "c6-converted", talentType: "skill", values: [85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85] },
    { hitKey: "c6-extra", talentType: "skill", values: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120] },

    // Elemental Burst (stored EM-scaled parts)
    { hitKey: "burst-1-hit", talentType: "burst", values: [449.28, 482.98, 516.67, 561.6, 595.3, 628.99, 673.92, 718.85, 763.78, 808.7, 853.63, 898.56, 954.72] },
    { hitKey: "burst-2-hit", talentType: "burst", values: [673.92, 724.46, 775.01, 842.4, 892.94, 943.49, 1010.88, 1078.27, 1145.66, 1213.06, 1280.45, 1347.84, 1432.08] },
    { hitKey: "burst-dmg-bonus", talentType: "burst", kind: "buff", values: [13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49] },
  ],
};
