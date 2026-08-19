import type { WeaponConfig } from "../types";

export const amenomaKageuchi: WeaponConfig = {
  id: "amenoma-kageuchi",
  name: "Amenoma Kageuchi",
  type: "Sword",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Iwakura Succession",
  passiveDesc:
    "After casting an Elemental Skill, gain 1 Succession Seed. Max 3 seeds. Using an Elemental Burst consumes all seeds and regenerates 6~12 Energy per seed.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
