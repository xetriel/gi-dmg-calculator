import type { CharacterTalentSeed } from "./types";

// Source: Official Genshin Impact Wiki (https://genshin-impact.fandom.com/wiki/Barbara)
// and HoYoWiki (https://wiki.hoyolab.com/pc/genshin/entry/35?lang=en-us)
export const barbaraSeed: CharacterTalentSeed = {
  characterId: "barbara",
  hits: [
    // Normal Attack — Whisper of Water
    {
      hitKey: "1-hit",
      talentType: "normal",
      values: [37.84, 40.68, 43.52, 47.30, 50.14, 52.98, 56.76, 60.54, 64.33, 68.11, 72.05, 75.99, 80.22, 84.46],
    },
    {
      hitKey: "2-hit",
      talentType: "normal",
      values: [35.52, 38.18, 40.85, 44.40, 47.06, 49.73, 53.28, 56.83, 60.38, 63.94, 67.63, 71.32, 75.30, 79.28],
    },
    {
      hitKey: "3-hit",
      talentType: "normal",
      values: [41.04, 44.12, 47.20, 51.30, 54.38, 57.46, 61.56, 65.66, 69.77, 73.87, 78.14, 82.41, 87.01, 91.60],
    },
    {
      hitKey: "4-hit",
      talentType: "normal",
      values: [55.20, 59.34, 63.48, 69.00, 73.14, 77.28, 82.80, 88.32, 93.84, 99.36, 105.10, 110.84, 117.02, 123.21],
    },
    {
      hitKey: "charged",
      talentType: "normal",
      values: [166.24, 178.71, 191.18, 207.80, 220.27, 232.74, 249.36, 265.98, 282.61, 299.23, 316.52, 333.81, 352.43, 371.05],
    },
    {
      hitKey: "plunge",
      talentType: "normal",
      values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.13, 144.06],
    },
    {
      hitKey: "low-plunge",
      talentType: "normal",
      values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.23, 208.77, 224.62, 240.48, 256.33, 272.24, 288.14],
    },
    {
      hitKey: "high-plunge",
      talentType: "normal",
      values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.45, 242.61, 260.76, 280.57, 300.37, 320.18, 340.05, 359.69],
    },

    // Elemental Skill — Let the Show Begin♪
    {
      hitKey: "droplet-dmg",
      talentType: "skill",
      values: [58.40, 62.78, 67.16, 73.00, 77.38, 81.76, 87.60, 93.44, 99.28, 105.12, 110.96, 116.80, 124.10, 131.40],
    },
    {
      hitKey: "skill-heal-per-hit",
      talentType: "skill",
      kind: "heal",
      values: [0.75, 0.81, 0.86, 0.94, 0.99, 1.05, 1.13, 1.20, 1.27, 1.35, 1.43, 1.50, 1.59, 1.69],
    },
    {
      hitKey: "skill-charged-heal",
      talentType: "skill",
      kind: "heal",
      values: [3.00, 3.24, 3.44, 3.76, 3.96, 4.20, 4.52, 4.80, 5.08, 5.40, 5.72, 6.00, 6.36, 6.76],
    },
    {
      hitKey: "skill-continuous-heal",
      talentType: "skill",
      kind: "heal",
      values: [4.00, 4.30, 4.60, 5.00, 5.30, 5.60, 6.00, 6.40, 6.80, 7.20, 7.60, 8.00, 8.50, 9.00],
    },

    // Elemental Burst — Shining Miracle♪
    {
      hitKey: "burst-heal",
      talentType: "burst",
      kind: "heal",
      values: [17.60, 18.92, 20.24, 22.00, 23.32, 24.64, 26.40, 28.16, 29.92, 31.68, 33.44, 35.20, 37.40, 39.60],
    },
  ],
};
