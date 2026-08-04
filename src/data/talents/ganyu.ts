import type { CharacterTalentSeed } from "./types";

export const ganyuSeed: CharacterTalentSeed = {
  characterId: "ganyu",
  hits: [
    // Normal Attack — Liutian Archery
    { hitKey: "1-hit", talentType: "normal", values: [31.73, 34.31, 36.89, 40.32, 42.90, 45.82, 49.83, 53.84, 57.85, 62.72, 67.59, 72.46, 77.33, 82.20] },
    { hitKey: "2-hit", talentType: "normal", values: [35.62, 38.52, 41.42, 45.29, 48.19, 51.47, 55.97, 60.47, 64.97, 70.44, 75.91, 81.38, 86.85, 92.32] },
    { hitKey: "3-hit", talentType: "normal", values: [45.48, 49.18, 52.88, 57.82, 61.52, 65.71, 71.45, 77.20, 82.94, 89.90, 96.86, 103.82, 110.78, 117.74] },
    { hitKey: "4-hit", talentType: "normal", values: [45.48, 49.18, 52.88, 57.82, 61.52, 65.71, 71.45, 77.20, 82.94, 89.90, 96.86, 103.82, 110.78, 117.74] },
    { hitKey: "5-hit", talentType: "normal", values: [48.27, 52.20, 56.13, 61.37, 65.30, 69.75, 75.85, 81.95, 88.05, 95.44, 102.83, 110.22, 117.61, 125.00] },
    { hitKey: "6-hit", talentType: "normal", values: [57.62, 62.31, 67.00, 73.26, 77.95, 83.27, 90.56, 97.85, 105.14, 113.97, 122.80, 131.63, 140.46, 149.29] },
    { hitKey: "aimed", talentType: "normal", values: [43.86, 47.43, 51.00, 55.73, 59.29, 63.32, 68.91, 74.49, 80.08, 86.15, 92.22, 98.29, 104.36, 110.43] },
    { hitKey: "aimed-charge-1", talentType: "normal", values: [124.00, 133.30, 142.60, 155.00, 164.30, 173.60, 186.00, 198.40, 210.80, 223.20, 235.60, 248.00, 263.50, 279.00] },
    { hitKey: "frostflake-arrow", talentType: "normal", values: [128.00, 137.60, 147.20, 160.00, 169.60, 179.20, 192.00, 204.80, 217.60, 230.40, 243.20, 256.00, 272.00, 288.00] },
    { hitKey: "frostflake-bloom", talentType: "normal", values: [217.60, 233.92, 250.24, 272.00, 288.32, 304.64, 326.40, 348.16, 369.92, 391.68, 413.44, 435.20, 462.40, 489.60] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.12, 144.05] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.23, 208.77, 224.62, 240.48, 256.34, 272.19, 288.05] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.45, 242.61, 260.76, 280.57, 300.37, 320.18, 339.98, 359.79] },

    // Elemental Skill — Trail of the Qilin
    { hitKey: "skill-dmg", talentType: "skill", values: [132.00, 141.90, 151.80, 165.00, 174.90, 184.80, 198.00, 211.20, 224.40, 237.60, 250.80, 264.00, 280.50, 297.00] },

    // Elemental Burst — Celestial Shower
    { hitKey: "ice-shard", talentType: "burst", values: [70.00, 75.25, 80.50, 87.50, 92.75, 98.00, 105.00, 112.00, 119.00, 126.00, 133.00, 140.00, 148.75, 157.50] },
  ]
};
