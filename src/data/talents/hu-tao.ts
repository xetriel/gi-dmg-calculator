import type { CharacterTalentSeed } from "./types";

// Source: Hu_Tao_Talents.md (wiki). NA levels 1–11, Skill/Burst levels 1–13.
// Note: "5-Hit" only has a level-1 value in the source (33.27) — other levels
// fall back to manual entry until verified.
export const huTaoSeed: CharacterTalentSeed = {
  characterId: "hu-tao",
  hits: [
    // Normal Attack (ATK-scaled)
    { hitKey: "1-hit", talentType: "normal", values: [46.89, 50.08, 53.28, 57.54, 60.74, 64.47, 69.26, 74.06, 78.85, 83.65, 88.44] },
    { hitKey: "2-hit", talentType: "normal", values: [48.25, 51.54, 54.83, 59.22, 62.51, 66.35, 71.28, 76.22, 81.15, 86.09, 91.02] },
    { hitKey: "3-hit", talentType: "normal", values: [61.05, 65.21, 69.38, 74.92, 79.09, 83.94, 90.19, 96.43, 102.68, 108.92, 115.16] },
    { hitKey: "4-hit", talentType: "normal", values: [65.64, 70.12, 74.59, 80.56, 85.03, 90.26, 96.97, 103.68, 110.40, 117.11, 123.82] },
    { hitKey: "5-hit", talentType: "normal", values: [65.64, 70.12, 74.59, 80.56, 85.03, 90.26, 96.97, 103.68, 110.40, 117.11, 123.82] },
    { hitKey: "6-hit", talentType: "normal", values: [85.96, 91.82, 97.68, 105.49, 111.36, 118.19, 126.98, 135.78, 144.57, 153.36, 162.15] },
    { hitKey: "charged", talentType: "normal", values: [135.96, 145.23, 154.50, 166.86, 176.13, 186.94, 200.85, 214.75, 228.66, 242.56, 256.47] },
    { hitKey: "plunge", talentType: "normal", values: [65.42, 69.88, 74.34, 80.29, 84.75, 89.95, 96.64, 103.33, 110.02, 116.71, 123.40] },
    { hitKey: "low-plunge", talentType: "normal", values: [130.81, 139.73, 148.65, 160.54, 169.46, 179.86, 193.24, 206.62, 220.00, 233.38, 246.76] },
    { hitKey: "high-plunge", talentType: "normal", values: [163.39, 174.53, 185.67, 200.52, 211.66, 224.66, 241.37, 258.08, 274.79, 291.50, 308.21] },
    // Elemental Skill
    { hitKey: "blood-blossom", talentType: "skill", values: [64.0, 68.8, 73.6, 80.0, 84.8, 89.6, 96.0, 102.4, 108.8, 115.2, 121.6, 128.0, 136.0] },
    { hitKey: "atk-increase", talentType: "skill", kind: "buff", values: [3.84, 4.07, 4.30, 4.60, 4.83, 5.06, 5.36, 5.66, 5.96, 6.26, 6.55, 6.85, 7.15] },
    // Elemental Burst
    { hitKey: "skill-dmg", talentType: "burst", values: [303.27, 321.43, 339.59, 363.20, 381.36, 399.52, 423.13, 446.74, 470.34, 493.95, 517.56, 541.17, 564.78] },
    { hitKey: "low-hp-skill-dmg", talentType: "burst", values: [379.09, 401.79, 424.49, 454.00, 476.70, 499.40, 528.91, 558.42, 587.93, 617.44, 646.95, 676.46, 705.97] },
    { hitKey: "skill-hp-regen", talentType: "burst", kind: "heal", values: [6.26, 6.64, 7.01, 7.50, 7.88, 8.25, 8.74, 9.22, 9.71, 10.20, 10.69, 11.18, 11.66] },
    { hitKey: "low-hp-hp-regen", talentType: "burst", kind: "heal", values: [8.35, 8.85, 9.35, 10.00, 10.50, 11.00, 11.65, 12.30, 12.95, 13.60, 14.25, 14.90, 15.55] },
  ],
};
