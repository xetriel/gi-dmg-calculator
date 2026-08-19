import type { WeaponConfig } from "../types";

export const sacrificialSword: WeaponConfig = {
  id: "sacrificial-sword",
  name: "Sacrificial Sword",
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
  passiveName: "Composed",
  passiveDesc:
    "After dealing damage to an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
  isSupport: true,
  buffType: "self",
  buffs: [

  ],
  
};
