import type { WeaponConfig } from "../types";

export const travelersHandySword: WeaponConfig = {
  id: "travelers-handy-sword",
  name: "Traveler's Handy Sword",
  type: "Sword",
  rarity: 3,
  baseAtk: 448,
  lvl1BaseAtk: 40,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 29.3,
    baseValue: 6.4,
  },
  passiveName: "Journey",
  passiveDesc:
    "Each Elemental Orb or Particle collected restores 1~2% HP.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
