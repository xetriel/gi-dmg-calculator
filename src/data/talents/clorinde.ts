import type { CharacterTalentSeed } from "./types";

// Source: saved wiki page "Clorinde _ Genshin Impact Wiki _ Fandom.html" (extracted via
// scripts/extract-wiki.ts). NA levels 1–11; Skill/Burst levels 1–13.
// Multi-strike hits store the per-hit value: 3-Hit ×2, 4-Hit ×3, Impale: Pact ×3, Burst ×5.
// Swift Hunt / Impale variants are keyed by Bond of Life state (see registry labels).
export const clorindeSeed: CharacterTalentSeed = {
  characterId: "clorinde",
  hits: [
    // Normal Attack — Oath of Hunting Shadows (ATK-scaled)
    { hitKey: "1-hit", talentType: "normal", values: [54.06, 58.46, 62.86, 69.15, 73.55, 78.57, 85.49, 92.40, 99.32, 106.86, 114.41] },
    { hitKey: "2-hit", talentType: "normal", values: [51.63, 55.83, 60.03, 66.04, 70.24, 75.04, 81.64, 88.25, 94.85, 102.06, 109.26] },
    { hitKey: "3-hit-x2", talentType: "normal", values: [34.19, 36.97, 39.75, 43.73, 46.51, 49.69, 54.06, 58.43, 62.80, 67.58, 72.34] },
    { hitKey: "4-hit-x3", talentType: "normal", values: [23.13, 25.02, 26.90, 29.59, 31.47, 33.63, 36.58, 39.54, 42.50, 45.73, 48.96] },
    { hitKey: "5-hit", talentType: "normal", values: [90.01, 97.34, 104.66, 115.13, 122.46, 130.83, 142.34, 153.85, 165.37, 177.93, 190.49] },
    { hitKey: "charged", talentType: "normal", values: [128.14, 138.57, 149.00, 163.90, 174.33, 186.25, 202.64, 219.03, 235.42, 253.30, 271.18] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.92, 101.10, 109.28, 117.46, 126.38, 135.30] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.70, 270.54] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92] },
    // Elemental Skill — Hunter's Vigil (Night Vigil state; variants keyed by Bond of Life)
    { hitKey: "swift-hunt-1", talentType: "skill", values: [26.76, 28.94, 31.12, 34.23, 36.41, 38.90, 42.32, 45.75, 49.17, 52.90, 56.64, 60.37, 64.11] },
    { hitKey: "swift-hunt-2", talentType: "skill", values: [38.79, 41.94, 45.10, 49.61, 52.77, 56.38, 61.34, 66.30, 71.26, 76.67, 82.08, 87.49, 92.91] },
    { hitKey: "impale-1", talentType: "skill", values: [32.97, 35.66, 38.34, 42.17, 44.86, 47.93, 52.14, 56.36, 60.58, 65.18, 69.78, 74.38, 78.98] },
    { hitKey: "impale-2", talentType: "skill", values: [43.96, 47.54, 51.12, 56.23, 59.81, 63.90, 69.52, 75.15, 80.77, 86.90, 93.04, 99.17, 105.31] },
    { hitKey: "impale-3", talentType: "skill", values: [25.11, 27.16, 29.20, 32.12, 34.16, 36.50, 39.71, 42.92, 46.14, 49.64, 53.14, 56.65, 60.15] },
    { hitKey: "surging-blade", talentType: "skill", values: [43.20, 46.44, 49.68, 54.00, 57.24, 60.48, 64.80, 69.12, 73.44, 77.76, 82.08, 86.40, 91.80] },
    // Elemental Burst — Last Lightfall (5 instances; per-hit value)
    { hitKey: "skill-dmg-x5", talentType: "burst", values: [126.88, 136.40, 145.91, 158.60, 168.12, 177.63, 190.32, 203.01, 215.70, 228.38, 241.07, 253.76, 269.62] },
    // Bond of Life granted by the Burst, % Max HP (buff row — feeds the BoL mechanic).
    { hitKey: "bol-gain", talentType: "burst", kind: "buff", values: [66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126, 132, 138] },
  ],
};
