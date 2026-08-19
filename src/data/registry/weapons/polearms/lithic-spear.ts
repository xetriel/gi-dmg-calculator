import type { WeaponConfig } from "../types";

export const lithicSpear: WeaponConfig = {
  id: "lithic-spear",
  name: "Lithic Spear",
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
  passiveName: "Lithic Axiom: Unity",
  passiveDesc:
    "For every character in the party who hails from Liyue, the character equipping this weapon gains a 7~11% ATK increase and a 3~7% CRIT Rate increase. Max 4 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "lithic-spear-liyue-count",
      label: "Liyue Party Members (1-4)",
      control: "stacks",
      defaultValue: 1,
      max: 4,
      hint: "+7~11% ATK and +3~7% CRIT Rate per Liyue member",
    }
  ],
  buffs: [
    {
      id: "lithic-spear-atk",
      label: "ATK% from Liyue Members (Lithic Spear)",
      stat: "atk",
      refinementValues: [28, 32, 36, 40, 44],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "lithic-spear-liyue-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['lithic-spear-liyue-count'] ?? 1); const perStack = [7, 8, 9, 10, 11][r - 1]; return ((count * perStack) / 100) * ctx.baseAtk; },
    },
    {
      id: "lithic-spear-crit",
      label: "CRIT Rate% from Liyue Members (Lithic Spear)",
      stat: "critRate",
      refinementValues: [12, 16, 20, 24, 28],
      isTeamBuff: false,
      conditionKey: "lithic-spear-liyue-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['lithic-spear-liyue-count'] ?? 1); const perStack = [3, 4, 5, 6, 7][r - 1]; return count * perStack; },
    }
  ],
  
};
