import type { CharacterTalentSeed } from "./types";

export const ineffaSeed: CharacterTalentSeed = {
  characterId: "ineffa",
  hits: [
    // Normal Attack (Cyclonic Duster)
    { hitKey: "1-hit", talentType: "normal", values: [34.84, 37.67, 40.51, 44.56, 47.39, 50.63, 55.09, 59.54, 64.00, 68.86, 73.72] },
    { hitKey: "2-hit", talentType: "normal", values: [34.22, 37.01, 39.79, 43.77, 46.56, 49.74, 54.12, 58.49, 62.87, 67.65, 72.42] },
    { hitKey: "3-hit", talentType: "normal", values: [22.76, 24.61, 26.46, 29.11, 30.96, 33.07, 35.99, 38.90, 41.81, 44.98, 48.16] },
    { hitKey: "4-hit", talentType: "normal", values: [56.07, 60.63, 65.20, 71.71, 76.28, 81.49, 88.67, 95.84, 103.01, 110.83, 118.65] },
    { hitKey: "charged", talentType: "normal", values: [94.94, 102.67, 110.40, 121.44, 129.17, 138.00, 150.14, 162.29, 174.43, 187.68, 200.93] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.92, 101.10, 109.28, 117.46, 126.38, 135.30] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.70, 270.54] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92] },

    // Elemental Skill (Cleaning Mode: Carrier Frequency)
    { hitKey: "skill-dmg", talentType: "skill", values: [86.40, 92.88, 99.36, 108.00, 114.48, 120.96, 129.60, 138.24, 146.88, 155.52, 164.16, 172.80, 183.60] },
    { hitKey: "shield", talentType: "skill", kind: "shield", values: [221.18, 237.77, 254.36, 276.48, 293.07, 309.66, 331.78, 353.89, 376.01, 398.13, 420.25, 442.37, 470.02] },
    { hitKey: "discharge", talentType: "skill", values: [96.00, 103.20, 110.40, 120.00, 127.20, 134.40, 144.00, 153.60, 163.20, 172.80, 182.40, 192.00, 204.00] },
    { hitKey: "a1-extra", talentType: "skill", values: [65.0, 65.0, 65.0, 65.0, 65.0, 65.0, 65.0, 65.0, 65.0, 65.0, 65.0, 65.0, 65.0] },

    // Elemental Burst (Supreme Instruction: Cyclonic Exterminator)
    { hitKey: "burst-dmg", talentType: "burst", values: [676.80, 727.56, 778.32, 846.00, 896.76, 947.52, 1015.20, 1082.88, 1150.56, 1218.24, 1285.92, 1353.60, 1438.20] },
    { hitKey: "c2-punishment-edict", talentType: "burst", values: [300.0, 300.0, 300.0, 300.0, 300.0, 300.0, 300.0, 300.0, 300.0, 300.0, 300.0, 300.0, 300.0] },
    { hitKey: "c6-dawning-morn", talentType: "burst", values: [135.0, 135.0, 135.0, 135.0, 135.0, 135.0, 135.0, 135.0, 135.0, 135.0, 135.0, 135.0, 135.0] },
  ],
};
