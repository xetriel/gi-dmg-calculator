import type { WeaponConfig } from "../types";

export const endOfTheLine: WeaponConfig = {
  id: "end-of-the-line",
  name: "End of the Line",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Net Snare",
  passiveDesc:
    "Using an Elemental Skill triggers Flowrider effect, dealing 80~160% ATK as AoE DMG on hit.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
