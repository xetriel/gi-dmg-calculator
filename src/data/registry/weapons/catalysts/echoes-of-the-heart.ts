import type { WeaponConfig } from "../types";

export const echoesOfTheHeart: WeaponConfig = {
  id: "echoes-of-the-heart",
  name: "Echoes of the Heart",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Heart Echo",
  passiveDesc:
    "Elemental Skill DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "echoes-heart-skill",
      label: "Elemental Skill DMG Bonus (Echoes of the Heart)",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
