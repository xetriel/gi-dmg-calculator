import type { WeaponConfig } from "../types";

export const prototypeArchaic: WeaponConfig = {
  id: "prototype-archaic",
  name: "Prototype Archaic",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Crush",
  passiveDesc:
    "On hit, Normal or Charged Attacks have a 50% chance to deal an additional 240~480% ATK DMG to opponents in a small AoE. Can only occur once every 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [],
  damageInstances: [
    {
      id: "prototype-archaic-proc",
      name: "Crush AoE DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [240, 300, 360, 420, 480],
      description: "Deals 240~480% ATK as AoE Physical DMG on Normal or Charged Attack hit",
    },
  ],
};
