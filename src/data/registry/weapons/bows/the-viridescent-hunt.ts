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
    "Upon hit, Normal and Aimed Shot Attacks have a 50% chance to generate a Cyclone that attracts enemies and deals 40~80% ATK as DMG every 0.5s for 4s.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
