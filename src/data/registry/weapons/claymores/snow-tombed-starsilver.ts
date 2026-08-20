import type { WeaponConfig } from "../types";

export const snowTombedStarsilver: WeaponConfig = {
  id: "snow-tombed-starsilver",
  name: "Snow-Tombed Starsilver",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "physicalDmgBonus",
    label: "Physical DMG Bonus%",
    value: 34.5,
    baseValue: 7.5,
  },
  passiveName: "Frost Burial",
  passiveDesc:
    "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of forming and dropping an Everfrost Icicle above them, dealing 80~140% AoE ATK DMG. Opponents affected by Cryo are dealt 200~360% ATK DMG instead.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
