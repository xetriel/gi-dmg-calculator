import type { WeaponConfig } from "../types";

export const dawningFrost: WeaponConfig = {
  id: "dawning-frost",
  name: "Dawning Frost",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 55.1,
    baseValue: 12,
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
