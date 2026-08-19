import type { WeaponConfig } from "../types";

export const royalGreatsword: WeaponConfig = {
  id: "royal-greatsword",
  name: "Royal Greatsword",
  type: "Claymore",
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
    "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks. A CRIT hit removes all stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "royal-focus-stacks",
      label: "Focus Stacks (0-5)",
      control: "stacks",
      defaultValue: 5,
      max: 5,
      hint: "+8~16% CRIT Rate per stack (up to +40~80%)",
    }
  ],
  buffs: [
    {
      id: "royal-focus-crit",
      label: "CRIT Rate% (Royal Greatsword Focus)",
      stat: "critRate",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "royal-focus-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['royal-focus-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; },
    }
  ],
  
};
