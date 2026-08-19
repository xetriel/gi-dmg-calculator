import type { WeaponConfig } from "../types";

export const snareHook: WeaponConfig = {
  id: "snare-hook",
  name: "Snare Hook",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Snaring Point",
  passiveDesc:
    "Normal Attack DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "snare-hook-na",
      label: "Normal Attack DMG Bonus (Snare Hook)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
