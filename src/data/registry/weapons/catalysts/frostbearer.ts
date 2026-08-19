import type { WeaponConfig } from "../types";

export const frostbearer: WeaponConfig = {
  id: "frostbearer",
  name: "Frostbearer",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Frost Burial",
  passiveDesc:
    "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of forming and dropping an Everfrost Icicle dealing 80~140% AoE ATK DMG. Opponents affected by Cryo take 200~360% ATK DMG.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
