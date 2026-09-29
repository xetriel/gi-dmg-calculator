import type { CharacterTalentSeed } from "./types";

// Source: Official Genshin Impact Wiki (https://genshin-impact.fandom.com/wiki/Aino)
// NA levels 1–14; Skill/Burst levels 1–14 (Lv 1–13 from wiki, Lv 14 standard curve extrapolation).
// Multi-strike hits store the per-hit value (e.g. 3-Hit DMG Hit 1 / Hit 2).
// C2 Principle of Transference has a constant 25% ATK multiplier across all talent levels.
export const ainoSeed: CharacterTalentSeed = {
  characterId: "aino",
  hits: [
    // Normal Attack — Bish-Bash-Bosh Repair (ATK-scaled Physical)
    {
      hitKey: "1-hit",
      talentType: "normal",
      values: [66.50, 71.91, 77.32, 85.06, 90.47, 96.66, 105.16, 113.67, 122.17, 131.45, 140.73, 150.02, 160.84, 171.66],
    },
    {
      hitKey: "2-hit",
      talentType: "normal",
      values: [66.19, 71.58, 76.97, 84.66, 90.05, 96.21, 104.68, 113.14, 121.61, 130.84, 140.08, 149.33, 160.09, 170.86],
    },
    {
      hitKey: "3-hit-a",
      talentType: "normal",
      values: [49.22, 53.22, 57.23, 62.95, 66.96, 71.54, 77.83, 84.13, 90.42, 97.29, 104.16, 111.04, 119.04, 127.06],
    },
    {
      hitKey: "3-hit-b",
      talentType: "normal",
      values: [49.22, 53.22, 57.23, 62.95, 66.96, 71.54, 77.83, 84.13, 90.42, 97.29, 104.16, 111.04, 119.04, 127.06],
    },
    {
      hitKey: "charged-loop",
      talentType: "normal",
      values: [62.52, 67.61, 72.70, 79.97, 85.06, 90.88, 98.87, 106.87, 114.87, 123.59, 132.31, 141.05, 151.21, 161.39],
    },
    {
      hitKey: "charged-final",
      talentType: "normal",
      values: [113.09, 122.30, 131.50, 144.65, 153.86, 164.38, 178.84, 193.31, 207.77, 223.55, 239.33, 255.13, 273.52, 291.93],
    },
    {
      hitKey: "plunge",
      talentType: "normal",
      values: [74.59, 80.66, 86.73, 95.40, 101.47, 108.41, 117.95, 127.49, 137.03, 147.44, 157.85, 168.28, 180.40, 192.55],
    },
    {
      hitKey: "low-plunge",
      talentType: "normal",
      values: [149.14, 161.28, 173.42, 190.77, 202.91, 216.78, 235.86, 254.93, 274.01, 294.82, 315.63, 336.46, 360.71, 385.00],
    },
    {
      hitKey: "high-plunge",
      talentType: "normal",
      values: [186.29, 201.45, 216.62, 238.28, 253.44, 270.77, 294.60, 318.42, 342.25, 368.25, 394.24, 420.27, 450.56, 480.89],
    },

    // Elemental Skill — Musecatcher (Hydro DMG)
    {
      hitKey: "skill-stage-1",
      talentType: "skill",
      values: [65.60, 70.52, 75.44, 82.00, 86.92, 91.84, 98.40, 104.96, 111.52, 118.08, 124.64, 131.20, 139.40, 147.60],
    },
    {
      hitKey: "skill-stage-2",
      talentType: "skill",
      values: [188.80, 202.96, 217.12, 236.00, 250.16, 264.32, 283.20, 302.08, 320.96, 339.84, 358.72, 377.60, 401.20, 424.80],
    },

    // Elemental Burst — Precision Hydronic Cooler (Hydro DMG)
    {
      hitKey: "water-ball",
      talentType: "burst",
      values: [20.11, 21.62, 23.13, 25.14, 26.65, 28.16, 30.17, 32.18, 34.19, 36.20, 38.21, 40.22, 42.74, 45.25],
    },
    {
      hitKey: "water-ball-enhanced",
      talentType: "burst",
      values: [20.11, 21.62, 23.13, 25.14, 26.65, 28.16, 30.17, 32.18, 34.19, 36.20, 38.21, 40.22, 42.74, 45.25],
    },
    {
      hitKey: "c2-water-ball",
      talentType: "burst",
      values: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    },
  ],
};
