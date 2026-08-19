import type { WeaponConfig } from "../types";

export const dragonspineSpear: WeaponConfig = {
  id: "dragonspine-spear",
  name: "Dragonspine Spear",
  type: "Polearm",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "physicalDmgBonus",
    label: "Physical DMG Bonus%",
    value: 69,
    baseValue: 15,
  },
  passiveName: "Frost Burial",
  passiveDesc:
    "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of forming and dropping an Everfrost Icicle above them, dealing 80~140% AoE ATK DMG. Opponents affected by Cryo are dealt 200~360% ATK DMG instead.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
