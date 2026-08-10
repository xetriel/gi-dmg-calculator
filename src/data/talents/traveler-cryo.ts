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
    { hitKey: "charged-2", talentType: "normal", values: [60.7, 65.64, 70.58, 77.64, 82.58, 88.23, 95.64, 103.05, 110.46, 118.58, 126.7, 134.82, 145.05, 155.28] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.93, 101.1, 109.28, 117.46, 126.38, 135.3, 144.22, 153.14, 162.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.7, 270.54, 288.38, 306.22, 324.06] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92, 360.2, 382.48, 404.76] },

    // Elemental Skill — Ice Fog Piercer
    { hitKey: "skill-dmg", talentType: "skill", values: [92.0, 98.9, 105.8, 115.0, 121.9, 128.8, 138.0, 147.2, 156.4, 165.02, 174.8, 184.0, 195.5, 207.0] },
    { hitKey: "ice-crystal-dmg", talentType: "skill", values: [21.5, 23.1, 24.7, 26.9, 28.5, 30.1, 32.2, 34.4, 36.5, 38.51, 40.8, 43.0, 45.7, 48.4] },

    // Elemental Burst — Frostbound Javelin
    { hitKey: "burst-javelin-dmg", talentType: "burst", values: [55.3, 59.5, 63.6, 69.2, 73.3, 77.5, 83.0, 88.5, 94.0, 99.24, 105.1, 110.6, 117.6, 124.5] },
    { hitKey: "stellar-conduct-javelin-dmg", talentType: "burst", values: [36.9, 39.6, 42.4, 46.1, 48.8, 51.6, 55.3, 59.0, 62.7, 66.16, 70.1, 73.8, 78.4, 83.0] },
    { hitKey: "stellar-swirl-javelin-dmg", talentType: "burst", values: [55.3, 59.5, 63.6, 69.2, 73.3, 77.5, 83.0, 88.5, 94.0, 99.24, 105.1, 110.6, 117.6, 124.5] },
  ]
};
