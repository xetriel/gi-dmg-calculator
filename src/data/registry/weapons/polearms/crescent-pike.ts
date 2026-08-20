import type { WeaponConfig } from "../types";

export const crescentPike: WeaponConfig = {
  id: "crescent-pike",
  name: "Crescent Pike",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "physicalDmgBonus",
    label: "Physical DMG Bonus%",
    value: 34.5,
    baseValue: 7.5,
  },
  passiveName: "Infusion Needle",
  passiveDesc:
    "After picking up an Elemental Orb/Particle, Normal and Charged Attacks deal an additional 20~40% ATK as DMG for 5s.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
