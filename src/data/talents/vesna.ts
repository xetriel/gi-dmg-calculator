import type { CharacterTalentSeed } from "./types";

// Source: Official Genshin Impact Wiki (https://genshin-impact.fandom.com/wiki/Vesna)
// NA levels 1–14; Skill/Burst levels 1–14 (Lv 11–13 from wiki, Lv 14 extrapolated).
// Multi-strike hits store the per-hit value (e.g. 3-Hit DMG Hit 1 / Hit 2, Spirit Blades Lv3 ×4).
// Radiance: Stellar Swirl variants are direct Stellar Swirl reaction hits.
export const vesnaSeed: CharacterTalentSeed = {
  characterId: "vesna",
  hits: [
    // Normal Attack — Vila Blade Dance (ATK-scaled)
    { hitKey: "1-hit", talentType: "normal", values: [40.42, 43.71, 47.00, 51.70, 54.99, 58.75, 63.92, 69.09, 74.26, 79.90, 85.54, 91.18, 96.82, 102.46] },
    { hitKey: "2-hit", talentType: "normal", values: [48.67, 52.63, 56.58, 62.25, 66.20, 70.74, 76.96, 83.18, 89.41, 96.20, 102.99, 109.78, 116.57, 123.37] },
    { hitKey: "3-hit-a", talentType: "normal", values: [28.08, 30.36, 32.65, 35.91, 38.20, 40.81, 44.40, 47.99, 51.58, 55.50, 59.42, 63.34, 67.25, 71.17] },
    { hitKey: "3-hit-b", talentType: "normal", values: [28.08, 30.36, 32.65, 35.91, 38.20, 40.81, 44.40, 47.99, 51.58, 55.50, 59.42, 63.34, 67.25, 71.17] },
    { hitKey: "4-hit", talentType: "normal", values: [59.19, 64.01, 68.82, 75.71, 80.52, 86.03, 93.60, 101.17, 108.74, 117.00, 125.26, 133.52, 141.78, 150.04] },
    { hitKey: "5-hit", talentType: "normal", values: [62.43, 67.51, 72.58, 79.85, 84.92, 90.74, 98.72, 106.70, 114.69, 123.40, 132.11, 140.82, 149.54, 158.25] },
    { hitKey: "6-hit", talentType: "normal", values: [72.24, 78.13, 84.00, 92.41, 98.28, 105.00, 114.24, 123.48, 132.72, 142.80, 152.88, 162.96, 173.04, 183.13] },
    { hitKey: "charged", talentType: "normal", values: [91.06, 98.48, 105.88, 116.48, 123.88, 132.35, 144.00, 155.65, 167.29, 180.00, 192.71, 205.42, 218.12, 230.83] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.92, 101.10, 109.28, 117.46, 126.38, 135.30, 144.22, 153.14, 162.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.70, 270.54, 288.38, 306.22, 324.06] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92, 360.20, 382.48, 404.76] },

    // Elemental Skill — The Art of Victory
    { hitKey: "initial-dmg", talentType: "skill", values: [122.23, 131.38, 140.56, 152.77, 161.94, 171.12, 183.33, 195.56, 207.77, 220.00, 232.23, 244.44, 259.73, 275.00] },
    { hitKey: "wind-pinion", talentType: "skill", values: [10.39, 11.17, 11.95, 12.99, 13.76, 14.54, 15.58, 16.62, 17.66, 18.70, 19.74, 20.78, 22.08, 23.38] },
    { hitKey: "windborne-1", talentType: "skill", values: [40.00, 43.00, 46.00, 50.00, 53.00, 56.00, 60.00, 64.00, 68.00, 72.00, 76.00, 80.00, 85.00, 90.00] },
    { hitKey: "windborne-2", talentType: "skill", values: [60.00, 64.50, 69.00, 75.00, 79.50, 84.00, 90.00, 96.00, 102.00, 108.00, 114.00, 120.00, 127.50, 135.00] },
    { hitKey: "spirit-blade-2", talentType: "skill", values: [112.00, 120.39, 128.80, 140.00, 148.40, 156.80, 168.00, 179.20, 190.40, 201.60, 212.80, 224.00, 238.00, 252.00] },
    { hitKey: "spirit-blade-2-stellar", talentType: "skill", values: [112.00, 120.39, 128.80, 140.00, 148.40, 156.80, 168.00, 179.20, 190.40, 201.60, 212.80, 224.00, 238.00, 252.00] },
    { hitKey: "windborne-3-blades", talentType: "skill", values: [44.80, 48.16, 51.52, 56.00, 59.36, 62.72, 67.20, 71.68, 76.16, 80.64, 85.12, 89.60, 95.20, 100.80] },
    { hitKey: "windborne-3-blades-stellar", talentType: "skill", values: [44.80, 48.16, 51.52, 56.00, 59.36, 62.72, 67.20, 71.68, 76.16, 80.64, 85.12, 89.60, 95.20, 100.80] },
    { hitKey: "windborne-3-final", talentType: "skill", values: [156.80, 168.55, 180.32, 196.00, 207.76, 219.52, 235.20, 250.88, 266.56, 282.24, 297.92, 313.60, 333.20, 352.80] },
    { hitKey: "c6-transpose", talentType: "skill", values: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150] },
    { hitKey: "c6-transpose-blade", talentType: "skill", values: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200] },
    { hitKey: "c6-transpose-blade-stellar", talentType: "skill", values: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200] },

    // Elemental Burst — For the Tsaritsa!
    { hitKey: "burst-spirit-blade", talentType: "burst", values: [263.22, 282.95, 302.71, 329.03, 348.76, 368.52, 394.82, 421.16, 447.46, 473.80, 500.14, 526.44, 559.37, 592.25] },
    { hitKey: "burst-spirit-blade-stellar", talentType: "burst", values: [263.22, 282.95, 302.71, 329.03, 348.76, 368.52, 394.82, 421.16, 447.46, 473.80, 500.14, 526.44, 559.37, 592.25] },
  ],
};
