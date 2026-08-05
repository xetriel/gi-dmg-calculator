import type { CharacterTalentSeed } from "./types";

export const kleeSeed: CharacterTalentSeed = {
  characterId: "klee",
  hits: [
    // Normal Attack — Kaboom!
    { hitKey: "1-hit", talentType: "normal", values: [72.16, 77.57, 82.98, 90.20, 95.61, 102.11, 110.77, 119.42, 128.08, 137.83, 147.57, 157.31, 167.05, 176.79] },
    { hitKey: "2-hit", talentType: "normal", values: [62.40, 67.08, 71.76, 78.00, 82.68, 88.30, 95.78, 103.27, 110.76, 119.18, 127.61, 136.03, 144.46, 152.88] },
    { hitKey: "3-hit", talentType: "normal", values: [89.92, 96.66, 103.41, 112.40, 119.14, 127.24, 138.03, 148.82, 159.61, 171.75, 183.89, 196.03, 208.16, 220.30] },
    { hitKey: "charged", talentType: "normal", values: [157.36, 169.16, 180.96, 196.70, 208.50, 222.67, 241.55, 260.43, 279.31, 300.56, 321.80, 343.04, 364.29, 385.53] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.13, 144.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.22, 208.74, 224.62, 240.50, 256.38, 272.26, 288.14] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.47, 242.63, 260.79, 280.57, 300.35, 320.13, 339.91, 359.69] },

    // Elemental Skill — Jumpy Dumpty
    { hitKey: "jumpy-bounce", talentType: "skill", values: [95.20, 102.34, 109.48, 119.00, 126.14, 133.28, 142.80, 152.32, 161.84, 171.36, 180.88, 190.40, 202.30, 214.20] },
    { hitKey: "mine-dmg", talentType: "skill", values: [32.80, 35.26, 37.72, 41.00, 43.46, 45.92, 49.20, 52.48, 55.76, 59.04, 62.32, 65.60, 69.70, 73.80] },

    // Elemental Burst — Sparks 'n' Splash
    { hitKey: "burst-dmg", talentType: "burst", values: [42.64, 45.84, 49.04, 53.30, 56.50, 59.70, 63.96, 68.22, 72.49, 76.75, 81.02, 85.28, 90.61, 95.94] },

    // Constellations
    { hitKey: "c1-chained-reaction", talentType: "burst", values: [51.17, 55.01, 58.85, 63.96, 67.80, 71.64, 76.75, 81.86, 86.99, 92.10, 97.22, 102.34, 108.73, 115.13] },
    { hitKey: "c4-sparkly-explosion", talentType: "burst", values: [555.00, 555.00, 555.00, 555.00, 555.00, 555.00, 555.00, 555.00, 555.00, 555.00, 555.00, 555.00, 555.00, 555.00] },
  ]
};
