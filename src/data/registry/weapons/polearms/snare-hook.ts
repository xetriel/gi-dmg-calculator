import type { WeaponConfig } from "../types";

export const snareHook: WeaponConfig = {
  id: "snare-hook",
  name: "Snare Hook",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Snaring Strike",
  passiveDesc:
    "Charged Attack DMG is increased by 20~40%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "snare-hook-ca-dmg",
      label: "Charged Attack DMG Bonus",
      stat: "chargedDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
