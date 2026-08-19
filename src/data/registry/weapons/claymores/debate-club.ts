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
    "After using an Elemental Skill, Normal or Charged Attacks deal an additional 60~120% ATK DMG in a small area on hit. Effect lasts 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
