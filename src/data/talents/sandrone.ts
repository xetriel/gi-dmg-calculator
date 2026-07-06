import type { CharacterTalentSeed } from "./types";

// Source: Sandrone_Cleaned … Fandom.html via scripts/extract-wiki.ts.
// NA levels 1–14, Skill 1–10, Burst 1–13. The "…-stellar" rows are the
// Stellar-Conduct variants of the same hits (computed via the stellar branch).
// Bombardment fires ×3; the table stores the per-hit value.
export const sandroneSeed: CharacterTalentSeed = {
  characterId: "sandrone",
  hits: [
    // Normal Attack — Formule Phenomenale: Self-Evident Proposition (ATK-scaled)
    { hitKey: "1-hit", talentType: "normal", values: [76.29, 82.5, 88.7, 97.58, 103.78, 110.88, 120.64, 130.4, 140.15, 150.8, 161.44, 172.09, 182.73, 193.38] },
    { hitKey: "2-hit", talentType: "normal", values: [67.2, 72.67, 78.14, 85.95, 91.42, 97.67, 106.27, 114.86, 123.45, 132.83, 142.21, 151.58, 160.96, 170.34] },
    { hitKey: "3-hit", talentType: "normal", values: [102.8, 111.17, 119.54, 131.49, 139.86, 149.42, 162.57, 175.72, 188.87, 203.22, 217.56, 231.91, 246.25, 260.6] },
    { hitKey: "sweeping-fire", talentType: "normal", values: [43, 46.5, 50, 55, 58.5, 62.5, 68, 73.5, 79, 85, 91, 97, 103, 109] },
    { hitKey: "condensed-beam", talentType: "normal", values: [122.55, 132.53, 142.5, 156.75, 166.72, 178.13, 193.8, 209.47, 225.15, 242.25, 259.35, 276.45, 293.55, 310.65] },
    { hitKey: "condensed-beam-stellar", talentType: "normal", values: [81.7, 88.35, 95, 104.5, 111.15, 118.75, 129.2, 139.65, 150.1, 161.5, 172.9, 184.3, 195.7, 207.1] },
    { hitKey: "power-overdrive", talentType: "normal", values: [43, 46.5, 50, 55, 58.5, 62.5, 68, 73.5, 79, 85, 91, 97, 103, 109] },
    { hitKey: "plunge", talentType: "normal", values: [74.59, 80.66, 86.73, 95.4, 101.47, 108.41, 117.95, 127.49, 137.03, 147.44, 157.85, 168.26, 178.66, 189.07] },
    { hitKey: "low-plunge", talentType: "normal", values: [149.14, 161.28, 173.42, 190.77, 202.91, 216.78, 235.86, 254.93, 274.01, 294.82, 315.63, 336.44, 357.25, 378.06] },
    { hitKey: "high-plunge", talentType: "normal", values: [186.29, 201.45, 216.62, 238.28, 253.44, 270.77, 294.6, 318.42, 342.25, 368.25, 394.24, 420.23, 446.23, 472.22] },
    // Elemental Skill — Formule Phenomenale: Differential Analysis
    { hitKey: "prism-shot", talentType: "skill", values: [32.4, 34.83, 37.26, 40.5, 42.93, 45.36, 48.6, 51.84, 55.08, 58.32] },
    { hitKey: "prism-shot-stellar", talentType: "skill", values: [21.6, 23.22, 24.84, 27, 28.62, 30.24, 32.4, 34.56, 36.72, 38.88] },
    // Elemental Burst — Formule Phenomenale: Q.E.D.
    { hitKey: "bombardment", talentType: "burst", values: [88.22, 94.83, 101.45, 110.27, 116.89, 123.5, 132.32, 141.15, 149.97, 158.79, 167.61, 176.43, 187.46] },
    { hitKey: "convective-ray", talentType: "burst", values: [330.8, 355.61, 380.42, 413.5, 438.31, 463.12, 496.2, 529.28, 562.36, 595.44, 628.52, 661.6, 702.95] },
    { hitKey: "convective-ray-stellar", talentType: "burst", values: [220.53, 237.07, 253.61, 275.67, 292.21, 308.75, 330.8, 352.85, 374.91, 396.96, 419.01, 441.07, 468.63] },
  ],
};
