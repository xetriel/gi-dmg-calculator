import type { CharacterTalentSeed } from "./types";

export const mualaniSeed: CharacterTalentSeed = {
  characterId: "mualani",
  hits: [
    // Normal Attack — Cooling Treatment
    { hitKey: "1-hit", talentType: "normal", values: [40.64, 43.95, 47.26, 51.97, 55.28, 59.08, 64.28, 69.48, 74.68, 80.35, 86.02, 91.69, 97.36, 103.03] },
    { hitKey: "2-hit", talentType: "normal", values: [38.08, 41.18, 44.28, 48.70, 51.80, 55.36, 60.23, 65.10, 69.97, 75.28, 80.59, 85.90, 91.21, 96.52] },
    { hitKey: "3-hit", talentType: "normal", values: [53.36, 57.70, 62.04, 68.23, 72.57, 77.56, 84.38, 91.19, 98.01, 105.44, 112.87, 120.30, 127.73, 135.16] },
    { hitKey: "charged", talentType: "normal", values: [154.24, 165.81, 177.38, 192.80, 204.37, 218.25, 236.75, 255.26, 273.77, 294.60, 315.43, 336.25, 357.08, 377.91] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.13, 144.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.22, 208.74, 224.62, 240.50, 256.38, 272.26, 288.14] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.47, 242.63, 260.79, 280.57, 300.35, 320.13, 339.91, 359.69] },

    // Elemental Skill — Surfshark Wavebreaker
    { hitKey: "shark-bite", talentType: "skill", values: [8.44, 9.07, 9.70, 10.55, 11.18, 11.81, 12.66, 13.50, 14.35, 15.19, 16.04, 16.88, 17.93, 18.98] },
    { hitKey: "shark-bite-1", talentType: "skill", values: [8.44, 9.07, 9.70, 10.55, 11.18, 11.81, 12.66, 13.50, 14.35, 15.19, 16.04, 16.88, 17.93, 18.98] },
    { hitKey: "shark-bite-2", talentType: "skill", values: [16.88, 18.14, 19.40, 21.10, 22.36, 23.62, 25.32, 27.00, 28.70, 30.38, 32.08, 33.76, 35.86, 37.96] },
    { hitKey: "wave-momentum-extra", talentType: "skill", kind: "buff", values: [3.13, 3.37, 3.60, 3.92, 4.15, 4.38, 4.70, 5.01, 5.33, 5.64, 5.95, 6.27, 6.66, 7.05] },
    { hitKey: "surging-bite", talentType: "skill", values: [47.02, 50.54, 54.05, 58.78, 62.29, 65.81, 70.53, 75.22, 79.94, 84.63, 89.35, 94.04, 99.90, 105.76] },

    // Elemental Burst — Boomsharka-laka
    { hitKey: "burst-dmg", talentType: "burst", values: [58.44, 62.82, 67.21, 73.05, 77.43, 81.81, 87.66, 93.50, 99.35, 105.19, 111.04, 116.88, 124.21, 131.54] },
  ]
};
