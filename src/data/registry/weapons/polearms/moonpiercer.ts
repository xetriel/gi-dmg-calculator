import type { WeaponConfig } from "../types";

export const moonpiercer: WeaponConfig = {
  id: "moonpiercer",
  name: "Moonpiercer",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 110,
    baseValue: 24,
  },
  passiveName: "Stillwood Moonshadow",
  passiveDesc:
    "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Revival will be created around the character for up to 10s. When picked up, the Leaf will grant the character 16~32% ATK for 12s.",
  isSupport: true,
  buffType: "team",
  buffs: [
    {
      id: "moonpiercer-leaf-atk",
      label: "Leaf of Revival ATK% (Moonpiercer)",
      description: "Active character picks up Leaf of Revival for +16~32% ATK",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: true,
      isPercent: true,
      compute: (r,ctx)=>{const pct=[16,20,24,28,32][r-1];return pct/100*ctx.baseAtk},
    }
  ],
  
};
