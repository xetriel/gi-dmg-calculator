import type { WeaponConfig } from "../types";

export const messenger: WeaponConfig = {
  id: "messenger",
  name: "Messenger",
  type: "Bow",
  rarity: 3,
  baseAtk: 448,
  lvl1BaseAtk: 40,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 31.2,
    baseValue: 6.8,
  },
  passiveName: "Flying Messenger",
  passiveDesc:
    "Charged Attack hits on weak spots deal an additional 100~200% ATK DMG as CRIT hit.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
