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
    "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Revival will be generated on the ground for 10s. The character who picks it up will have their ATK increased by 16~32% for 12s.",
  isSupport: true,
  buffType: "team",
  mechanicDefs: [
    {
      id: "moonpiercer-leaf-picked",
      label: "Leaf of Revival Picked Up (+16~32% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +16~32% ATK for 12s to picking party member",
    }
  ],
  buffs: [
    {
      id: "moonpiercer-party-atk",
      label: "Party ATK% (Moonpiercer Leaf of Revival)",
      description: "Picking up Leaf of Revival grants +16~32% ATK for 12s",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "moonpiercer-leaf-picked",
      compute: (r, ctx) => { const on = (ctx.inputs?.['moonpiercer-leaf-picked'] ?? '1') === '1' || Number(ctx.inputs?.['moonpiercer-leaf-picked'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
