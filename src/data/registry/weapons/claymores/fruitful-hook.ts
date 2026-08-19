import type { WeaponConfig } from "../types";

export const fruitfulHook: WeaponConfig = {
  id: "fruitful-hook",
  name: "Fruitful Hook",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "The Weight of the Branch",
  passiveDesc:
    "Increases Plunging Attack CRIT Rate by 16~32%. After a Plunging Attack hits an opponent, Normal, Charged, and Plunging Attack DMG is increased by 16~32% for 10s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "fruitful-plunge-crit",
      label: "Plunging Attack CRIT Rate% (Fruitful Hook)",
      stat: "critRate",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: r=>[16,20,24,28,32][r-1],
    },
    {
      id: "fruitful-na-ca-plunge-dmg",
      label: "NA/CA/Plunge DMG Bonus (Fruitful Hook)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: r=>[16,20,24,28,32][r-1],
    }
  ],
  
};
