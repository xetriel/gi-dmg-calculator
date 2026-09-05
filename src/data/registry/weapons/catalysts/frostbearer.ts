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
    "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of dropping an Everfrost Icicle above them, dealing 80~140% AoE ATK DMG (200~360% on Cryo affected).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "frostbearer-cryo",
      label: "Opponent Affected by Cryo (200~360% DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Deals 200~360% ATK DMG instead of 80~140% if target is affected by Cryo",
    },
  ],
  buffs: [],
  damageInstances: [
    {
      id: "frostbearer-icicle",
      name: "Everfrost Icicle DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [80, 95, 110, 125, 140],
      conditionKey: "frostbearer-cryo",
      conditionLabel: "Opponent Affected by Cryo",
      conditionMultipliers: [200, 240, 280, 320, 360],
      description: "Deals 80~140% ATK as AoE Physical DMG (200~360% if opponent is affected by Cryo)",
    },
  ],
};
