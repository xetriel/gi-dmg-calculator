import type { CharacterTalentSeed } from "./types";

export const dehyaSeed: CharacterTalentSeed = {
  characterId: "dehya",
  hits: [
    // Normal Attack — Sandstorm Assault
    { hitKey: "1-hit", talentType: "normal", values: [62.08, 67.13, 72.18, 79.39, 84.44, 90.21, 98.14, 106.08, 114.02, 122.68, 131.33, 139.99, 148.65, 157.30] },
    { hitKey: "2-hit", talentType: "normal", values: [62.27, 67.34, 72.41, 79.64, 84.71, 90.50, 98.46, 106.42, 114.38, 123.07, 131.75, 140.44, 149.12, 157.81] },
    { hitKey: "3-hit", talentType: "normal", values: [76.88, 83.13, 89.39, 98.33, 104.58, 111.73, 121.56, 131.39, 141.22, 151.95, 162.68, 173.41, 184.14, 194.87] },
    { hitKey: "4-hit", talentType: "normal", values: [95.35, 103.10, 110.86, 121.94, 129.70, 138.57, 150.77, 162.97, 175.17, 188.47, 201.78, 215.08, 228.39, 241.69] },
    { hitKey: "charged-spin", talentType: "normal", values: [56.33, 60.91, 65.50, 72.05, 76.63, 81.87, 89.07, 96.28, 103.48, 111.34, 119.21, 127.08, 134.95, 142.81] },
    { hitKey: "charged-final", talentType: "normal", values: [101.87, 110.15, 118.44, 130.30, 138.59, 148.06, 161.08, 174.10, 187.13, 201.35, 215.58, 229.80, 244.03, 258.26] },
    { hitKey: "plunge", talentType: "normal", values: [74.59, 80.65, 86.72, 95.39, 101.46, 108.40, 117.94, 127.47, 137.01, 147.43, 157.85, 168.27, 178.69, 189.11] },
    { hitKey: "low-plunge", talentType: "normal", values: [149.14, 161.26, 173.39, 190.73, 202.86, 216.74, 235.81, 254.88, 273.95, 294.78, 315.61, 336.44, 357.27, 378.10] },
    { hitKey: "high-plunge", talentType: "normal", values: [186.29, 201.44, 216.60, 238.26, 253.42, 270.75, 294.57, 318.40, 342.22, 368.23, 394.24, 420.26, 446.27, 472.28] },

    // Elemental Skill — Molten Inferno
    { hitKey: "indomitable-flame", talentType: "skill", values: [112.88, 121.35, 129.81, 141.10, 149.57, 158.03, 169.32, 180.61, 191.90, 203.18, 214.47, 225.76, 237.05, 248.34] },
    { hitKey: "indomitable-flame-hp", talentType: "skill", kind: "buff", values: [5.64, 6.07, 6.49, 7.06, 7.48, 7.90, 8.47, 9.03, 9.60, 10.16, 10.72, 11.29, 11.85, 12.42] },

    { hitKey: "ranging-flame", talentType: "skill", values: [132.80, 142.76, 152.72, 166.00, 175.96, 185.92, 199.20, 212.48, 225.76, 239.04, 252.32, 265.60, 278.88, 292.16] },
    { hitKey: "ranging-flame-hp", talentType: "skill", kind: "buff", values: [6.64, 7.14, 7.64, 8.30, 8.80, 9.30, 9.96, 10.62, 11.29, 11.95, 12.62, 13.28, 13.94, 14.61] },

    { hitKey: "field-dmg", talentType: "skill", values: [60.20, 64.72, 69.23, 75.25, 79.77, 84.28, 90.30, 96.32, 102.34, 108.36, 114.38, 120.40, 126.42, 132.44] },
    { hitKey: "field-dmg-hp", talentType: "skill", kind: "buff", values: [3.01, 3.24, 3.46, 3.76, 3.99, 4.21, 4.52, 4.82, 5.12, 5.42, 5.72, 6.02, 6.32, 6.62] },

    // Elemental Burst — Leonine Bite
    { hitKey: "flame-manes-fist", talentType: "burst", values: [98.70, 106.10, 113.51, 123.38, 130.78, 138.18, 148.05, 157.92, 167.79, 177.66, 187.53, 197.40, 207.27, 217.14] },
    { hitKey: "flame-manes-fist-hp", talentType: "burst", kind: "buff", values: [5.64, 6.07, 6.49, 7.06, 7.48, 7.90, 8.47, 9.03, 9.60, 10.15, 10.72, 11.29, 11.85, 12.41] },

    { hitKey: "incineration-drive", talentType: "burst", values: [139.30, 149.75, 160.20, 174.13, 184.57, 195.02, 208.95, 222.88, 236.81, 250.74, 264.67, 278.60, 292.53, 306.46] },
    { hitKey: "incineration-drive-hp", talentType: "burst", kind: "buff", values: [7.96, 8.56, 9.15, 9.95, 10.55, 11.14, 11.94, 12.74, 13.53, 14.33, 15.12, 15.92, 16.72, 17.51] },
  ]
};
