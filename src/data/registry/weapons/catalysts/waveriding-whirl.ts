import type { WeaponConfig } from "../types";

export const waveridingWhirl: WeaponConfig = {
  id: "waveriding-whirl",
  name: "Waveriding Whirl",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 61.3,
    baseValue: 13.3,
  },
  passiveName: "Wave Rider",
  passiveDesc:
    "Decreases swimming Stamina consumption by 15%. After using an Elemental Skill, Max HP is increased by 20~40% for 15s (2x during Nightsoul's Blessing = +40~80% Max HP).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "waveriding-skill-active",
      label: "Elemental Skill Used Active (+20~40% Max HP)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% Max HP for 15s",
    },
    {
      id: "waveriding-nightsoul",
      label: "In Nightsoul's Blessing (2x HP Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "Doubles Max HP bonus (up to +40~80%)",
    }
  ],
  buffs: [
    {
      id: "waveriding-hp",
      label: "Max HP% (Waveriding Whirl)",
      stat: "hp",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "waveriding-skill-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['waveriding-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['waveriding-skill-active'] ?? 1) > 0; if (!on) return 0; const nightsoul = (ctx.inputs?.['waveriding-nightsoul'] ?? '1') === '1' || Number(ctx.inputs?.['waveriding-nightsoul'] ?? 1) > 0; const mult = nightsoul ? 2 : 1; return [20, 25, 30, 35, 40][r - 1] * mult; },
    }
  ],
  
};
