import type { WeaponConfig } from "../types";

export const swordOfDescension: WeaponConfig = {
  id: "sword-of-descension",
  name: "Sword of Descension",
  type: "Sword",
  rarity: 4,
  baseAtk: 440,
  lvl1BaseAtk: 39,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 35.2,
    baseValue: 7.7,
  },
  passiveName: "Descension",
  passiveDesc:
    "Hitting opponents with Normal and Charged Attacks deals 200% ATK as DMG. If equipped by the Traveler, ATK is increased by 66.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "descension-flat-atk",
      label: "Traveler Flat ATK (Sword of Descension)",
      stat: "atk",
      refinementValues: [66, 66, 66, 66, 66],
      isTeamBuff: false,
      compute: ()=>66,
    }
  ],
  
};
