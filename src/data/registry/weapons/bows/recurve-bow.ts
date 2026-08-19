import type { WeaponConfig } from "../types";

export const recurveBow: WeaponConfig = {
  id: "recurve-bow",
  name: "Recurve Bow",
  type: "Bow",
  rarity: 3,
  baseAtk: 354,
  lvl1BaseAtk: 38,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 46.9,
    baseValue: 10.2,
  },
  passiveName: "Cull the Weak",
  passiveDesc:
    "Defeating an opponent restores 8~16% HP.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
