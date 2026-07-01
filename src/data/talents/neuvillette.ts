import type { CharacterTalentSeed } from "./types";

// Source: Neuvillette_Talents.md (wiki). NA levels 1–13, Skill levels 1–11.
// Burst per-level table was not captured — stays manual until fetched.
export const neuvilletteSeed: CharacterTalentSeed = {
  characterId: "neuvillette",
  hits: [
    // Normal Attack — 1/2/3-Hit, Charged, Plunges scale ATK; Equitable Judgment scales Max HP.
    { hitKey: "1-hit", talentType: "normal", values: [54.58, 58.67, 62.76, 68.22, 72.31, 76.41, 81.87, 87.32, 92.78, 98.24, 103.70, 109.15, 115.98] },
    { hitKey: "2-hit", talentType: "normal", values: [46.25, 49.71, 53.18, 57.81, 61.28, 64.74, 69.37, 73.99, 78.62, 83.24, 87.87, 92.49, 98.27] },
    { hitKey: "3-hit", talentType: "normal", values: [72.34, 77.76, 83.19, 90.42, 95.85, 101.27, 108.51, 115.74, 122.97, 130.21, 137.44, 144.68, 153.72] },
    { hitKey: "charged", talentType: "normal", values: [136.80, 147.06, 157.32, 171.00, 181.26, 191.52, 205.20, 218.88, 232.56, 246.24, 259.92, 273.60, 290.70] },
    { hitKey: "equitable-judgment", talentType: "normal", values: [7.32, 7.91, 8.51, 9.36, 9.96, 10.64, 11.57, 12.51, 13.45, 14.47, 15.49, 16.51, 17.53] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.12] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.16, 179.70, 194.23, 208.77, 224.62, 240.48, 256.34, 272.19] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.45, 242.61, 260.76, 280.57, 300.37, 320.18, 339.98] },
    // Elemental Skill (Max HP-scaled)
    { hitKey: "skill-dmg", talentType: "skill", values: [12.86, 13.83, 14.79, 16.08, 17.04, 18.01, 19.30, 20.58, 21.87, 23.16, 24.44] },
    { hitKey: "spiritbreath-thorn", talentType: "skill", values: [20.80, 22.36, 23.92, 26.00, 27.56, 29.12, 31.20, 33.28, 35.36, 37.44, 39.50] },
  ],
};
