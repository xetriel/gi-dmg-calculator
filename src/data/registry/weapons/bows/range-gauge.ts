import type { WeaponConfig } from "../types";

export const rangeGauge: WeaponConfig = {
  id: "range-gauge",
  name: "Range Gauge",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Masons' Ditty",
  passiveDesc:
    "When healed or healing, gain a Stoic's Symbol for 30s (max 3). Using Skill or Burst consumes symbols to grant 16~32% ATK and 12~24% All Elemental DMG Bonus for 15s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "range-symbols-consumed",
      label: "Stoic Symbols Consumed (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+16~32% ATK and +12~24% All Elem DMG for 15s",
    }
  ],
  buffs: [
    {
      id: "range-gauge-atk",
      label: "ATK% (Range Gauge)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "range-symbols-consumed",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['range-symbols-consumed'] ?? 3); return s > 0 ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "range-gauge-elem-dmg",
      label: "All Elemental DMG Bonus (Range Gauge)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "range-symbols-consumed",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['range-symbols-consumed'] ?? 3); return s > 0 ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  
};
