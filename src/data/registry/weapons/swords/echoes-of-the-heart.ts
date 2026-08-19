import type { WeaponConfig } from "../types";

export const echoesOfTheHeart: WeaponConfig = {
  id: "echoes-of-the-heart",
  name: "Echoes of the Heart",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
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
      label: "Elemental Skill DMG Bonus",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
