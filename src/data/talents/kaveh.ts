import type { CharacterTalentSeed } from "./types";

export const kavehSeed: CharacterTalentSeed = {
  characterId: "kaveh",
  hits: [
    // Normal Attack — Schematic Setup
    { hitKey: "1-hit", talentType: "normal", values: [81.65, 88.30, 94.94, 104.43, 111.08, 118.67, 129.11, 139.55, 149.99, 161.38, 172.77, 184.16, 195.55, 206.94] },
    { hitKey: "2-hit", talentType: "normal", values: [75.14, 81.26, 87.37, 96.11, 102.23, 109.22, 118.83, 128.44, 138.05, 148.53, 159.01, 169.49, 179.97, 190.45] },
    { hitKey: "3-hit", talentType: "normal", values: [91.80, 99.27, 106.74, 117.42, 124.89, 133.43, 145.17, 156.91, 168.65, 181.45, 194.25, 207.05, 219.85, 232.65] },
    { hitKey: "4-hit", talentType: "normal", values: [111.45, 120.52, 129.59, 142.54, 151.61, 161.98, 176.23, 190.48, 204.73, 220.28, 235.83, 251.38, 266.93, 282.48] },
    { hitKey: "charged-spin", talentType: "normal", values: [65.20, 70.51, 75.82, 83.39, 88.70, 94.76, 103.09, 111.43, 119.76, 128.86, 137.96, 147.06, 156.16, 165.26] },
    { hitKey: "charged-final", talentType: "normal", values: [117.96, 127.56, 137.16, 150.87, 160.47, 171.43, 186.51, 201.59, 216.67, 233.12, 249.57, 266.02, 282.47, 298.92] },
    { hitKey: "plunge", talentType: "normal", values: [74.59, 80.66, 86.73, 95.40, 101.47, 108.41, 117.95, 127.49, 137.03, 147.44, 157.85, 168.26, 178.67, 189.08] },
    { hitKey: "low-plunge", talentType: "normal", values: [149.14, 161.28, 173.42, 190.75, 202.89, 216.78, 235.86, 254.94, 274.02, 294.86, 315.70, 336.54, 357.38, 378.22] },
    { hitKey: "high-plunge", talentType: "normal", values: [186.29, 201.45, 216.62, 238.27, 253.43, 270.78, 294.62, 318.46, 342.31, 368.32, 394.33, 420.34, 446.35, 472.36] },

    // Elemental Skill — Artistic Ingenuity
    { hitKey: "skill-dmg", talentType: "skill", values: [204.00, 219.30, 234.60, 255.00, 270.30, 285.60, 306.00, 326.40, 346.80, 367.20, 387.60, 408.00, 433.50, 459.00] },

    // Elemental Burst — Painted Dome
    { hitKey: "burst-dmg", talentType: "burst", values: [160.00, 172.00, 184.00, 200.00, 212.00, 224.00, 240.00, 256.00, 272.00, 288.00, 304.00, 320.00, 340.00, 360.00] },
    { hitKey: "bloom-dmg-bonus", talentType: "burst", kind: "buff", values: [27.49, 29.55, 31.61, 34.36, 36.42, 38.48, 41.23, 43.98, 46.73, 49.48, 52.23, 54.98, 58.41, 61.85] },

    // Constellation 6 — Pairidaeza's Light
    { hitKey: "c6-pairidaeza", talentType: "burst", values: [61.80, 61.80, 61.80, 61.80, 61.80, 61.80, 61.80, 61.80, 61.80, 61.80, 61.80, 61.80, 61.80, 61.80] },
  ]
};
