import type { WeaponConfig } from "../types";

export const prospectorsDrill: WeaponConfig = {
  id: "prospectors-drill",
  name: "Prospector's Drill",
  type: "Polearm",
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
    "When healed or healing, gain a Stoic's Symbol for 30s (max 3). Using Skill or Burst consumes symbols to grant 8~16% ATK and 4~8% All Elemental DMG Bonus per symbol for 15s (up to +24~48% ATK, +12~24% Elem DMG).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "drill-symbols",
      label: "Stoic Symbols Consumed (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+8~16% ATK and +4~8% All Elem DMG per symbol",
    }
  ],
  buffs: [
    {
      id: "drill-atk",
      label: "ATK% (Prospector's Drill)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "drill-symbols",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['drill-symbols'] ?? 3); return ((s * [8, 10, 12, 14, 16][r - 1]) / 100) * ctx.baseAtk; },
    },
    {
      id: "drill-elem-dmg",
      label: "All Elemental DMG Bonus (Prospector's Drill)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "drill-symbols",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['drill-symbols'] ?? 3); return s * [4, 5, 6, 7, 8][r - 1]; },
    }
  ],
  
};
