import type { WeaponConfig } from "../types";

export const forestRegalia: WeaponConfig = {
  id: "forest-regalia",
  name: "Forest Regalia",
  type: "Claymore",
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
    "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness is created. Picking it up increases Elemental Mastery by 60~120 for 12s.",
  isSupport: true,
  buffType: "team",
  mechanicDefs: [
    {
      id: "regalia-leaf-picked",
      label: "Leaf of Consciousness Picked Up",
      control: "toggle",
      defaultValue: 1,
      hint: "+60~120 EM for 12s to picking party member",
    }
  ],
  buffs: [
    {
      id: "regalia-party-em",
      label: "Party EM (Forest Regalia Leaf of Consciousness)",
      description: "Picking up the Leaf of Consciousness grants +60~120 Elemental Mastery for 12s",
      stat: "em",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: true,
      conditionKey: "regalia-leaf-picked",
      compute: (r, ctx) => { const on = (ctx.inputs?.['regalia-leaf-picked'] ?? '1') === '1' || Number(ctx.inputs?.['regalia-leaf-picked'] ?? 1) > 0; return on ? [60, 75, 90, 105, 120][r - 1] : 0; },
    }
  ],
  
};
