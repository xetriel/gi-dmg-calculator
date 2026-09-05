import type { WeaponConfig } from "../types";

export const debateClub: WeaponConfig = {
  id: "debate-club",
  name: "Debate Club",
  type: "Claymore",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 35.2,
    baseValue: 7.7,
  },
  passiveName: "Blunt Conclusion",
  passiveDesc:
    "After using an Elemental Skill, Normal or Charged Attacks deal an additional 60~120% ATK DMG in a small AoE on hit for 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [],
  damageInstances: [
    {
      id: "debate-club-proc",
      name: "Blunt Conclusion DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [60, 75, 90, 105, 120],
      description: "Normal or Charged Attacks deal an additional 60~120% ATK as AoE Physical DMG on hit for 15s after an Elemental Skill",
    },
  ],
};
