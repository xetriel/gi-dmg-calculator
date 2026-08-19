import type { WeaponConfig } from "../types";

export const dawningFrost: WeaponConfig = {
  id: "dawning-frost",
  name: "Dawning Frost",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 18.4,
    baseValue: 4,
  },
  passiveName: "Frost Dawn",
  passiveDesc:
    "Cryo DMG is increased by 12~24%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "dawning-frost-cryo",
      label: "Cryo DMG Bonus",
      stat: "cryoDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
