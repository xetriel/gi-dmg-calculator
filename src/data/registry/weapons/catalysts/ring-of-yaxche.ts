import type { WeaponConfig } from "../types";

export const ringOfYaxche: WeaponConfig = {
  id: "ring-of-yaxche",
  name: "Ring of Yaxche",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Echoing Song",
  passiveDesc:
    "Using an Elemental Skill grants Jade-Forged Crown: every 1,000 Max HP increases Normal Attack DMG by 0.6~1.0% for 10s (up to max +16~32% NA DMG).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "yaxche-wielder-hp",
      label: "Character Total Max HP (e.g. 35000)",
      control: "stacks",
      defaultValue: 35000,
      max: 80000,
      hint: "Max HP used for Normal Attack DMG bonus",
    },
    {
      id: "yaxche-skill-active",
      label: "Elemental Skill Used Active",
      control: "toggle",
      defaultValue: 1,
      hint: "Grants NA DMG bonus based on Max HP",
    }
  ],
  buffs: [
    {
      id: "yaxche-na-dmg",
      label: "Normal Attack DMG Bonus (Ring of Yaxche)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "yaxche-skill-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['yaxche-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['yaxche-skill-active'] ?? 1) > 0; if (!on) return 0; const hp = Number(ctx.inputs?.['yaxche-wielder-hp'] ?? 35000); const ratio = [0.6, 0.7, 0.8, 0.9, 1.0][r - 1]; const cap = [16, 20, 24, 28, 32][r - 1]; return Math.min((hp / 1000) * ratio, cap); },
    }
  ],
  
};
