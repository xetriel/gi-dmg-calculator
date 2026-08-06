import type { CharacterTalentSeed } from "./types";

export const lyneySeed: CharacterTalentSeed = {
  characterId: "lyney",
  hits: [
    // Normal Attack — Forceful Prop Card
    { hitKey: "1-hit", talentType: "normal", values: [44.8, 48.2, 51.5, 56.4, 59.7, 63.1, 67.9, 72.7, 77.5, 82.3, 87.8, 93.3, 100.2, 107.1] },
    { hitKey: "2-hit", talentType: "normal", values: [43.9, 47.2, 50.4, 55.2, 58.5, 61.8, 66.5, 71.2, 75.9, 80.6, 86.0, 91.4, 98.2, 104.9] },
    { hitKey: "3-hit-1", talentType: "normal", values: [31.5, 33.9, 36.2, 39.6, 42.0, 44.4, 47.7, 51.1, 54.5, 57.9, 61.7, 65.6, 70.4, 75.3] },
    { hitKey: "3-hit-2", talentType: "normal", values: [31.5, 33.9, 36.2, 39.6, 42.0, 44.4, 47.7, 51.1, 54.5, 57.9, 61.7, 65.6, 70.4, 75.3] },
    { hitKey: "4-hit", talentType: "normal", values: [65.8, 70.8, 75.6, 82.8, 87.7, 92.6, 99.6, 106.7, 113.8, 120.9, 128.9, 137.0, 147.1, 157.2] },
    { hitKey: "aimed", talentType: "normal", values: [43.9, 47.2, 50.4, 55.2, 58.5, 61.8, 66.5, 71.2, 75.9, 80.6, 86.0, 91.4, 98.2, 104.9] },
    { hitKey: "charged-1", talentType: "normal", values: [124.0, 133.3, 142.6, 156.2, 165.5, 174.8, 188.1, 201.4, 214.7, 228.0, 243.2, 258.4, 277.6, 296.8] },
    { hitKey: "prop-arrow", talentType: "normal", values: [172.8, 185.8, 198.7, 217.7, 230.7, 243.6, 262.2, 280.8, 299.4, 318.0, 339.0, 360.2, 387.1, 413.9] },
    { hitKey: "pyrotechnic-strike", talentType: "normal", values: [212.0, 227.9, 243.8, 265.0, 280.9, 296.8, 318.0, 339.2, 360.4, 381.6, 402.8, 424.0, 450.5, 477.0] },
    { hitKey: "c6-reprise", talentType: "normal", values: [169.6, 182.32, 195.04, 212.0, 224.72, 237.44, 254.4, 271.36, 288.32, 305.28, 322.24, 339.2, 360.4, 381.6] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.13, 144.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.22, 208.74, 224.62, 240.50, 256.38, 272.26, 288.14] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.47, 242.63, 260.79, 280.57, 300.35, 320.13, 339.91, 359.69] },

    // Elemental Skill — Bewildering Lights
    { hitKey: "skill-dmg", talentType: "skill", values: [167.2, 179.7, 192.3, 209.0, 221.5, 234.1, 250.8, 267.5, 284.2, 300.9, 319.7, 338.4, 357.2, 377.1] },
    { hitKey: "prop-surplus-bonus", talentType: "skill", kind: "buff", values: [53.2, 57.2, 61.2, 66.5, 70.5, 74.5, 79.8, 85.1, 90.4, 95.8, 101.8, 107.7, 113.7, 120.1] },

    // Elemental Burst — Wondrous Trick: Miracle Parade
    { hitKey: "burst-cat", talentType: "burst", values: [154.0, 165.6, 177.1, 192.5, 204.1, 215.6, 231.0, 246.4, 261.8, 277.2, 292.6, 308.0, 327.3, 346.5] },
    { hitKey: "burst-fireworks", talentType: "burst", values: [414.0, 445.1, 476.1, 517.5, 548.6, 579.6, 621.0, 662.4, 703.8, 745.2, 786.6, 828.0, 879.8, 931.5] },
  ]
};
