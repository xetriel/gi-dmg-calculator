import type { WeaponConfig } from "../types";

export const theViridescentHunt: WeaponConfig = {
  id: "the-viridescent-hunt",
  name: "The Viridescent Hunt",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Verdant Wind",
  passiveDesc:
    "Normal and Aimed Shot hits have a 50% chance to generate a Cyclone, dealing 40~80% ATK as DMG and pulling enemies.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
