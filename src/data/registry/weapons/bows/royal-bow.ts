import type { WeaponConfig } from "../types";

export const royalBow: WeaponConfig = {
  id: "royal-bow",
  name: "Royal Bow",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Focus",
  passiveDesc:
    "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks (+40~80%). A CRIT hit removes all stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "royal-bow-stacks",
      label: "Focus Stacks (0-5)",
      control: "stacks",
      defaultValue: 5,
      max: 5,
      hint: "+8~16% CRIT Rate per stack (up to +40~80%)",
    }
  ],
  buffs: [
    {
      id: "royal-bow-crit",
      label: "CRIT Rate% (Royal Bow Focus)",
      stat: "critRate",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "royal-bow-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['royal-bow-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; },
    }
  ],
  
};
