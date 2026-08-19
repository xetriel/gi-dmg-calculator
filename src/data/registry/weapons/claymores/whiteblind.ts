import type { WeaponConfig } from "../types";

export const whiteblind: WeaponConfig = {
  id: "whiteblind",
  name: "Whiteblind",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 51.7,
    baseValue: 11.3,
  },
  passiveName: "Infusion Blade",
  passiveDesc:
    "On hit, Normal or Charged Attacks increase ATK and DEF by 6~12% for 6s. Max 4 stacks (up to +24~48%). Can only occur once every 0.5s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "whiteblind-stacks",
      label: "Infusion Blade Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "+6~12% ATK & DEF per stack (up to +24~48%)",
    }
  ],
  buffs: [
    {
      id: "whiteblind-atk",
      label: "ATK% (Whiteblind Stacks)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "whiteblind-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['whiteblind-stacks'] ?? 4); return ((s * [6, 7.5, 9, 10.5, 12][r - 1]) / 100) * ctx.baseAtk; },
    },
    {
      id: "whiteblind-def",
      label: "DEF% (Whiteblind Stacks)",
      stat: "def",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "whiteblind-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['whiteblind-stacks'] ?? 4); return s * [6, 7.5, 9, 10.5, 12][r - 1]; },
    }
  ],
  
};
