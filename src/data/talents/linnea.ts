import type { CharacterTalentSeed } from "./types";

export const linneaSeed: CharacterTalentSeed = {
  characterId: "linnea",
  hits: [
    // Normal Attack — Capture Protocol
    { hitKey: "1-hit", talentType: "normal", values: [59.00, 63.80, 68.60, 75.46, 80.26, 85.75, 93.30, 100.84, 108.39, 116.62, 124.85] },
    { hitKey: "2-hit", talentType: "normal", values: [51.15, 55.32, 59.48, 65.43, 69.59, 74.35, 80.89, 87.43, 93.98, 101.11, 108.25] },
    { hitKey: "3-hit", talentType: "normal", values: [81.63, 88.28, 94.92, 104.41, 111.06, 118.65, 129.09, 139.53, 149.97, 161.36, 172.75] },
    { hitKey: "aimed", talentType: "normal", values: [43.86, 47.43, 51.00, 56.10, 59.67, 63.75, 69.36, 74.97, 80.58, 86.70, 92.82] },
    { hitKey: "aimed-charged", talentType: "normal", values: [124.0, 133.3, 142.6, 155.0, 164.3, 173.6, 186.0, 198.4, 210.8, 223.2, 235.6] },
    { hitKey: "plunge", talentType: "normal", values: [56.83, 61.45, 66.08, 72.90, 77.52, 82.90, 89.87, 96.90, 103.93, 112.34, 120.76] },
    { hitKey: "low-plunge", talentType: "normal", values: [113.63, 122.88, 132.13, 145.76, 155.00, 165.76, 179.70, 193.76, 207.82, 224.63, 241.44] },
    { hitKey: "high-plunge", talentType: "normal", values: [141.93, 153.49, 165.04, 182.06, 193.61, 207.04, 224.45, 242.02, 259.58, 280.57, 301.56] },

    // Elemental Skill — Countermeasure: Lumi's Battle Cry!
    { hitKey: "pound-pound", talentType: "skill", values: [96.0, 103.2, 110.4, 120.0, 127.2, 134.4, 144.0, 153.6, 163.2, 172.8, 182.4, 192.0, 204.0] },
    { hitKey: "heavy-overdrive", talentType: "skill", values: [100.0, 107.5, 115.0, 125.0, 132.5, 140.0, 150.0, 160.0, 170.0, 180.0, 190.0, 200.0, 212.5] },
    { hitKey: "million-ton-crush", talentType: "skill", values: [400.0, 430.0, 460.0, 500.0, 530.0, 560.0, 600.0, 640.0, 680.0, 720.0, 760.0, 800.0, 850.0] },

    // Elemental Burst — Memo: Survival Guide in Extreme Conditions
    { hitKey: "burst-initial", talentType: "burst", kind: "heal", values: [160.0, 172.0, 184.0, 200.0, 212.0, 224.0, 240.0, 256.0, 272.0, 288.0, 304.0, 320.0, 340.0] },
    { hitKey: "burst-continuous", talentType: "burst", kind: "heal", values: [32.0, 34.4, 36.8, 40.0, 42.4, 44.8, 48.0, 51.2, 54.4, 57.6, 60.8, 64.0, 68.0] }
  ]
};
