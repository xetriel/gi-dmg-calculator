import type { CharacterTalentSeed } from "./types";

export const xiaoSeed: CharacterTalentSeed = {
  characterId: "xiao",
  hits: [
    // Normal Attack — Whirlwind Thrust
    { hitKey: "1-hit-1", talentType: "normal", values: [27.5, 29.8, 32.0, 35.0, 37.3, 39.8, 43.0, 46.2, 49.3, 52.6, 56.1, 59.6, 63.8, 68.1] },
    { hitKey: "1-hit-2", talentType: "normal", values: [27.5, 29.8, 32.0, 35.0, 37.3, 39.8, 43.0, 46.2, 49.3, 52.6, 56.1, 59.6, 63.8, 68.1] },
    { hitKey: "2-hit", talentType: "normal", values: [56.9, 61.5, 66.2, 72.4, 77.1, 82.2, 88.9, 95.6, 102.2, 108.9, 116.0, 123.1, 131.9, 140.7] },
    { hitKey: "3-hit", talentType: "normal", values: [68.6, 74.2, 79.8, 87.2, 92.9, 99.1, 107.1, 115.2, 123.2, 131.3, 139.8, 148.4, 159.0, 169.6] },
    { hitKey: "4-hit-1", talentType: "normal", values: [37.7, 40.8, 43.8, 47.9, 51.0, 54.4, 58.8, 63.2, 67.6, 72.0, 76.7, 81.4, 87.2, 93.0] },
    { hitKey: "4-hit-2", talentType: "normal", values: [37.7, 40.8, 43.8, 47.9, 51.0, 54.4, 58.8, 63.2, 67.6, 72.0, 76.7, 81.4, 87.2, 93.0] },
    { hitKey: "5-hit", talentType: "normal", values: [71.5, 77.3, 83.2, 90.9, 96.8, 103.3, 111.7, 120.1, 128.5, 136.9, 145.8, 154.7, 165.7, 176.7] },
    { hitKey: "6-hit", talentType: "normal", values: [95.8, 103.6, 111.4, 121.8, 129.6, 138.3, 149.6, 160.9, 172.2, 183.5, 195.4, 207.3, 222.1, 236.9] },
    { hitKey: "charged", talentType: "normal", values: [121.0, 130.8, 140.6, 153.7, 163.5, 174.5, 188.8, 203.0, 217.3, 231.5, 246.5, 261.6, 280.2, 298.8] },
    { hitKey: "plunge", talentType: "normal", values: [82.0, 88.7, 95.4, 104.3, 111.0, 118.6, 128.3, 138.0, 147.7, 157.3, 167.5, 177.8, 190.4, 203.1] },
    { hitKey: "low-plunge", talentType: "normal", values: [164.0, 177.3, 190.7, 208.5, 221.8, 237.0, 256.4, 275.7, 295.0, 314.4, 334.8, 355.2, 380.6, 405.9] },
    { hitKey: "high-plunge", talentType: "normal", values: [204.8, 221.5, 238.2, 260.4, 277.1, 296.0, 320.2, 344.4, 368.5, 392.7, 418.2, 443.7, 475.4, 507.0] },

    // Elemental Skill — Lemniscatic Wind Cycling
    { hitKey: "skill-dmg", talentType: "skill", values: [252.8, 271.76, 290.72, 316.0, 334.96, 353.92, 379.2, 404.48, 429.76, 455.04, 480.32, 505.6, 537.2, 568.8] },

    // Elemental Burst — Bane of All Evil
    { hitKey: "burst-dmg-bonus", talentType: "burst", kind: "buff", values: [58.5, 62.4, 66.3, 71.5, 75.4, 79.3, 84.5, 89.7, 94.9, 95.2, 100.4, 105.6, 110.8, 116.0] },
  ]
};
