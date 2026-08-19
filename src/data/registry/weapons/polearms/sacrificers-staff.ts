import type { WeaponConfig } from "../types";

export const sacrificersStaff: WeaponConfig = {
  id: "sacrificers-staff",
  name: "Sacrificer's Staff",
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
  passiveName: "Sacrificial Rites",
  passiveDesc:
    "Elemental Skill DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "sacrificer-staff-skill",
      label: "Elemental Skill DMG Bonus (Sacrificer's Staff)",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
