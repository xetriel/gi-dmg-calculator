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
  mechanicDefs: [
    {
      id: "dragonspine-cryo",
      label: "Opponent Affected by Cryo (200~360% DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Deals 200~360% ATK DMG instead of 80~140% if target is affected by Cryo",
    },
  ],
  buffs: [],
  damageInstances: [
    {
      id: "dragonspine-icicle",
      name: "Everfrost Icicle DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [80, 95, 110, 125, 140],
      conditionKey: "dragonspine-cryo",
      conditionLabel: "Opponent Affected by Cryo",
      conditionMultipliers: [200, 240, 280, 320, 360],
      description: "Deals 80~140% ATK as AoE Physical DMG (200~360% if opponent is affected by Cryo)",
    },
  ],
};
