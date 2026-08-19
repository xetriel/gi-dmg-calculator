import type { WeaponConfig } from "../types";

export const eyeOfPerception: WeaponConfig = {
  id: "eye-of-perception",
  name: "Eye of Perception",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Echo",
  passiveDesc:
    "Normal and Charged Attacks have a 50% chance to fire a Bolt of Perception, dealing 240~360% ATK as DMG.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
