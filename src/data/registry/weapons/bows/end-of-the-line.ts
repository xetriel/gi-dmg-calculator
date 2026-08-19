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
  passiveName: "Net Snapper",
  passiveDesc:
    "Triggers Flowrider effect after using an Elemental Skill, dealing 80~160% ATK as AoE DMG on hit for 15s or 3 instances.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
