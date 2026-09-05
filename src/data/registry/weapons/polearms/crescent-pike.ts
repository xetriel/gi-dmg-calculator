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
  buffs: [],
  damageInstances: [
    {
      id: "crescent-pike-proc",
      name: "Infusion Needle Extra DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [20, 25, 30, 35, 40],
      description: "Normal and Charged Attacks deal an additional 20~40% ATK as Physical DMG",
    },
  ],
};
