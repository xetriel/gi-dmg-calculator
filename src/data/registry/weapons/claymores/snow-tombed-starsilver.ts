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
  mechanicDefs: [
    {
      id: "snow-tombed-cryo",
      label: "Opponent Affected by Cryo (200~360% DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Deals 200~360% ATK DMG instead of 80~140% if target is affected by Cryo",
    },
  ],
  buffs: [],
  damageInstances: [
    {
      id: "snow-tombed-icicle",
      name: "Everfrost Icicle DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [80, 95, 110, 125, 140],
      conditionKey: "snow-tombed-cryo",
      conditionLabel: "Opponent Affected by Cryo",
      conditionMultipliers: [200, 240, 280, 320, 360],
      description: "Deals 80~140% ATK as AoE Physical DMG (200~360% if opponent is affected by Cryo)",
    },
  ],
};
