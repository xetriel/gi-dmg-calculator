import type { WeaponConfig } from "../types";

export const sturdyBone: WeaponConfig = {
  id: "sturdy-bone",
  name: "Sturdy Bone",
  type: "Sword",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Sprinting Stride",
  passiveDesc:
    "Sprinting or Alternate Sprinting stamina consumption is decreased by 15%. Additionally, after Sprinting or Alternate Sprinting, Normal Attack DMG is increased by 16~32% of ATK for 6s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "sturdy-bone-na-dmg",
      label: "Normal Attack DMG Bonus (Sturdy Bone)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: r=>[16,20,24,28,32][r-1],
    }
  ],
  
};
