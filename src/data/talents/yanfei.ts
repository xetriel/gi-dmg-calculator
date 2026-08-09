import type { CharacterTalentSeed } from "./types";

export const yanfeiSeed: CharacterTalentSeed = {
  characterId: "yanfei",
  hits: [
    // Normal Attack — Seal of Approval
    { hitKey: "1-hit", talentType: "normal", values: [58.34, 62.72, 67.09, 72.93, 77.3, 82.26, 88.68, 95.09, 101.51, 108.51, 115.51, 122.51, 131.27, 140.02] },
    { hitKey: "2-hit", talentType: "normal", values: [52.13, 56.04, 59.95, 65.16, 69.07, 73.5, 79.24, 84.97, 90.71, 96.96, 103.22, 109.47, 117.29, 125.11] },
    { hitKey: "3-hit", talentType: "normal", values: [68.61, 73.76, 78.9, 85.76, 90.91, 96.74, 104.29, 111.83, 119.38, 127.61, 135.85, 144.08, 154.37, 164.66] },
    { hitKey: "charged-0-seals", talentType: "normal", values: [121.19, 130.28, 139.37, 151.49, 160.58, 170.88, 184.21, 197.54, 210.87, 225.41, 239.96, 254.5, 272.68, 290.86] },
    { hitKey: "charged-1-seal", talentType: "normal", values: [140.69, 151.24, 161.79, 175.86, 186.41, 198.37, 213.85, 229.32, 244.8, 261.68, 278.57, 295.45, 316.55, 337.66] },
    { hitKey: "charged-2-seals", talentType: "normal", values: [160.19, 172.2, 184.22, 200.24, 212.25, 225.87, 243.49, 261.11, 278.73, 297.95, 317.18, 336.4, 360.43, 384.46] },
    { hitKey: "charged-3-seals", talentType: "normal", values: [179.69, 193.17, 206.64, 224.61, 238.09, 253.36, 273.13, 292.9, 312.66, 334.22, 355.79, 377.35, 404.3, 431.26] },
    { hitKey: "charged-4-seals", talentType: "normal", values: [199.19, 214.13, 229.07, 248.99, 263.93, 280.86, 302.77, 324.68, 346.59, 370.49, 394.4, 418.3, 448.18, 478.06] },
    { hitKey: "blazing-eye", talentType: "normal", values: [80.0, 80.0, 80.0, 80.0, 80.0, 80.0, 80.0, 80.0, 80.0, 80.0, 80.0, 80.0, 80.0, 80.0] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.13, 144.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.22, 208.74, 224.62, 240.50, 256.38, 272.26, 288.14] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.47, 242.63, 260.79, 280.57, 300.35, 320.13, 339.91, 359.69] },

    // Elemental Skill — Signed Decree
    { hitKey: "skill-dmg", talentType: "skill", values: [169.6, 182.32, 195.04, 212.0, 224.72, 237.44, 254.4, 271.36, 288.32, 305.28, 322.24, 339.2, 360.4, 381.6] },

    // Elemental Burst — Done Deal
    { hitKey: "burst-dmg", talentType: "burst", values: [182.4, 196.08, 209.76, 228.0, 241.68, 255.36, 273.6, 291.84, 310.08, 328.32, 346.56, 364.8, 387.6, 410.4] },
    { hitKey: "burst-charged-buff", talentType: "burst", kind: "buff", values: [33.4, 35.5, 37.6, 40.4, 42.5, 44.6, 47.4, 50.2, 53.0, 55.8, 58.6, 61.4, 65.2, 69.0] },
  ]
};
