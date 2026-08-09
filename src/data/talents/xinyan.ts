import type { CharacterTalentSeed } from "./types";

export const xinyanSeed: CharacterTalentSeed = {
  characterId: "xinyan",
  hits: [
    // Normal Attack — Dance on Fire
    { hitKey: "1-hit", talentType: "normal", values: [76.5, 82.73, 88.96, 97.92, 104.15, 111.31, 121.02, 130.74, 140.45, 151.32, 162.18, 173.04, 186.05, 199.06] },
    { hitKey: "2-hit", talentType: "normal", values: [74.0, 80.02, 86.04, 94.72, 100.74, 107.67, 117.07, 126.47, 135.87, 146.37, 156.88, 167.39, 180.0, 192.6] },
    { hitKey: "3-hit", talentType: "normal", values: [95.5, 103.27, 111.04, 122.24, 130.01, 138.95, 151.08, 163.21, 175.34, 188.89, 202.46, 216.03, 232.26, 248.49] },
    { hitKey: "4-hit", talentType: "normal", values: [115.8, 125.23, 134.66, 148.22, 157.65, 168.49, 183.19, 197.89, 212.59, 229.01, 245.42, 261.84, 281.5, 301.16] },
    { hitKey: "charged-spin", talentType: "normal", values: [62.6, 67.69, 72.78, 80.13, 85.22, 91.08, 99.03, 106.99, 114.94, 123.81, 132.67, 141.53, 152.17, 162.8] },
    { hitKey: "charged-final", talentType: "normal", values: [113.0, 122.18, 131.36, 144.64, 153.82, 164.42, 178.76, 193.11, 207.45, 223.47, 239.5, 255.52, 274.72, 293.92] },
    { hitKey: "plunge", talentType: "normal", values: [74.59, 80.66, 86.73, 95.48, 101.55, 108.48, 117.93, 127.38, 136.83, 147.23, 157.63, 168.03, 178.43, 188.83] },
    { hitKey: "low-plunge", talentType: "normal", values: [149.14, 161.28, 173.42, 190.9, 203.04, 216.91, 235.8, 254.7, 273.6, 294.4, 315.2, 336.0, 356.8, 377.6] },
    { hitKey: "high-plunge", talentType: "normal", values: [186.29, 201.46, 216.63, 238.45, 253.62, 270.94, 294.54, 318.15, 341.76, 367.74, 393.72, 419.7, 445.68, 471.66] },

    // Elemental Skill — Sweeping Fervor
    { hitKey: "skill-swing", talentType: "skill", values: [170.4, 183.18, 195.96, 213.0, 225.78, 238.56, 255.6, 272.64, 289.68, 306.72, 323.76, 340.8, 362.1, 383.4] },
    { hitKey: "shield-dot", talentType: "skill", values: [33.6, 36.12, 38.64, 42.0, 44.52, 47.04, 50.4, 53.76, 57.12, 60.48, 63.84, 67.2, 71.4, 75.6] },

    // Elemental Burst — Riff Revolution
    { hitKey: "burst-physical", talentType: "burst", values: [341.0, 366.58, 392.15, 426.25, 451.83, 477.4, 511.5, 545.6, 579.7, 613.8, 647.9, 682.0, 724.63, 767.25] },
    { hitKey: "burst-pyro-dot", talentType: "burst", values: [40.0, 43.0, 46.0, 50.0, 53.0, 56.0, 60.0, 64.0, 68.0, 72.0, 76.0, 80.0, 85.0, 90.0] },
  ]
};
