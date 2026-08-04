import type { CharacterTalentSeed } from "./types";

export const ayatoSeed: CharacterTalentSeed = {
  characterId: "ayato",
  hits: [
    // Normal Attack — Kamisato Art: Marobashi
    { hitKey: "1-hit", talentType: "normal", values: [44.96, 48.62, 52.28, 57.50, 61.16, 65.34, 71.10, 76.85, 82.60, 88.89, 95.17, 101.46, 107.75, 114.04] },
    { hitKey: "2-hit", talentType: "normal", values: [47.16, 51.00, 54.84, 60.32, 64.16, 68.54, 74.58, 80.61, 86.64, 93.24, 99.84, 106.44, 113.04, 119.64] },
    { hitKey: "3-hit", talentType: "normal", values: [58.61, 63.38, 68.15, 74.96, 79.73, 85.17, 92.67, 100.16, 107.65, 115.85, 124.05, 132.25, 140.45, 148.65] },
    { hitKey: "4-hit", talentType: "normal", values: [29.57, 31.98, 34.38, 37.82, 40.22, 42.97, 46.75, 50.53, 54.31, 58.45, 62.59, 66.73, 70.87, 75.01] },
    { hitKey: "5-hit", talentType: "normal", values: [75.60, 81.75, 87.91, 96.69, 102.84, 109.87, 119.53, 129.20, 138.86, 149.44, 160.02, 170.60, 181.18, 191.76] },
    { hitKey: "charged", talentType: "normal", values: [129.00, 139.50, 150.00, 165.00, 175.50, 187.50, 204.00, 220.50, 237.00, 255.00, 273.00, 291.00, 309.00, 327.00] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.92, 101.10, 109.28, 117.46, 126.38, 135.30, 144.22, 153.14, 162.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.70, 270.54, 288.38, 306.22, 324.05] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92, 360.20, 382.48, 404.76] },

    // Elemental Skill — Kamisato Art: Kyouka
    { hitKey: "shunsuiken-1", talentType: "skill", values: [26.74, 28.74, 30.75, 33.42, 35.43, 37.77, 40.78, 43.78, 46.79, 52.89, 56.90, 60.91, 64.92, 68.93] },
    { hitKey: "shunsuiken-2", talentType: "skill", values: [29.78, 32.01, 34.25, 37.22, 39.46, 42.06, 45.41, 48.76, 52.11, 58.87, 63.33, 67.80, 72.27, 76.73] },
    { hitKey: "shunsuiken-3", talentType: "skill", values: [32.82, 35.28, 37.74, 41.02, 43.48, 46.35, 50.05, 53.74, 57.43, 64.86, 69.77, 74.69, 79.61, 84.53] },
    { hitKey: "water-illusion", talentType: "skill", values: [51.48, 55.34, 59.20, 64.35, 68.21, 72.71, 79.15, 85.58, 92.02, 101.50, 109.23, 116.96, 124.69, 132.42] },
    { hitKey: "c6-extra-strike", talentType: "skill", values: [450.0, 450.0, 450.0, 450.0, 450.0, 450.0, 450.0, 450.0, 450.0, 450.0, 450.0, 450.0, 450.0, 450.0] },
    // Namisen extra DMG coefficient (% Max HP per stack)
    { hitKey: "namisen-increase", talentType: "skill", kind: "buff", values: [0.28, 0.30, 0.33, 0.36, 0.38, 0.40, 0.44, 0.47, 0.51, 0.56, 0.60, 0.64, 0.68, 0.73] },

    // Elemental Burst — Kamisato Art: Suiyuu
    { hitKey: "bloomwater-blade", talentType: "burst", values: [33.72, 36.25, 38.78, 42.15, 44.68, 47.61, 51.83, 56.05, 60.27, 66.49, 71.55, 76.61, 81.67, 86.73] },
    { hitKey: "burst-na-increase", talentType: "burst", kind: "buff", values: [7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.0, 12.0, 12.0, 13.0, 13.0] },
  ]
};
