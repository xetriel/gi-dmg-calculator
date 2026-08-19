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
    "After casting an Elemental Skill, gain 1 Succession Seed (max 3). After using an Elemental Burst, all Succession Seeds are consumed, restoring 6~12 Energy per seed after 2s.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
