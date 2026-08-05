import type { CharacterTalentSeed } from "./types";

export const heizouSeed: CharacterTalentSeed = {
  characterId: "heizou",
  hits: [
    // Normal Attack — Fudou Style Martial Arts
    { hitKey: "1-hit", talentType: "normal", values: [37.47, 40.52, 43.56, 47.92, 50.96, 54.44, 59.23, 64.02, 68.81, 74.03, 79.25, 84.47, 89.69, 94.91] },
    { hitKey: "2-hit", talentType: "normal", values: [36.85, 39.84, 42.84, 47.12, 50.11, 53.53, 58.24, 62.95, 67.65, 72.78, 77.91, 83.04, 88.17, 93.30] },
    { hitKey: "3-hit", talentType: "normal", values: [51.06, 55.21, 59.35, 65.30, 69.44, 74.18, 80.70, 87.22, 93.73, 100.85, 107.96, 115.07, 122.18, 129.29] },
    { hitKey: "4-hit-a", talentType: "normal", values: [14.78, 15.98, 17.18, 18.90, 20.10, 21.47, 23.36, 25.24, 27.13, 29.19, 31.25, 33.31, 35.37, 37.43] },
    { hitKey: "4-hit-b", talentType: "normal", values: [16.26, 17.58, 18.90, 20.79, 22.11, 23.62, 25.69, 27.77, 29.84, 32.11, 34.38, 36.65, 38.92, 41.19] },
    { hitKey: "4-hit-c", talentType: "normal", values: [19.22, 20.78, 22.34, 24.58, 26.14, 27.92, 30.37, 32.82, 35.27, 37.96, 40.64, 43.33, 46.01, 48.70] },
    { hitKey: "5-hit", talentType: "normal", values: [61.45, 66.45, 71.44, 78.59, 83.58, 89.28, 97.13, 104.98, 112.83, 121.39, 129.95, 138.51, 147.07, 155.63] },
    { hitKey: "charged", talentType: "normal", values: [73.00, 78.93, 84.87, 93.35, 99.28, 106.07, 115.40, 124.73, 134.06, 144.24, 154.42, 164.60, 174.78, 184.96] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.12, 144.05] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.23, 208.77, 224.62, 240.48, 256.34, 272.19, 288.05] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.45, 242.61, 260.76, 280.57, 300.37, 320.18, 339.98, 359.79] },

    // Elemental Skill — Heartstopper Strike
    { hitKey: "skill-dmg", talentType: "skill", values: [227.52, 244.58, 261.65, 284.40, 301.46, 318.53, 341.28, 364.03, 386.78, 409.54, 435.16, 460.78, 492.03, 523.27] },
    { hitKey: "declension-dmg", talentType: "skill", kind: "buff", values: [56.88, 61.15, 65.41, 71.10, 75.37, 79.63, 85.32, 91.01, 96.70, 102.38, 108.79, 115.20, 123.01, 130.82] },
    { hitKey: "conviction-dmg", talentType: "skill", kind: "buff", values: [113.76, 122.29, 130.82, 142.20, 150.73, 159.26, 170.64, 182.02, 193.39, 204.77, 217.58, 230.39, 246.02, 261.64] },

    // Elemental Burst — Windmuster Kick
    { hitKey: "burst-dmg", talentType: "burst", values: [314.70, 338.30, 361.90, 393.38, 416.98, 440.58, 472.05, 503.52, 534.99, 566.46, 601.89, 637.31, 680.57, 723.83] },
    { hitKey: "iris-pyro", talentType: "burst", values: [21.50, 23.11, 24.73, 26.88, 28.49, 30.10, 32.25, 34.40, 36.55, 38.70, 41.12, 43.54, 46.50, 49.46] },
    { hitKey: "iris-hydro", talentType: "burst", values: [21.50, 23.11, 24.73, 26.88, 28.49, 30.10, 32.25, 34.40, 36.55, 38.70, 41.12, 43.54, 46.50, 49.46] },
    { hitKey: "iris-cryo", talentType: "burst", values: [21.50, 23.11, 24.73, 26.88, 28.49, 30.10, 32.25, 34.40, 36.55, 38.70, 41.12, 43.54, 46.50, 49.46] },
    { hitKey: "iris-electro", talentType: "burst", values: [21.50, 23.11, 24.73, 26.88, 28.49, 30.10, 32.25, 34.40, 36.55, 38.70, 41.12, 43.54, 46.50, 49.46] },
  ]
};
