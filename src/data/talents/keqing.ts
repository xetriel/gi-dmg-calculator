import type { CharacterTalentSeed } from "./types";

export const keqingSeed: CharacterTalentSeed = {
  characterId: "keqing",
  hits: [
    // Normal Attack — Yunlai Swordsmanship
    { hitKey: "1-hit", talentType: "normal", values: [41.04, 44.38, 47.72, 52.48, 55.82, 59.64, 64.88, 70.13, 75.37, 81.09, 86.81, 92.53, 98.25, 103.97] },
    { hitKey: "2-hit", talentType: "normal", values: [41.04, 44.38, 47.72, 52.48, 55.82, 59.64, 64.88, 70.13, 75.37, 81.09, 86.81, 92.53, 98.25, 103.97] },
    { hitKey: "3-hit", talentType: "normal", values: [54.68, 59.13, 63.58, 69.93, 74.38, 79.46, 86.44, 93.43, 100.41, 108.03, 115.65, 123.27, 130.89, 138.51] },
    { hitKey: "4-hit-a", talentType: "normal", values: [31.50, 34.06, 36.63, 40.28, 42.84, 45.77, 49.79, 53.81, 57.83, 62.22, 66.60, 70.99, 75.38, 79.77] },
    { hitKey: "4-hit-b", talentType: "normal", values: [34.43, 37.23, 40.03, 44.02, 46.82, 50.02, 54.42, 58.82, 63.22, 68.01, 72.81, 77.61, 82.41, 87.21] },
    { hitKey: "5-hit", talentType: "normal", values: [66.96, 72.41, 77.86, 85.64, 91.09, 97.31, 105.86, 114.41, 122.96, 132.30, 141.64, 150.98, 160.32, 169.66] },
    { hitKey: "charged-1", talentType: "normal", values: [76.80, 83.05, 89.30, 98.22, 104.47, 111.62, 121.44, 131.26, 141.08, 151.80, 162.52, 173.24, 183.96, 194.68] },
    { hitKey: "charged-2", talentType: "normal", values: [86.00, 93.00, 100.00, 110.00, 117.00, 125.00, 136.00, 147.00, 158.00, 170.00, 182.00, 194.00, 206.00, 218.00] },
    { hitKey: "plunge", talentType: "normal", values: [63.54, 68.71, 73.88, 81.27, 86.44, 92.35, 100.48, 108.61, 116.74, 125.62, 134.50, 143.38, 152.26, 161.14] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.04, 137.38, 147.72, 162.50, 172.84, 184.66, 200.91, 217.16, 233.41, 251.15, 268.89, 286.63, 304.37, 322.11] },
    { hitKey: "high-plunge", talentType: "normal", values: [158.68, 171.60, 184.52, 202.98, 215.90, 230.65, 250.96, 271.27, 291.58, 313.71, 335.84, 357.97, 380.10, 402.23] },

    // Elemental Skill — Stellar Restoration
    { hitKey: "stiletto-dmg", talentType: "skill", values: [50.40, 54.18, 57.96, 63.00, 66.78, 70.56, 75.60, 80.64, 85.68, 90.72, 95.76, 100.80, 107.10, 113.40] },
    { hitKey: "slashing-dmg", talentType: "skill", values: [152.00, 163.40, 174.80, 190.00, 201.40, 212.80, 228.00, 243.20, 258.40, 273.60, 288.80, 304.00, 323.00, 342.00] },
    { hitKey: "thunderclap-slash", talentType: "skill", values: [76.00, 81.70, 87.40, 95.00, 100.70, 106.40, 114.00, 121.60, 129.20, 136.80, 144.40, 152.00, 161.50, 171.00] },
    { hitKey: "c1-thundering-might", talentType: "skill", values: [50.00, 50.00, 50.00, 50.00, 50.00, 50.00, 50.00, 50.00, 50.00, 50.00, 50.00, 50.00, 50.00, 50.00] },

    // Elemental Burst — Starward Sword
    { hitKey: "burst-initial", talentType: "burst", values: [88.00, 94.60, 101.20, 110.00, 116.60, 123.20, 132.00, 140.80, 149.60, 158.40, 167.20, 176.00, 187.00, 198.00] },
    { hitKey: "burst-slash", talentType: "burst", values: [24.00, 25.80, 27.60, 30.00, 31.80, 33.60, 36.00, 38.40, 40.80, 43.20, 45.60, 48.00, 51.00, 54.00] },
    { hitKey: "burst-final", talentType: "burst", values: [188.00, 202.10, 216.20, 235.00, 249.10, 263.20, 282.00, 300.80, 319.60, 338.40, 357.20, 376.00, 399.50, 423.00] },
  ]
};
