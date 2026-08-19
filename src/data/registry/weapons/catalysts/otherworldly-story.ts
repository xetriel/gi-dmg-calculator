import type { WeaponConfig } from "../types";

export const otherworldlyStory: WeaponConfig = {
  id: "otherworldly-story",
  name: "Otherworldly Story",
  type: "Catalyst",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 39,
    baseValue: 8.5,
  },
  passiveName: "Energy Shower",
  passiveDesc:
    "Each Elemental Orb or Particle collected restores 1~2% HP.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
