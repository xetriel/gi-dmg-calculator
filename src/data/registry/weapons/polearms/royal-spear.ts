import type { WeaponConfig } from "../types";

export const royalSpear: WeaponConfig = {
  id: "royal-spear",
  name: "Royal Spear",
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
  passiveName: "Focus",
  passiveDesc:
    "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks (up to +40~80%). A CRIT hit removes all stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "royal-spear-focus-stacks",
      label: "Focus Stacks (0-5)",
      control: "stacks",
      defaultValue: 5,
      max: 5,
      hint: "+8~16% CRIT Rate per stack (up to +40~80%)",
    }
  ],
  buffs: [
    {
      id: "royal-spear-crit",
      label: "CRIT Rate% (Royal Spear Focus)",
      stat: "critRate",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "royal-spear-focus-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['royal-spear-focus-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; },
    }
  ],
  
};
