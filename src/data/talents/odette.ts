import type { CharacterTalentSeed } from "./types";

// Source: Official Genshin Impact Wiki (https://genshin-impact.fandom.com/wiki/Odette)
// NA levels 1–14; Skill/Burst levels 1–14 (Lv 11–13 from wiki, Lv 14 extrapolated).
// Multi-strike hits store the per-hit value (e.g. Burst Slash ×3).
// Radiance: Stellar Glimmer variants are direct Stellar reaction hits with exact multiplier scaling.
export const odetteSeed: CharacterTalentSeed = {
  characterId: "odette",
  hits: [
    // Normal Attack — Snow Swan Variation (ATK-scaled)
    { hitKey: "1-hit", talentType: "normal", values: [51.86, 56.08, 60.3, 66.33, 70.55, 75.37, 82.01, 88.64, 95.27, 102.51, 109.74, 116.98, 124.21, 131.45] },
    { hitKey: "2-hit", talentType: "normal", values: [51.51, 55.7, 59.9, 65.89, 70.08, 74.87, 81.46, 88.05, 94.64, 101.82, 109.01, 116.19, 123.38, 130.56] },
    { hitKey: "3-hit-a", talentType: "normal", values: [32.61, 35.27, 37.92, 41.71, 44.37, 47.4, 51.57, 55.74, 59.91, 64.46, 69.01, 73.56, 78.11, 82.66] },
    { hitKey: "3-hit-b", talentType: "normal", values: [38.28, 41.39, 44.51, 48.96, 52.08, 55.64, 60.53, 65.43, 70.33, 75.67, 81.01, 86.35, 91.69, 97.03] },
    { hitKey: "4-hit", talentType: "normal", values: [74.57, 80.64, 86.71, 95.38, 101.45, 108.39, 117.93, 127.47, 137.01, 147.41, 157.82, 168.22, 178.63, 189.03] },
    { hitKey: "5-hit", talentType: "normal", values: [90.21, 97.56, 104.9, 115.39, 122.73, 131.12, 142.66, 154.2, 165.74, 178.33, 190.91, 203.5, 216.08, 228.67] },
    { hitKey: "charged", talentType: "normal", values: [107.41, 116.16, 124.9, 137.39, 146.13, 156.13, 169.86, 183.6, 197.34, 212.33, 227.32, 242.31, 257.3, 272.29] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.92, 101.1, 109.28, 117.46, 126.38, 135.3, 144.22, 153.14, 162.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.7, 270.54, 288.38, 306.22, 324.06] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92, 360.2, 382.48, 404.76] },

    // Elemental Skill — Adagio: Phantom Night Dancers
    { hitKey: "skill-dmg", talentType: "skill", values: [108.08, 116.19, 124.29, 135.1, 143.21, 151.31, 162.12, 172.93, 183.74, 194.54, 205.35, 216.16, 229.67, 243.18] },
    { hitKey: "coda-dot", talentType: "skill", values: [95.84, 103.03, 110.22, 119.8, 126.99, 134.18, 143.76, 153.34, 162.93, 172.51, 182.1, 191.68, 203.66, 215.64] },
    { hitKey: "coda-stellar-conduct", talentType: "skill", values: [305.76, 328.69, 351.62, 382.2, 405.13, 428.06, 458.64, 489.22, 519.79, 550.37, 580.94, 611.52, 649.74, 687.96] },
    { hitKey: "coda-stellar-swirl", talentType: "skill", values: [458.64, 493.04, 527.44, 573.3, 607.7, 642.1, 687.96, 733.82, 779.69, 825.55, 871.42, 917.28, 974.61, 1031.94] },
    { hitKey: "plume-dance", talentType: "skill", values: [43.04, 46.27, 49.5, 53.8, 57.03, 60.26, 64.56, 68.86, 73.17, 77.47, 81.78, 86.08, 91.46, 96.84] },
    { hitKey: "plume-stellar-conduct", talentType: "skill", values: [27.02, 29.05, 31.08, 33.78, 35.81, 37.83, 40.54, 43.24, 45.94, 48.64, 51.35, 54.05, 57.43, 60.8] },
    { hitKey: "plume-stellar-swirl", talentType: "skill", values: [40.53, 43.57, 46.61, 50.66, 53.7, 56.74, 60.79, 64.84, 68.9, 72.95, 77.0, 81.06, 86.12, 91.2] },
    { hitKey: "wing-dance", talentType: "skill", values: [51.46, 55.32, 59.18, 64.33, 68.19, 72.05, 77.2, 82.34, 87.49, 92.64, 97.78, 102.93, 109.36, 115.79] },
    { hitKey: "wing-stellar-conduct", talentType: "skill", values: [32.31, 34.74, 37.16, 40.39, 42.81, 45.24, 48.47, 51.7, 54.93, 58.16, 61.39, 64.62, 68.66, 72.7] },
    { hitKey: "wing-stellar-swirl", talentType: "skill", values: [48.46, 52.1, 55.73, 60.58, 64.21, 67.85, 72.7, 77.54, 82.39, 87.24, 92.08, 96.93, 102.99, 109.05] },
    { hitKey: "c1-stellar-conduct", talentType: "skill", values: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300] },
    { hitKey: "c1-stellar-swirl", talentType: "skill", values: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450] },

    // Elemental Burst — Presto: Bluebird Finale
    { hitKey: "burst-slash", talentType: "burst", values: [110.18, 118.44, 126.7, 137.72, 145.98, 154.25, 165.26, 176.28, 187.3, 198.32, 209.33, 220.35, 234.12, 247.9] },
    { hitKey: "final-slash", talentType: "burst", values: [170.27, 183.04, 195.81, 212.84, 225.61, 238.38, 255.41, 272.44, 289.46, 306.49, 323.52, 340.54, 361.83, 383.1] },
    { hitKey: "snow-swans-dream-bonus", talentType: "burst", kind: "buff", values: [14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66] },
    { hitKey: "c4-coord-stellar-conduct", talentType: "burst", values: [66, 66, 66, 66, 66, 66, 66, 66, 66, 66, 66, 66, 66, 66] },
    { hitKey: "c4-coord-stellar-swirl", talentType: "burst", values: [99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99] },
  ],
};
