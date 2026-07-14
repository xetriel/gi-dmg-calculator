import type { CharacterTalentSeed } from "./types";

export const varkaSeed: CharacterTalentSeed = {
  characterId: "varka",
  hits: [
    // Normal Attack (Favonius Bladework: Dancing Radiance)
    { hitKey: "1-hit", talentType: "normal", values: [65.46, 70.79, 76.12, 83.73, 89.06, 95.14, 103.52, 111.89, 120.26, 129.4, 138.53] },
    { hitKey: "2-hit-a", talentType: "normal", values: [23.99, 25.94, 27.89, 30.68, 32.64, 34.87, 37.94, 41.0, 44.07, 47.42, 50.77] },
    { hitKey: "2-hit-b", talentType: "normal", values: [44.55, 48.18, 51.8, 56.98, 60.61, 64.75, 70.45, 76.15, 81.85, 88.06, 94.28] },
    { hitKey: "3-hit-a", talentType: "normal", values: [32.44, 35.08, 37.72, 41.49, 44.13, 47.15, 51.29, 55.44, 59.59, 64.12, 68.64] },
    { hitKey: "3-hit-b", talentType: "normal", values: [60.24, 65.14, 70.05, 77.05, 81.95, 87.56, 95.26, 102.97, 110.67, 119.08, 127.48] },
    { hitKey: "4-hit-a", talentType: "normal", values: [55.43, 59.94, 64.46, 70.9, 75.41, 80.57, 87.66, 94.75, 101.84, 109.57, 117.31] },
    { hitKey: "4-hit-b", talentType: "normal", values: [29.85, 32.28, 34.71, 38.18, 40.61, 43.38, 47.2, 51.02, 54.84, 59.0, 63.17] },
    { hitKey: "5-hit-a", talentType: "normal", values: [69.75, 75.43, 81.1, 89.21, 94.89, 101.38, 110.3, 119.22, 128.15, 137.88, 147.61] },
    { hitKey: "5-hit-b", talentType: "normal", values: [37.56, 40.61, 43.67, 48.04, 51.1, 54.59, 59.39, 64.2, 69.0, 74.24, 79.48] },
    { hitKey: "charged-a", talentType: "normal", values: [85.64, 92.61, 99.58, 109.54, 116.51, 124.48, 135.43, 146.38, 157.34, 169.29, 181.24] },
    { hitKey: "charged-b", talentType: "normal", values: [46.11, 49.87, 53.62, 58.98, 62.74, 67.03, 72.92, 78.82, 84.72, 91.15, 97.59] },
    { hitKey: "plunge", talentType: "normal", values: [74.59, 80.66, 86.73, 95.4, 101.47, 108.41, 117.95, 127.49, 137.03, 147.44, 157.85] },
    { hitKey: "low-plunge", talentType: "normal", values: [149.14, 161.28, 173.42, 190.77, 202.91, 216.78, 235.86, 254.93, 274.01, 294.82, 315.63] },
    { hitKey: "high-plunge", talentType: "normal", values: [186.29, 201.45, 216.62, 238.28, 253.44, 270.77, 294.6, 318.42, 342.25, 368.25, 394.24] },

    // Elemental Skill (Windbound Execution)
    // Note: Varka enters Sturm und Drang which replaces Normal/Charged hits.
    // They scale with the Elemental Skill talent level, hence their presence under type "skill".
    { hitKey: "skill-dmg", talentType: "skill", values: [278.4, 299.28, 320.16, 348.0, 368.88, 389.76, 417.6, 445.44, 473.28, 501.12, 528.96, 556.8, 591.6] },
    { hitKey: "sd-1-hit", talentType: "skill", values: [81.82, 88.48, 95.14, 104.66, 111.32, 118.93, 129.4, 139.86, 150.33, 161.75, 173.16, 184.58, 196.0] },
    { hitKey: "sd-2-hit-a", talentType: "skill", values: [29.99, 32.43, 34.87, 38.35, 40.79, 43.58, 47.42, 51.25, 55.09, 59.27, 63.46, 67.64, 71.83] },
    { hitKey: "sd-2-hit-b", talentType: "skill", values: [55.69, 60.22, 64.75, 71.23, 75.76, 80.94, 88.06, 95.19, 102.31, 110.08, 117.85, 125.62, 133.39] },
    { hitKey: "sd-3-hit-a", talentType: "skill", values: [40.55, 43.85, 47.15, 51.86, 55.16, 58.93, 64.12, 69.3, 74.49, 80.15, 85.81, 91.46, 97.12] },
    { hitKey: "sd-3-hit-b", talentType: "skill", values: [75.3, 81.43, 87.56, 96.31, 102.44, 109.45, 119.08, 128.71, 138.34, 148.85, 159.35, 169.86, 180.37] },
    { hitKey: "sd-4-hit-a", talentType: "skill", values: [69.29, 74.93, 80.57, 88.63, 94.27, 100.71, 109.57, 118.44, 127.3, 136.97, 146.64, 156.3, 165.97] },
    { hitKey: "sd-4-hit-b", talentType: "skill", values: [37.31, 40.35, 43.38, 47.72, 50.76, 54.23, 59.0, 63.77, 68.55, 73.75, 78.96, 84.16, 89.37] },
    { hitKey: "sd-5-hit-a", talentType: "skill", values: [87.19, 94.28, 101.38, 111.52, 118.62, 126.73, 137.88, 149.03, 160.18, 172.35, 184.51, 196.68, 208.84] },
    { hitKey: "sd-5-hit-b", talentType: "skill", values: [46.95, 50.77, 54.59, 60.05, 63.87, 68.24, 74.24, 80.25, 86.25, 92.8, 99.35, 105.9, 112.45] },
    { hitKey: "sd-charged-a", talentType: "skill", values: [107.05, 115.76, 124.48, 136.92, 145.64, 155.59, 169.29, 182.98, 196.67, 211.61, 226.54, 241.48, 256.42] },
    { hitKey: "sd-charged-b", talentType: "skill", values: [57.64, 62.33, 67.03, 73.73, 78.42, 83.78, 91.15, 98.53, 105.9, 113.94, 121.99, 130.03, 138.07] },
    { hitKey: "azure-devour-a", talentType: "skill", values: [93.6, 100.62, 107.64, 117.0, 124.02, 131.04, 140.4, 149.76, 159.12, 168.48, 177.84, 187.2, 198.9] },
    { hitKey: "azure-devour-b", talentType: "skill", values: [50.4, 54.18, 57.96, 63.0, 66.78, 70.56, 75.6, 80.64, 85.68, 90.72, 95.76, 100.8, 107.1] },
    { hitKey: "four-winds-ascension-a", talentType: "skill", values: [175.76, 188.94, 202.12, 219.7, 232.88, 246.06, 263.64, 281.22, 298.79, 316.37, 333.94, 351.52, 373.49] },
    { hitKey: "four-winds-ascension-b", talentType: "skill", values: [94.64, 101.74, 108.84, 118.3, 125.4, 132.5, 141.96, 151.42, 160.89, 170.35, 179.82, 189.28, 201.11] },
    // C2 Additional Strike (800% ATK AoE Anemo DMG) - flat across all levels
    { hitKey: "c2-strike", talentType: "skill", values: [800.0, 800.0, 800.0, 800.0, 800.0, 800.0, 800.0, 800.0, 800.0, 800.0, 800.0, 800.0, 800.0] },

    // Elemental Burst (Northwind Avatar)
    { hitKey: "burst-1-hit", talentType: "burst", values: [336.96, 362.23, 387.5, 421.2, 446.47, 471.74, 505.44, 539.14, 572.83, 606.53, 640.22, 673.92, 716.04] },
    { hitKey: "burst-2-hit", talentType: "burst", values: [181.44, 195.05, 208.66, 226.8, 240.41, 254.02, 272.16, 290.3, 308.45, 326.59, 344.74, 362.88, 385.56] },
  ]
};
