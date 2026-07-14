import type { CharacterTalentSeed } from "./types";

export const columbinaSeed: CharacterTalentSeed = {
  characterId: "columbina",
  hits: [
    // Normal Attack (Moondew Cascade)
    { hitKey: "1-hit", talentType: "normal", values: [46.79, 50.3, 53.81, 58.49, 62.0, 65.51, 70.19, 74.87, 79.55, 84.23, 88.9] },
    { hitKey: "2-hit", talentType: "normal", values: [36.63, 39.37, 42.12, 45.78, 48.53, 51.28, 54.94, 58.6, 62.26, 65.93, 69.59] },
    { hitKey: "3-hit", talentType: "normal", values: [58.48, 62.87, 67.26, 73.11, 77.49, 81.88, 87.73, 93.57, 99.42, 105.27, 111.12] },
    { hitKey: "charged", talentType: "normal", values: [116.08, 124.79, 133.49, 145.1, 153.81, 162.51, 174.12, 185.73, 197.34, 208.94, 220.55] },
    { hitKey: "moondew-cleanse", talentType: "normal", values: [1.51, 1.62, 1.74, 1.89, 2.0, 2.12, 2.27, 2.42, 2.57, 2.72, 2.87] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.6, 89.87, 97.14, 104.41, 112.34, 120.27] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.7, 194.23, 208.77, 224.62, 240.48] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.1, 206.3, 224.45, 242.61, 260.76, 280.57, 300.37] },

    // Elemental Skill (Eternal Tides)
    { hitKey: "skill-dmg", talentType: "skill", values: [16.72, 17.97, 19.23, 20.9, 22.15, 23.41, 25.08, 26.75, 28.42, 30.1, 31.77, 33.44, 35.53] },
    { hitKey: "ripple-dmg", talentType: "skill", values: [9.36, 10.06, 10.76, 11.7, 12.4, 13.1, 14.04, 14.98, 15.91, 16.85, 17.78, 18.72, 19.89] },
    { hitKey: "gi-charged", talentType: "skill", values: [4.7, 5.06, 5.41, 5.88, 6.23, 6.59, 7.06, 7.53, 8.0, 8.47, 8.94, 9.41, 10.0] },
    { hitKey: "gi-bloom", talentType: "skill", values: [7.05, 7.55, 8.1, 8.8, 9.35, 9.85, 10.55, 11.25, 11.95, 12.65, 13.4, 14.1, 14.95] },
    { hitKey: "gi-crystallize", talentType: "skill", values: [8.82, 9.49, 10.15, 11.03, 11.69, 12.35, 13.24, 14.12, 15.0, 15.88, 16.77, 17.65, 18.75] },

    // Elemental Burst (Moonlit Melancholy)
    { hitKey: "burst-dmg", talentType: "burst", values: [32.24, 34.66, 37.08, 40.3, 42.72, 45.14, 48.36, 51.58, 54.81, 58.03, 61.26, 64.48, 68.51] },
    { hitKey: "domain-bonus", talentType: "burst", kind: "buff", values: [13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49] },
  ],
};
