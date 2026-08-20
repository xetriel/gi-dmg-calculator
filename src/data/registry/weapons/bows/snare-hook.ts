import type { WeaponConfig } from "../types";

export const snareHook: WeaponConfig = {
  id: "snare-hook",
  name: "Snare Hook",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Phantom Flash",
  passiveDesc:
    "Upon triggering an Elemental Reaction, Elemental Mastery increases by 60~120 for 12s. If Moonsign is active, increases EM by an additional 60~120 (up to +120~240 EM).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "snare-reaction-active",
      label: "Elemental Reaction Triggered (+60~120 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "+60~120 EM for 12s",
    },
    {
      id: "snare-moonsign-active",
      label: "Moonsign Active (2x EM Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "Doubles EM bonus (up to +120~240 EM)",
    }
  ],
  buffs: [
    {
      id: "snare-em",
      label: "Elemental Mastery (Snare Hook)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "snare-reaction-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['snare-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['snare-reaction-active'] ?? 1) > 0; if (!on) return 0; const moon = (ctx.inputs?.['snare-moonsign-active'] ?? '1') === '1' || Number(ctx.inputs?.['snare-moonsign-active'] ?? 1) > 0; const mult = moon ? 2 : 1; return [60, 75, 90, 105, 120][r - 1] * mult; },
    }
  ],
  
};
