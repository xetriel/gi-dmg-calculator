import type { WeaponConfig } from "../types";

export const sunnyMorningSleepIn: WeaponConfig = {
  id: "sunny-morning-sleep-in",
  name: "Sunny Morning Sleep-In",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 265,
    baseValue: 58,
  },
  passiveName: "Slumber's Sweet Regrowth",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. Normal and Charged Attack DMG is increased by 20~40%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "sunny-elem-dmg",
      label: "All Elemental DMG Bonus (Sunny Morning Sleep-In)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "sunny-na-dmg",
      label: "Normal Attack DMG Bonus (Sunny Morning Sleep-In)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "sunny-ca-dmg",
      label: "Charged Attack DMG Bonus (Sunny Morning Sleep-In)",
      stat: "chargedDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
