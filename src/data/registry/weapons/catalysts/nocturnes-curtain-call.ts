import type { WeaponConfig } from "../types";

export const nocturnesCurtainCall: WeaponConfig = {
  id: "nocturnes-curtain-call",
  name: "Nocturne's Curtain Call",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Curtain Call",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. Elemental Burst hits increase ATK by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "nocturne-burst-hit",
      label: "Elemental Burst Hit (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "nocturne-elem-dmg",
      label: "All Elemental DMG Bonus (Nocturne's Curtain Call)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "nocturne-atk",
      label: "ATK% (Nocturne's Curtain Call)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "nocturne-burst-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['nocturne-burst-hit'] ?? '1') === '1' || Number(ctx.inputs?.['nocturne-burst-hit'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
