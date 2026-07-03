import type { CharacterTalentSeed } from "./types";

// Source: Zibai_Cleaned … Fandom.html via scripts/extract-wiki.ts.
// NA levels 1–11 (ATK%), Skill 1–13 (%DEF, Lunar Phase Shift), Burst 1–13 (%DEF).
// Multi-part hits (3-Hit, Charged, Phase Shift 3-Hit/Charged) fire two equal
// components; the table stores the per-hit value ("×2 (each)" in the registry).
// spirit-steed-2, 4-hit-additional, and skill-2 are Lunar-Crystallize reaction hits.
export const zibaiSeed: CharacterTalentSeed = {
  characterId: "zibai",
  hits: [
    // Normal Attack — Golden Blade's Petaled Touch (ATK-scaled)
    { hitKey: "1-hit", talentType: "normal", values: [50.55, 54.67, 58.78, 64.66, 68.78, 73.48, 79.95, 86.41, 92.88, 99.93, 106.99] },
    { hitKey: "2-hit", talentType: "normal", values: [46.55, 50.34, 54.13, 59.54, 63.33, 67.66, 73.62, 79.57, 85.53, 92.02, 98.52] },
    { hitKey: "3-hit-x2", talentType: "normal", values: [30.89, 33.4, 35.92, 39.51, 42.02, 44.9, 48.85, 52.8, 56.75, 61.06, 65.37] },
    { hitKey: "4-hit", talentType: "normal", values: [77.9, 84.24, 90.58, 99.63, 105.97, 113.22, 123.18, 133.15, 143.11, 153.98, 164.85] },
    { hitKey: "charged-x2", talentType: "normal", values: [73.66, 79.65, 85.65, 94.22, 100.21, 107.06, 116.48, 125.91, 135.33, 145.61, 155.88] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.92, 101.1, 109.28, 117.46, 126.38, 135.3] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.7, 270.54] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92] },
    // Elemental Skill — Heaven and Earth Made Manifest (Lunar Phase Shift, %DEF)
    { hitKey: "ps-1-hit", talentType: "skill", values: [56.58, 60.82, 65.07, 70.72, 74.97, 79.21, 84.87, 90.53, 96.18, 101.84, 107.5, 113.16, 120.23] },
    { hitKey: "ps-2-hit", talentType: "skill", values: [52.1, 56.01, 59.92, 65.13, 69.03, 72.94, 78.15, 83.36, 88.57, 93.78, 98.99, 104.2, 110.71] },
    { hitKey: "ps-3-hit-x2", talentType: "skill", values: [34.57, 37.16, 39.75, 43.21, 45.8, 48.4, 51.85, 55.31, 58.77, 62.22, 65.68, 69.14, 73.46] },
    { hitKey: "ps-4-hit", talentType: "skill", values: [87.18, 93.72, 100.26, 108.97, 115.51, 122.05, 130.77, 139.49, 148.2, 156.92, 165.64, 174.36, 185.25] },
    { hitKey: "ps-charged-x2", talentType: "skill", values: [65.95, 70.9, 75.84, 82.44, 87.38, 92.33, 98.92, 105.52, 112.12, 118.71, 125.31, 131.9, 140.14] },
    { hitKey: "spirit-steed-1", talentType: "skill", values: [172.53, 185.47, 198.41, 215.66, 228.6, 241.54, 258.79, 276.04, 293.3, 310.55, 327.8, 345.06, 366.62] },
    { hitKey: "spirit-steed-2", talentType: "skill", values: [140.97, 151.54, 162.11, 176.21, 186.78, 197.36, 211.45, 225.55, 239.65, 253.74, 267.84, 281.94, 299.56] },
    { hitKey: "4-hit-additional", talentType: "skill", values: [29.46, 31.67, 33.87, 36.82, 39.03, 41.24, 44.18, 47.13, 50.08, 53.02, 55.97, 58.91, 62.59] },
    // Elemental Burst — Tri-Sphere Eminence (%DEF)
    { hitKey: "skill-1", talentType: "burst", values: [126.96, 136.48, 146, 158.7, 168.22, 177.74, 190.44, 203.14, 215.83, 228.53, 241.22, 253.92, 269.79] },
    { hitKey: "skill-2", talentType: "burst", values: [177.74, 191.07, 204.41, 222.18, 235.51, 248.84, 266.62, 284.39, 302.16, 319.94, 337.71, 355.49, 377.71] },
  ],
};
