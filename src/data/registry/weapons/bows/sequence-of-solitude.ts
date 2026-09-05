import type { WeaponConfig } from "../types";

export const sequenceOfSolitude: WeaponConfig = {
  id: "sequence-of-solitude",
  name: "Sequence of Solitude",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Silent Trigger",
  passiveDesc:
    "Deals 40~80% Max HP as AoE DMG at the target location once every 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [],
  damageInstances: [
    {
      id: "sequence-of-solitude-proc",
      name: "Silent Trigger AoE DMG",
      scaling: "hp",
      element: "Physical",
      refinementMultipliers: [40, 50, 60, 70, 80],
      description: "Deals 40~80% Max HP as AoE Physical DMG at target location",
    },
  ],
};
