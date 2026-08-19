import type { WeaponConfig } from "../types";

export const theDaybreakChronicles: WeaponConfig = {
  id: "the-daybreak-chronicles",
  name: "The Daybreak Chronicles",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Daybreak Melody",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. CRIT DMG is increased by 20~40%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "daybreak-elem-dmg",
      label: "All Elemental DMG Bonus (The Daybreak Chronicles)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "daybreak-crit-dmg",
      label: "CRIT DMG% (The Daybreak Chronicles)",
      stat: "critDmg",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
