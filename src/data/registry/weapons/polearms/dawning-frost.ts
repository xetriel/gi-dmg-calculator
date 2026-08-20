import type { WeaponConfig } from "../types";

export const dawningFrost: WeaponConfig = {
  id: "dawning-frost",
  name: "Dawning Frost",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 110,
    baseValue: 24,
  },
  passiveName: "Frost Dawn",
  passiveDesc:
    "Elemental Skill DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "dawning-frost-skill",
      label: "Elemental Skill DMG Bonus (Dawning Frost)",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
