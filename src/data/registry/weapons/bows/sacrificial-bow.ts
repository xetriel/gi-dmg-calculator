import type { WeaponConfig } from "../types";

export const sacrificialBow: WeaponConfig = {
  id: "sacrificial-bow",
  name: "Sacrificial Bow",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Composed",
  passiveDesc:
    "After dealing damage to an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
  isSupport: true,
  buffType: "self",
  buffs: [

  ],
  
};
