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
    "Hitting opponents with Normal and Charged Attacks grants a 50% chance to deal 200% ATK as DMG. In addition, if the Traveler equips the Sword of Descension, their ATK is increased by 66.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "descension-traveler-atk",
      label: "Flat ATK for Traveler (Sword of Descension)",
      stat: "atk",
      refinementValues: [66, 66, 66, 66, 66],
      isTeamBuff: false,
      compute: (r) => 66,
    }
  ],
  
};
