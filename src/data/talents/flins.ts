import type { CharacterTalentSeed } from "./types";

export const flinsSeed: CharacterTalentSeed = {
  characterId: "flins",
  hits: [
    // Normal Attack (Pocztowy Demonspear)
    { hitKey: "1-hit", talentType: "normal", values: [44.73, 48.37, 52.01, 57.21, 60.85, 65.01, 70.73, 76.45, 82.17, 88.41, 94.65] },
    { hitKey: "2-hit", talentType: "normal", values: [45.15, 48.82, 52.5, 57.75, 61.42, 65.62, 71.4, 77.17, 82.95, 89.25, 95.55] },
    { hitKey: "3-hit", talentType: "normal", values: [55.92, 60.47, 65.02, 71.53, 76.08, 81.28, 88.43, 95.58, 102.74, 110.54, 118.34] },
    { hitKey: "4-hit", talentType: "normal", values: [32.04, 34.65, 37.25, 40.98, 43.59, 46.57, 50.67, 54.76, 58.86, 63.33, 67.8] },
    { hitKey: "5-hit", talentType: "normal", values: [76.79, 83.05, 89.3, 98.23, 104.48, 111.62, 121.44, 131.27, 141.09, 151.8, 162.52] },
    { hitKey: "charged", talentType: "normal", values: [103.03, 111.41, 119.8, 131.78, 140.17, 149.75, 162.93, 176.11, 189.28, 203.66, 218.04] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.92, 101.1, 109.28, 117.46, 126.38, 135.3] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.7, 270.54] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92] },

    // Elemental Skill (Manifest Flame form + Northland Spearstorm + C2 extra)
    { hitKey: "mf-1-hit", talentType: "skill", values: [58.25, 62.62, 66.99, 72.81, 77.18, 81.55, 87.37, 93.2, 99.02, 104.85, 110.67, 116.5, 123.78] },
    { hitKey: "mf-2-hit", talentType: "skill", values: [58.8, 63.21, 67.62, 73.5, 77.91, 82.32, 88.2, 94.08, 99.96, 105.84, 111.72, 117.6, 124.94] },
    { hitKey: "mf-3-hit", talentType: "skill", values: [72.83, 78.29, 83.75, 91.03, 96.49, 101.96, 109.24, 116.52, 123.8, 131.09, 138.37, 145.65, 154.75] },
    { hitKey: "mf-4-hit", talentType: "skill", values: [41.73, 44.85, 47.98, 52.16, 55.29, 58.42, 62.59, 66.76, 70.93, 75.11, 79.28, 83.45, 88.67] },
    { hitKey: "mf-5-hit", talentType: "skill", values: [100.01, 107.51, 115.01, 125.01, 132.51, 140.02, 150.02, 160.02, 170.02, 180.02, 190.02, 200.02, 212.52] },
    { hitKey: "mf-charged", talentType: "skill", values: [114.96, 123.58, 132.2, 143.7, 152.32, 160.94, 172.44, 183.94, 195.43, 206.93, 218.42, 229.92, 244.29] },
    { hitKey: "spearstorm", talentType: "skill", values: [178.4, 191.78, 205.16, 223, 236.38, 249.76, 267.6, 285.44, 303.28, 321.12, 338.96, 356.8, 379.1] },
    { hitKey: "c2-extra", talentType: "skill", values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50] },

    // Elemental Burst (Ancient Ritual: Cometh the Night + Thunderous Symphony)
    { hitKey: "burst-initial", talentType: "burst", values: [259.84, 279.33, 298.82, 324.8, 344.29, 363.78, 389.76, 415.74, 441.73, 467.71, 493.7, 519.68, 552.16] },
    { hitKey: "burst-middle", talentType: "burst", values: [16.24, 17.46, 18.68, 20.3, 21.52, 22.74, 24.36, 25.98, 27.61, 29.23, 30.86, 32.48, 34.51] },
    { hitKey: "burst-final", talentType: "burst", values: [116.93, 125.7, 134.47, 146.16, 154.93, 163.7, 175.39, 187.08, 198.78, 210.47, 222.16, 233.86, 248.47] },
    { hitKey: "symphony-dmg", talentType: "burst", values: [71.46, 76.82, 82.17, 89.32, 94.68, 100.04, 107.18, 114.33, 121.48, 128.62, 135.77, 142.91, 151.84] },
    { hitKey: "symphony-add", talentType: "burst", values: [103.94, 111.73, 119.53, 129.92, 137.72, 145.51, 155.9, 166.3, 176.69, 187.08, 197.48, 207.87, 220.86] },
  ],
};
