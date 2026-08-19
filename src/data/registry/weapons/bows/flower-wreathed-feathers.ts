import type { WeaponConfig } from "../types";

export const flowerWreathedFeathers: WeaponConfig = {
  id: "flower-wreathed-feathers",
  name: "Flower-Wreathed Feathers",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Canopy Hunter",
  passiveDesc:
    "Gliding and Aiming stamina consumption is decreased by 15%. Aimed Shots deal 16~32% increased DMG.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "flower-feathers-ca",
      label: "Charged Attack DMG Bonus (Flower-Wreathed Feathers)",
      stat: "chargedDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: r=>[16,20,24,28,32][r-1],
    }
  ],
  
};
