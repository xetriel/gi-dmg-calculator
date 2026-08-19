import type { WeaponConfig } from "../types";

export const favoniusSword: WeaponConfig = {
  id: "favonius-sword",
  name: "Favonius Sword",
  type: "Sword",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 61.3,
    baseValue: 13.3,
  },
  passiveName: "Windfall",
  passiveDesc:
    "CRIT hits have a 60~100% chance to generate 1 Elemental Orb, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
  isSupport: true,
  buffType: "team",
  buffs: [

  ],
  
};
