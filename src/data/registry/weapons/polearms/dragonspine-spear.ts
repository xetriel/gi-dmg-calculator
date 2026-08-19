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
    "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of dropping an Everfrost Icicle dealing 80~140% AoE ATK DMG. Cryo affected opponents take 200~360% ATK DMG.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
