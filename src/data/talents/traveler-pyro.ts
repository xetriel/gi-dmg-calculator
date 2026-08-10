import type { CharacterTalentSeed } from "./types";

export const travelerPyroSeed: CharacterTalentSeed = {
  characterId: "traveler-pyro",
  hits: [
    // Normal Attack — Foreign Starfire
    { hitKey: "1-hit", talentType: "normal", values: [44.51, 48.13, 51.75, 56.92, 60.54, 64.68, 70.11, 75.55, 80.98, 86.93, 92.88, 98.83, 106.34, 113.85] },
    { hitKey: "2-hit", talentType: "normal", values: [43.43, 46.96, 50.5, 55.55, 59.08, 63.12, 68.42, 73.73, 79.03, 84.84, 90.64, 96.45, 103.77, 111.1] },
    { hitKey: "3-hit", talentType: "normal", values: [52.97, 57.28, 61.6, 67.76, 72.07, 77.0, 83.46, 89.93, 96.4, 103.48, 110.57, 117.65, 126.59, 135.52] },
    { hitKey: "4-hit", talentType: "normal", values: [58.31, 63.05, 67.8, 74.58, 79.32, 84.75, 91.87, 98.98, 106.1, 113.9, 121.7, 129.5, 139.33, 149.16] },
    { hitKey: "5-hit", talentType: "normal", values: [70.78, 76.53, 82.3, 90.53, 96.29, 102.87, 111.51, 120.15, 128.8, 138.26, 147.72, 157.19, 169.12, 181.06] },
    { hitKey: "charged-1", talentType: "normal", values: [55.9, 60.45, 65.0, 71.5, 76.05, 81.25, 88.08, 94.9, 101.72, 109.2, 116.67, 124.15, 133.58, 143.0] },
    { hitKey: "charged-2-aether", talentType: "normal", values: [60.7, 65.64, 70.58, 77.64, 82.58, 88.23, 95.64, 103.05, 110.46, 118.58, 126.7, 134.82, 145.05, 155.28] },
    { hitKey: "charged-2-lumine", talentType: "normal", values: [72.24, 78.11, 84.0, 92.4, 98.28, 105.0, 113.82, 122.64, 131.46, 141.12, 150.78, 160.44, 172.62, 184.8] },
    { hitKey: "charged-inferno", talentType: "normal", values: [200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.93, 101.1, 109.28, 117.46, 126.38, 135.3, 144.22, 153.14, 162.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.7, 270.54, 288.38, 306.22, 324.06] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92, 360.2, 382.48, 404.76] },

    // Elemental Skill — Flowfire Blade
    { hitKey: "blazing-threshold-dmg", talentType: "skill", values: [27.3, 29.35, 31.39, 34.12, 36.17, 38.22, 40.95, 43.68, 46.41, 50.5, 53.51, 56.51, 60.47, 64.43] },
    { hitKey: "hold-dmg", talentType: "skill", values: [96.11, 103.32, 110.52, 120.13, 127.34, 134.55, 144.16, 153.77, 163.38, 177.8, 188.37, 198.94, 212.88, 226.81] },
    { hitKey: "scorching-threshold-dmg", talentType: "skill", values: [79.24, 85.19, 91.13, 99.05, 105.0, 110.94, 118.86, 126.79, 134.71, 146.6, 155.32, 164.03, 175.52, 187.01] },

    // Elemental Burst — Plains Scorcher
    { hitKey: "burst-dmg", talentType: "burst", values: [415.68, 446.85, 478.03, 519.6, 550.77, 581.95, 623.51, 665.08, 706.65, 769.0, 814.72, 860.45, 920.72, 980.99] },
  ]
};
