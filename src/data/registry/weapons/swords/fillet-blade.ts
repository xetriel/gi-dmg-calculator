import type { WeaponConfig } from "../types";

export const filletBlade: WeaponConfig = {
  id: "fillet-blade",
  name: "Fillet Blade",
  type: "Sword",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 35.2,
    baseValue: 7.7,
  },
  passiveName: "Gash",
  passiveDesc:
    "On hit, has a 50% chance to deal 240~400% ATK DMG to a single opponent. Can only occur once every 15~11s.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
