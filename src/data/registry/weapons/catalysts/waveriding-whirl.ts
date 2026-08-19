import type { WeaponConfig } from "../types";

export const waveridingWhirl: WeaponConfig = {
  id: "waveriding-whirl",
  name: "Waveriding Whirl",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Water Strider",
  passiveDesc:
    "Swimming Stamina Consumption is decreased by 15%. Max HP is increased by 20~40% for 10s after using an Elemental Skill.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "waveriding-hp",
      label: "Max HP% (Waveriding Whirl)",
      stat: "hp",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: r=>[20,25,30,35,40][r-1],
    }
  ],
  
};
