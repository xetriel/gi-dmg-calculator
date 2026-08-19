import type { WeaponConfig } from "../types";

export const footprintOfTheRainbow: WeaponConfig = {
  id: "footprint-of-the-rainbow",
  name: "Footprint of the Rainbow",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 51.7,
    baseValue: 11.3,
  },
  passiveName: "Climbing the Flowing Waves",
  passiveDesc:
    "Using an Elemental Skill increases DEF by 16~32% for 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "footprint-def",
      label: "DEF% (Footprint of the Rainbow)",
      stat: "def",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: r=>[16,20,24,28,32][r-1],
    }
  ],
  
};
