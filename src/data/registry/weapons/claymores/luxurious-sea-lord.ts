import type { WeaponConfig } from "../types";

export const luxuriousSeaLord: WeaponConfig = {
  id: "luxurious-sea-lord",
  name: "Luxurious Sea-Lord",
  type: "Claymore",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Oceanic Victory",
  passiveDesc:
    "Increases Elemental Burst DMG by 12~24%. When Elemental Burst hits opponents, summons a titanic tuna that deals 100~200% ATK as AoE DMG every 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "sea-lord-burst-dmg",
      label: "Elemental Burst DMG Bonus (Luxurious Sea-Lord)",
      stat: "burstDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
  ],
  damageInstances: [
    {
      id: "sea-lord-proc",
      name: "Titanic Tuna AoE DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [100, 125, 150, 175, 200],
      description: "Deals 100~200% ATK as AoE Physical DMG when Elemental Burst hits opponents",
    },
  ],
};
