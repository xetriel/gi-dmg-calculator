import type { WeaponConfig } from "../types";

export const festeringDesire: WeaponConfig = {
  id: "festering-desire",
  name: "Festering Desire",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Undying Admiration",
  passiveDesc:
    "Increases Elemental Skill DMG by 16~32% and Elemental Skill CRIT Rate by 6~12%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "festering-skill-dmg",
      label: "Elemental Skill DMG Bonus (Festering Desire)",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: r=>[16,20,24,28,32][r-1],
    },
    {
      id: "festering-skill-crit",
      label: "Elemental Skill CRIT Rate% (Festering Desire)",
      stat: "critRate",
      refinementValues: [6, 7.5, 9, 10.5, 12],
      isTeamBuff: false,
      compute: r=>[6,7.5,9,10.5,12][r-1],
    }
  ],
  
};
