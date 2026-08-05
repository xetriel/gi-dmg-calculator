import type { CharacterTalentSeed } from "./types";

export const ittoSeed: CharacterTalentSeed = {
  characterId: "itto",
  hits: [
    // Normal Attack — Fight Club Legend
    { hitKey: "1-hit", talentType: "normal", values: [79.23, 85.68, 92.13, 101.35, 107.80, 115.17, 125.30, 135.43, 145.56, 156.62, 167.68, 178.74, 189.80, 200.86] },
    { hitKey: "2-hit", talentType: "normal", values: [76.37, 82.59, 88.80, 97.68, 103.90, 111.00, 120.77, 130.54, 140.31, 150.98, 161.64, 172.30, 182.97, 193.63] },
    { hitKey: "3-hit", talentType: "normal", values: [91.64, 99.10, 106.56, 117.21, 124.67, 133.19, 144.91, 156.63, 168.35, 181.15, 193.95, 206.75, 219.55, 232.35] },
    { hitKey: "4-hit", talentType: "normal", values: [117.20, 126.74, 136.28, 149.90, 159.44, 170.35, 185.34, 200.33, 215.33, 231.70, 248.07, 264.44, 280.81, 297.18] },
    { hitKey: "kesagiri-combo", talentType: "normal", values: [91.16, 98.58, 106.00, 116.60, 124.02, 132.50, 144.16, 155.82, 167.48, 180.20, 192.92, 205.64, 218.36, 231.08] },
    { hitKey: "kesagiri-final", talentType: "normal", values: [190.92, 206.46, 222.00, 244.20, 259.74, 277.50, 301.92, 326.34, 350.76, 377.40, 404.04, 430.68, 457.32, 483.96] },
    { hitKey: "saichimonji", talentType: "normal", values: [90.47, 97.83, 105.20, 115.72, 123.08, 131.50, 143.07, 154.64, 166.22, 178.84, 191.46, 204.08, 216.70, 229.32] },
    { hitKey: "plunge", talentType: "normal", values: [81.83, 88.49, 95.16, 104.68, 111.34, 118.96, 129.43, 139.90, 150.37, 161.79, 173.21, 184.63, 196.05, 207.47] },
    { hitKey: "low-plunge", talentType: "normal", values: [163.63, 176.95, 190.27, 209.30, 222.62, 237.85, 258.79, 279.73, 300.67, 323.51, 346.36, 369.21, 392.06, 414.91] },
    { hitKey: "high-plunge", talentType: "normal", values: [204.38, 221.02, 237.66, 261.43, 278.07, 297.09, 323.24, 349.40, 375.55, 404.09, 432.63, 461.17, 489.71, 518.25] },

    // Elemental Skill — Masatsu Zetsugi: Akaushi Burst!
    { hitKey: "skill-dmg", talentType: "skill", values: [307.20, 330.24, 353.28, 384.00, 407.04, 430.08, 460.80, 491.52, 522.24, 552.96, 583.68, 614.40, 652.80, 691.20] },

    // Elemental Burst — Royal Descent: Behold, Itto the Evil!
    { hitKey: "def-to-atk", talentType: "burst", kind: "buff", values: [57.60, 61.92, 66.24, 72.00, 76.32, 80.64, 86.40, 92.16, 97.92, 103.68, 109.44, 115.20, 122.40, 129.60] },
  ]
};
