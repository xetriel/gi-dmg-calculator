import type { WeaponConfig } from "../types";

export const emeraldOrb: WeaponConfig = {
  id: "emerald-orb",
  name: "Emerald Orb",
  type: "Catalyst",
  rarity: 3,
  baseAtk: 448,
  lvl1BaseAtk: 40,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 94,
    baseValue: 20,
  },
  passiveName: "Rapids",
  passiveDesc:
    "Upon triggering a Vaporize, Electro-Charged, Frozen, Bloom, or a Hydro-infused Swirl reaction, ATK is increased by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "emerald-reaction-active",
      label: "Hydro Reaction Triggered (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "emerald-atk",
      label: "ATK% (Emerald Orb)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "emerald-reaction-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['emerald-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['emerald-reaction-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
