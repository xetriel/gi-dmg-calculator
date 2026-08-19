import type { WeaponConfig } from "../types";

export const sapwoodBlade: WeaponConfig = {
  id: "sapwood-blade",
  name: "Sapwood Blade",
  type: "Sword",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Forest Sanctuary",
  passiveDesc:
    "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for up to 10s. When picked up, the Leaf will grant the character 60~120 Elemental Mastery for 12s.",
  isSupport: true,
  buffType: "team",
  buffs: [
    {
      id: "sapwood-leaf-em",
      label: "Leaf of Consciousness EM (Sapwood Blade)",
      description: "Active character picks up Leaf of Consciousness for +60~120 EM",
      stat: "em",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: true,
      compute: r=>[60,75,90,105,120][r-1],
    }
  ],
  
};
