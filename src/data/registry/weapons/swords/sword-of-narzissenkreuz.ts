import type { WeaponConfig } from "../types";

export const swordOfNarzissenkreuz: WeaponConfig = {
  id: "sword-of-narzissenkreuz",
  name: "Sword of Narzissenkreuz",
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
  buffs: [],
  damageInstances: [
    {
      id: "sword-of-narzissenkreuz-blast",
      name: "Arkhe Energy Blast DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [160, 200, 240, 280, 320],
      description: "Deals 160~320% ATK as Physical DMG via Pneuma/Ousia energy blast",
    },
  ],
};
