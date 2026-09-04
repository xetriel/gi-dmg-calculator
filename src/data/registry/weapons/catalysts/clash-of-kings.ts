import type { WeaponConfig } from "../types";

export const clashOfKings: WeaponConfig = {
  id: "clash-of-kings",
  name: "Clash of Kings",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Royal Clash",
  passiveDesc:
    "Increases Normal and Charged Attack DMG by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "clash-na-dmg",
      label: "Normal Attack DMG Bonus (Clash of Kings)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "clash-ca-dmg",
      label: "Charged Attack DMG Bonus (Clash of Kings)",
      stat: "chargedDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
