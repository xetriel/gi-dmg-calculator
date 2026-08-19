import type { WeaponConfig } from "../types";

export const theFlute: WeaponConfig = {
  id: "the-flute",
  name: "The Flute",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Chord",
  passiveDesc:
    "Normal or Charged Attacks grant a Harmonic on hit. Gaining 5 Harmonics triggers the power of music and deals 100~200% ATK DMG to surrounding opponents.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
