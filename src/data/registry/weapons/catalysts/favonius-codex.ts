import type { WeaponConfig } from "../types";

export const favoniusCodex: WeaponConfig = {
  id: "favonius-codex",
  name: "Favonius Codex",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Windfall",
  passiveDesc:
    "CRIT hits have a 60~100% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
  isSupport: true,
  buffType: "team",
  buffs: [

  ],
  
};
