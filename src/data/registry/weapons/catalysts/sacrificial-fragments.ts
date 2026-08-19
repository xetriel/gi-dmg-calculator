import type { WeaponConfig } from "../types";

export const sacrificialFragments: WeaponConfig = {
  id: "sacrificial-fragments",
  name: "Sacrificial Fragments",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 221,
    baseValue: 48,
  },
  passiveName: "Composed",
  passiveDesc:
    "After damaging an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
  isSupport: true,
  buffType: "self",
  buffs: [

  ],
  
};
