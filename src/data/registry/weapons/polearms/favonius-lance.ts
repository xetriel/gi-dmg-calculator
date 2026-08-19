import type { WeaponConfig } from "../types";

export const favoniusLance: WeaponConfig = {
  id: "favonius-lance",
  name: "Favonius Lance",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Windfall",
  passiveDesc:
    "CRIT hits have a 60~100% chance to generate 1 Elemental Orb, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
  isSupport: true,
  buffType: "team",
  buffs: [

  ],
  
};
