import type { CharacterTalentSeed } from "./types";

export const travelerCryoSeed: CharacterTalentSeed = {
  characterId: "traveler-cryo",
  hits: [
    // Normal Attack — Foreign Frostglint
    { hitKey: "1-hit", talentType: "normal", values: [44.51, 48.13, 51.75, 56.92, 60.54, 64.68, 70.11, 75.55, 80.98, 86.93, 92.88, 98.83, 106.34, 113.85] },
    { hitKey: "2-hit", talentType: "normal", values: [43.43, 46.96, 50.5, 55.55, 59.08, 63.12, 68.42, 73.73, 79.03, 84.84, 90.64, 96.45, 103.77, 111.1] },
    { hitKey: "3-hit", talentType: "normal", values: [52.97, 57.28, 61.6, 67.76, 72.07, 77.0, 83.46, 89.93, 96.4, 103.48, 110.57, 117.65, 126.59, 135.52] },
    { hitKey: "4-hit", talentType: "normal", values: [58.31, 63.05, 67.8, 74.58, 79.32, 84.75, 91.87, 98.98, 106.1, 113.9, 121.7, 129.5, 139.33, 149.16] },
    { hitKey: "5-hit", talentType: "normal", values: [70.78, 76.53, 82.3, 90.53, 96.29, 102.87, 111.51, 120.15, 128.8, 138.26, 147.72, 157.19, 169.12, 181.06] },
    { hitKey: "charged-1", talentType: "normal", values: [55.9, 60.45, 65.0, 71.5, 76.05, 81.25, 88.08, 94.9, 101.72, 109.2, 116.67, 124.15, 133.58, 143.0] },
    { hitKey: "charged-2-aether", talentType: "normal", values: [60.7, 65.64, 70.58, 77.64, 82.58, 88.23, 95.64, 103.05, 110.46, 118.58, 126.7, 134.82, 145.05, 155.28] },
    { hitKey: "charged-2-lumine", talentType: "normal", values: [72.24, 78.11, 84.0, 92.4, 98.28, 105.0, 113.82, 122.64, 131.46, 141.12, 150.78, 160.44, 172.62, 184.8] },
    { hitKey: "freezing-ice", talentType: "normal", values: [200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0] },
    { hitKey: "freezing-ice-stellar", talentType: "normal", values: [200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.93, 101.1, 109.28, 117.46, 126.38, 135.3, 144.22, 153.14, 162.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.7, 270.54, 288.38, 306.22, 324.06] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92, 360.2, 382.48, 404.76] },

    // Elemental Skill — Ice Fog Piercer
    { hitKey: "skill-dmg", talentType: "skill", values: [91.68, 98.56, 105.43, 114.6, 121.48, 128.35, 137.52, 146.69, 155.86, 165.02, 174.19, 183.36, 194.82, 206.28] },
    { hitKey: "ice-crystal-dmg", talentType: "skill", values: [21.39, 23.0, 24.6, 26.74, 28.34, 29.95, 32.09, 34.23, 36.37, 38.51, 40.64, 42.78, 45.46, 48.13] },

    // Elemental Burst — Frostbound Javelin
    { hitKey: "burst-javelin-dmg", talentType: "burst", values: [55.13, 59.27, 63.4, 68.91, 73.05, 77.18, 82.7, 88.21, 93.72, 99.24, 104.75, 110.26, 117.15, 124.05] },
    { hitKey: "burst-javelin-3-hit", talentType: "burst", values: [165.39, 177.81, 190.2, 206.73, 219.15, 231.54, 248.1, 264.63, 281.16, 297.72, 314.25, 330.78, 351.45, 372.15] },
    { hitKey: "burst-javelin-5-hit", talentType: "burst", values: [275.65, 296.35, 317.0, 344.55, 365.25, 385.9, 413.5, 441.05, 468.6, 496.2, 523.75, 551.3, 585.75, 620.25] },
    { hitKey: "stellar-conduct-javelin-dmg", talentType: "burst", values: [36.75, 39.51, 42.27, 45.94, 48.7, 51.46, 55.13, 58.81, 62.48, 66.16, 69.83, 73.51, 78.1, 82.7] },
    { hitKey: "stellar-conduct-javelin-3-hit", talentType: "burst", values: [110.25, 118.53, 126.81, 137.82, 146.1, 154.38, 165.39, 176.43, 187.44, 198.48, 209.49, 220.53, 234.3, 248.1] },
    { hitKey: "stellar-conduct-javelin-5-hit", talentType: "burst", values: [183.75, 197.55, 211.35, 229.7, 243.5, 257.3, 275.65, 294.05, 312.4, 330.8, 349.15, 367.55, 390.5, 413.5] },
    { hitKey: "stellar-swirl-javelin-dmg", talentType: "burst", values: [55.13, 59.27, 63.4, 68.91, 73.05, 77.18, 82.7, 88.21, 93.72, 99.24, 104.75, 110.26, 117.15, 124.05] },
    { hitKey: "stellar-swirl-javelin-3-hit", talentType: "burst", values: [165.39, 177.81, 190.2, 206.73, 219.15, 231.54, 248.1, 264.63, 281.16, 297.72, 314.25, 330.78, 351.45, 372.15] },
    { hitKey: "stellar-swirl-javelin-5-hit", talentType: "burst", values: [275.65, 296.35, 317.0, 344.55, 365.25, 385.9, 413.5, 441.05, 468.6, 496.2, 523.75, 551.3, 585.75, 620.25] },

    // Frostglow per-stack DMG Bonus (not a hit row — used by engine resolver for level-dependent scaling)
    { hitKey: "frostglow-bonus", talentType: "burst", values: [2.76, 2.96, 3.17, 3.45, 3.65, 3.86, 4.13, 4.41, 4.69, 4.96, 5.24, 5.51, 5.86, 6.20] },
    { hitKey: "stellar-conduct-frostglow-bonus", talentType: "burst", values: [1.84, 1.98, 2.11, 2.30, 2.44, 2.57, 2.76, 2.94, 3.12, 3.31, 3.49, 3.68, 3.91, 4.14] },
  ]
};
