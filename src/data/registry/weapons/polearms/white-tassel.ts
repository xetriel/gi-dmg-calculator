import type { WeaponConfig } from "../types";

export const whiteTassel: WeaponConfig = {
  id: "white-tassel",
  name: "White Tassel",
  type: "Polearm",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 23.4,
    baseValue: 5.1,
  },
  passiveName: "Sharp",
  passiveDesc:
    "Normal Attack DMG is increased by 24~48%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "white-tassel-na",
      label: "Normal Attack DMG Bonus (White Tassel)",
      stat: "normalDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      compute: (r) => [24, 30, 36, 42, 48][r - 1],
    }
  ],
  
};
