import type { WeaponConfig } from "../types";

export const ashGravenDrinkingHorn: WeaponConfig = {
  id: "ash-graven-drinking-horn",
  name: "Ash-Graven Drinking Horn",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Roaring Fire",
  passiveDesc:
    "When hitting an opponent, deal AoE DMG equal to 40~80% of Max HP. Can only occur once every 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
