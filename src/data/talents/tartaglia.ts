import type { CharacterTalentSeed } from "./types";

export const tartagliaSeed: CharacterTalentSeed = {
  characterId: "tartaglia",
  hits: [
    // Normal Attack — Cutting Torrent (Bow Stance)
    { hitKey: "1-hit", talentType: "normal", values: [41.3, 44.7, 48.0, 52.6, 55.9, 59.7, 64.7, 69.7, 74.6, 80.0, 85.3, 90.7, 97.4, 104.1] },
    { hitKey: "2-hit", talentType: "normal", values: [46.3, 50.0, 53.8, 58.9, 62.7, 66.9, 72.4, 78.0, 83.5, 89.6, 95.6, 101.6, 109.1, 116.6] },
    { hitKey: "3-hit", talentType: "normal", values: [55.4, 59.9, 64.4, 70.6, 75.1, 80.1, 86.8, 93.4, 100.1, 107.3, 114.5, 121.7, 130.6, 139.6] },
    { hitKey: "4-hit", talentType: "normal", values: [57.0, 61.6, 66.3, 72.6, 77.2, 82.4, 89.2, 96.1, 102.9, 110.4, 117.8, 125.2, 134.4, 143.6] },
    { hitKey: "5-hit", talentType: "normal", values: [60.5, 65.4, 70.3, 77.0, 81.9, 87.4, 94.7, 102.0, 109.2, 117.1, 125.0, 132.9, 142.6, 152.4] },
    { hitKey: "6-hit", talentType: "normal", values: [72.8, 78.7, 84.6, 92.7, 98.6, 105.2, 113.9, 122.6, 131.3, 140.8, 150.3, 159.8, 171.5, 183.2] },
    { hitKey: "aimed", talentType: "normal", values: [43.9, 47.2, 50.4, 55.2, 58.5, 61.8, 66.5, 71.2, 75.9, 80.6, 86.0, 91.4, 98.2, 104.9] },
    { hitKey: "charged-1", talentType: "normal", values: [124.0, 133.3, 142.6, 156.2, 165.5, 174.8, 188.1, 201.4, 214.7, 228.0, 243.2, 258.4, 277.6, 296.8] },
    { hitKey: "riptide-flash", talentType: "normal", values: [12.4, 13.3, 14.3, 15.6, 16.6, 17.5, 18.8, 20.1, 21.5, 22.8, 24.3, 25.8, 27.8, 29.7] },
    { hitKey: "riptide-burst", talentType: "normal", values: [62.0, 66.7, 71.3, 78.1, 82.8, 87.4, 94.1, 100.7, 107.3, 114.0, 121.6, 129.2, 138.8, 148.4] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.13, 144.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.22, 208.74, 224.62, 240.50, 256.38, 272.26, 288.14] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.47, 242.63, 260.79, 280.57, 300.35, 320.13, 339.91, 359.69] },

    // Elemental Skill — Foul Legacy: Raging Wave (Melee Stance)
    { hitKey: "stance-change", talentType: "skill", values: [72.0, 77.4, 82.8, 90.0, 95.4, 100.8, 108.0, 115.2, 122.4, 129.6, 136.8, 144.0, 153.0, 162.0] },
    { hitKey: "melee-1-hit", talentType: "skill", values: [38.8, 41.7, 44.6, 48.5, 51.4, 54.3, 58.2, 62.1, 66.0, 69.8, 73.7, 77.6, 82.5, 87.3] },
    { hitKey: "melee-2-hit", talentType: "skill", values: [41.6, 44.7, 47.8, 52.0, 55.1, 58.2, 62.4, 66.6, 70.7, 74.9, 79.0, 83.2, 88.4, 93.6] },
    { hitKey: "melee-3-hit", talentType: "skill", values: [56.3, 60.5, 64.7, 70.4, 74.6, 78.8, 84.5, 90.1, 95.7, 101.3, 107.0, 112.6, 119.6, 126.7] },
    { hitKey: "melee-4-hit", talentType: "skill", values: [59.9, 64.4, 68.9, 74.9, 79.4, 83.9, 89.9, 95.8, 101.8, 107.8, 113.8, 119.8, 127.3, 134.8] },
    { hitKey: "melee-5-hit", talentType: "skill", values: [65.3, 70.2, 75.1, 81.6, 86.5, 91.4, 97.9, 104.4, 111.0, 117.5, 124.0, 130.5, 138.7, 146.9] },
    { hitKey: "melee-6-hit-1", talentType: "skill", values: [35.4, 38.1, 40.7, 44.3, 46.9, 49.6, 53.1, 56.6, 60.2, 63.7, 67.3, 70.8, 75.2, 79.7] },
    { hitKey: "melee-6-hit-2", talentType: "skill", values: [42.7, 45.9, 49.1, 53.4, 56.6, 59.8, 64.0, 68.3, 72.6, 76.9, 81.1, 85.4, 90.7, 96.1] },
    { hitKey: "melee-charged-1", talentType: "skill", values: [60.2, 64.7, 69.2, 75.2, 79.7, 84.3, 90.3, 96.3, 102.3, 108.4, 114.4, 120.4, 127.9, 135.4] },
    { hitKey: "melee-charged-2", talentType: "skill", values: [71.5, 76.9, 82.2, 89.4, 94.7, 100.1, 107.3, 114.4, 121.6, 128.7, 135.9, 143.0, 152.0, 160.9] },
    { hitKey: "riptide-slash", talentType: "skill", values: [60.2, 64.7, 69.2, 75.2, 79.7, 84.3, 90.3, 96.3, 102.3, 108.4, 114.4, 120.4, 127.9, 135.4] },

    // Elemental Burst — Havoc: Obliteration
    { hitKey: "burst-ranged", talentType: "burst", values: [378.4, 406.78, 435.16, 473.0, 501.38, 529.76, 567.6, 605.44, 643.28, 681.12, 718.96, 756.8, 804.1, 851.4] },
    { hitKey: "burst-melee", talentType: "burst", values: [464.0, 498.8, 533.6, 580.0, 614.8, 649.6, 696.0, 742.4, 788.8, 835.2, 881.6, 928.0, 986.0, 1044.0] },
    { hitKey: "riptide-blast", talentType: "burst", values: [120.0, 129.0, 138.0, 150.0, 159.0, 168.0, 180.0, 192.0, 204.0, 216.0, 228.0, 240.0, 255.0, 270.0] },
  ]
};
