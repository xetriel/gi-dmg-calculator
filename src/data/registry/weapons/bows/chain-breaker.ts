import type { WeaponConfig } from "../types";

export const chainBreaker: WeaponConfig = {
  id: "chain-breaker",
  name: "Chain Breaker",
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
  passiveName: "Flower-Feather Song",
  passiveDesc:
    "For every party member from Natlan or with a different Elemental Type than the wielder, gains +4.8~9.6% ATK (max 3 stacks = +14.4~28.8% ATK). If >= 3 stacks, gains +24~48 Elemental Mastery.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "chain-breaker-stacks",
      label: "Natlan/Different Element Teammates (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+4.8~9.6% ATK per stack. At 3 stacks, +24~48 EM.",
    }
  ],
  buffs: [
    {
      id: "chain-breaker-atk",
      label: "ATK% (Chain Breaker)",
      stat: "atk",
      refinementValues: [14.4, 18, 21.6, 25.2, 28.8],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "chain-breaker-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['chain-breaker-stacks'] ?? 3); const perStack = [4.8, 6.0, 7.2, 8.4, 9.6][r - 1]; return ((s * perStack) / 100) * ctx.baseAtk; },
    },
    {
      id: "chain-breaker-em",
      label: "Elemental Mastery at 3 Stacks (Chain Breaker)",
      stat: "em",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "chain-breaker-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['chain-breaker-stacks'] ?? 3); return s >= 3 ? [24, 30, 36, 42, 48][r - 1] : 0; },
    }
  ],
  
};
