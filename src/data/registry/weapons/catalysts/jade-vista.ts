import type { WeaponConfig } from "../types";

export const jadeVista: WeaponConfig = {
  id: "jade-vista",
  name: "Jade Vista",
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
  passiveName: "Jade Light",
  passiveDesc:
    "Normal Attack DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "jade-vista-na",
      label: "Normal Attack DMG Bonus (Jade Vista)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
