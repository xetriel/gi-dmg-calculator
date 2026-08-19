import type { WeaponConfig } from "../types";

export const swordOfNarzissenkreuzPneuma: WeaponConfig = {
  id: "sword-of-narzissenkreuz-pneuma",
  name: "Sword of Narzissenkreuz Pneuma",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Hero's Blade: Pneuma",
  passiveDesc:
    "When the equipping character does not have an Arkhe: When Normal, Charged, or Plunging Attacks hit, a Pneuma or Ousia energy blast will be unleashed, dealing 160~320% of ATK as DMG.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
