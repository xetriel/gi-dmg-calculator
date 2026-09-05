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
    "On hit, has 50% chance to deal 240~400% ATK DMG to a single opponent. Can only occur once every 15~11s.",
  isSupport: false,
  buffType: "self",
  buffs: [],
  damageInstances: [
    {
      id: "fillet-blade-proc",
      name: "Gash DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [240, 280, 320, 360, 400],
      description: "Deals 240~400% ATK as Physical DMG to a single opponent",
    },
  ],
};
