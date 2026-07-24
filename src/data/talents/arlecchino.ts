import type { CharacterTalentSeed } from "./types";

// Source: saved wiki page "Arlecchino _ Genshin Impact Wiki _ Fandom.html" (extracted
// via scripts/extract-wiki.ts). NA levels 1–14; Skill levels 1–10; Burst levels 1–13.
// 4-Hit is two equal hits per level ("37.15 + 37.15") → 4-hit-a / 4-hit-b.
// Burst healing is a fixed formula (150% Bond of Life + 150% ATK), handled as a mechanic.
export const arlecchinoSeed: CharacterTalentSeed = {
  characterId: "arlecchino",
  hits: [
    // Normal Attack (ATK-scaled)
    { hitKey: "1-hit", talentType: "normal", values: [47.50, 51.37, 55.23, 60.76, 64.62, 69.04, 75.12, 81.19, 87.27, 93.90, 100.52, 107.15, 113.78, 120.41] },
    { hitKey: "2-hit", talentType: "normal", values: [52.11, 56.35, 60.59, 66.65, 70.89, 75.73, 82.40, 89.06, 95.73, 103.00, 110.27, 117.54, 124.81, 132.08] },
    { hitKey: "3-hit", talentType: "normal", values: [65.39, 70.71, 76.03, 83.63, 88.96, 95.04, 103.40, 111.76, 120.13, 129.25, 138.37, 147.50, 156.62, 165.75] },
    { hitKey: "4-hit-a", talentType: "normal", values: [37.15, 40.17, 43.19, 47.51, 50.53, 53.99, 58.74, 63.49, 68.24, 73.43, 78.61, 83.79, 88.98, 94.16] },
    { hitKey: "4-hit-b", talentType: "normal", values: [37.15, 40.17, 43.19, 47.51, 50.53, 53.99, 58.74, 63.49, 68.24, 73.43, 78.61, 83.79, 88.98, 94.16] },
    { hitKey: "5-hit", talentType: "normal", values: [69.98, 75.68, 81.37, 89.51, 95.21, 101.72, 110.67, 119.62, 128.57, 138.34, 148.10, 157.87, 167.63, 177.40] },
    { hitKey: "6-hit", talentType: "normal", values: [85.38, 92.33, 99.28, 109.20, 116.15, 124.10, 135.02, 145.94, 156.86, 168.77, 180.68, 192.60, 204.51, 216.42] },
    { hitKey: "charged", talentType: "normal", values: [90.82, 98.21, 105.60, 116.16, 123.55, 132.00, 143.62, 155.23, 166.85, 179.52, 192.19, 204.86, 217.54, 230.21] },
    { hitKey: "plunge", talentType: "normal", values: [63.93, 69.14, 74.34, 81.77, 86.98, 92.92, 101.10, 109.28, 117.46, 126.38, 135.30, 144.22, 153.14, 162.06] },
    { hitKey: "low-plunge", talentType: "normal", values: [127.84, 138.24, 148.65, 163.51, 173.92, 185.81, 202.16, 218.51, 234.86, 252.70, 270.54, 288.38, 306.22, 324.05] },
    { hitKey: "high-plunge", talentType: "normal", values: [159.68, 172.67, 185.67, 204.24, 217.23, 232.09, 252.51, 272.93, 293.36, 315.64, 337.92, 360.20, 382.48, 404.76] },
    // Masque of the Red Death: bonus-DMG coefficient per NA talent level (× Bond of Life).
    { hitKey: "masque-increase", talentType: "normal", kind: "buff", values: [120.4, 130.2, 140.0, 154.0, 163.8, 175.0, 190.4, 205.8, 221.2, 238.0, 254.8, 271.6, 288.4, 305.2] },
    // Elemental Skill — All Is Ash
    { hitKey: "spike", talentType: "skill", values: [14.84, 15.95, 17.07, 18.55, 19.66, 20.78, 22.26, 23.74, 25.23, 26.71] },
    { hitKey: "cleave", talentType: "skill", values: [133.56, 143.58, 153.59, 166.95, 176.97, 186.98, 200.34, 213.70, 227.05, 240.41] },
    { hitKey: "blood-debt-directive", talentType: "skill", values: [31.80, 34.19, 36.57, 39.75, 42.13, 44.52, 47.70, 50.88, 54.06, 57.24] },
    // Elemental Burst — Balemoon Rising
    { hitKey: "skill-dmg", talentType: "burst", values: [370.40, 398.18, 425.96, 463.00, 490.78, 518.56, 555.60, 592.64, 629.68, 666.72, 703.76, 740.80, 787.10] },
    // C2 DMG — Balemoon Bloodfire (900% ATK)
    { hitKey: "c2-balemoon-bloodfire", talentType: "special", values: [900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900] },
  ],
};
