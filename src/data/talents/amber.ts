import type { CharacterTalentSeed } from "./types";

// Source: Official Genshin Impact Wiki (https://genshin-impact.fandom.com/wiki/Amber)
// and HoYoWiki (https://wiki.hoyolab.com/pc/genshin/entry/14?lang=en-us)
export const amberSeed: CharacterTalentSeed = {
  characterId: "amber",
  hits: [
    // Normal Attack — Sharpshooter
    {
      hitKey: "1-hit",
      talentType: "normal",
      values: [36.12, 39.06, 42.00, 46.20, 49.14, 52.50, 57.12, 61.74, 66.36, 71.40, 76.44, 81.48, 86.52, 91.56],
    },
    {
      hitKey: "2-hit",
      talentType: "normal",
      values: [36.12, 39.06, 42.00, 46.20, 49.14, 52.50, 57.12, 61.74, 66.36, 71.40, 76.44, 81.48, 86.52, 91.56],
    },
    {
      hitKey: "3-hit",
      talentType: "normal",
      values: [46.44, 50.22, 54.00, 59.40, 63.18, 67.50, 73.44, 79.38, 85.32, 91.80, 98.28, 104.76, 111.24, 117.72],
    },
    {
      hitKey: "4-hit",
      talentType: "normal",
      values: [47.30, 51.15, 55.00, 60.50, 64.35, 68.75, 74.80, 80.85, 86.90, 93.50, 100.10, 106.70, 113.30, 119.90],
    },
    {
      hitKey: "5-hit",
      talentType: "normal",
      values: [59.34, 64.17, 69.00, 75.90, 80.73, 86.25, 93.84, 101.43, 109.02, 117.30, 125.58, 133.86, 142.14, 150.42],
    },
    {
      hitKey: "aimed",
      talentType: "normal",
      values: [43.86, 47.43, 51.00, 55.73, 59.29, 63.32, 68.91, 74.49, 80.08, 86.15, 92.22, 98.29, 104.36, 110.43],
    },
    {
      hitKey: "aimed-c1",
      talentType: "normal",
      values: [8.77, 9.49, 10.20, 11.15, 11.86, 12.66, 13.78, 14.90, 16.02, 17.23, 18.44, 19.66, 20.87, 22.09],
    },
    {
      hitKey: "fully-charged-aimed",
      talentType: "normal",
      values: [124.00, 133.30, 142.60, 155.00, 164.30, 173.60, 186.00, 198.40, 210.80, 223.20, 235.60, 248.00, 263.50, 279.00],
    },
    {
      hitKey: "fully-charged-aimed-c1",
      talentType: "normal",
      values: [24.80, 26.66, 28.52, 31.00, 32.86, 34.72, 37.20, 39.68, 42.16, 44.64, 47.12, 49.60, 52.70, 55.80],
    },
    {
      hitKey: "plunge",
      talentType: "normal",
      values: [56.83, 61.45, 66.08, 72.69, 77.31, 82.60, 89.87, 97.14, 104.41, 112.34, 120.27, 128.20, 136.12, 144.05],
    },
    {
      hitKey: "low-plunge",
      talentType: "normal",
      values: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.70, 194.23, 208.77, 224.62, 240.48, 256.34, 272.19, 288.05],
    },
    {
      hitKey: "high-plunge",
      talentType: "normal",
      values: [141.93, 153.49, 165.04, 181.54, 193.10, 206.30, 224.45, 242.61, 260.76, 280.57, 300.37, 320.18, 339.98, 359.79],
    },

    // Elemental Skill — Explosive Puppet
    {
      hitKey: "skill-hp",
      talentType: "skill",
      kind: "heal",
      values: [41.36, 44.46, 47.56, 51.70, 54.80, 57.90, 62.04, 66.18, 70.31, 74.45, 78.58, 82.72, 87.89, 93.06],
    },
    {
      hitKey: "explosion-dmg",
      talentType: "skill",
      values: [123.20, 132.44, 141.68, 154.00, 163.24, 172.48, 184.80, 197.12, 209.44, 221.76, 234.08, 246.40, 261.80, 277.20],
    },
    {
      hitKey: "manual-detonation-c2",
      talentType: "skill",
      values: [123.20, 132.44, 141.68, 154.00, 163.24, 172.48, 184.80, 197.12, 209.44, 221.76, 234.08, 246.40, 261.80, 277.20],
    },

    // Elemental Burst — Fiery Rain
    {
      hitKey: "burst-wave-dmg",
      talentType: "burst",
      values: [28.08, 30.19, 32.29, 35.10, 37.21, 39.31, 42.12, 44.93, 47.74, 50.54, 53.35, 56.16, 59.67, 63.18],
    },
    {
      hitKey: "burst-total-dmg",
      talentType: "burst",
      values: [505.44, 543.35, 581.26, 631.80, 669.71, 707.62, 758.16, 808.69, 859.23, 909.77, 960.34, 1010.88, 1074.06, 1137.24],
    },
  ],
};
