import type { WeaponConfig } from "../types";

export const forgedByTheGoldenMelody: WeaponConfig = {
  id: "forged-by-the-golden-melody",
  name: "Forged by the Golden Melody",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Golden Cadence",
  passiveDesc:
    "Elemental Skill and Elemental Burst DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "golden-melody-skill-dmg",
      label: "Elemental Skill DMG Bonus (Golden Melody)",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "golden-melody-burst-dmg",
      label: "Elemental Burst DMG Bonus (Golden Melody)",
      stat: "burstDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
