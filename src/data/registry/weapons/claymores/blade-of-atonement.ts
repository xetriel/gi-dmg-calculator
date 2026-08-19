import type { WeaponConfig } from "../types";

export const bladeOfAtonement: WeaponConfig = {
  id: "blade-of-atonement",
  name: "Blade of Atonement",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Atonement",
  passiveDesc:
    "Normal Attack DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "atonement-na-dmg",
      label: "Normal Attack DMG Bonus (Blade of Atonement)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
