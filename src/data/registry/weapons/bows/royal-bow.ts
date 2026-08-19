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
    "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks. A CRIT hit removes all stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "royal-bow-stacks",
      label: "Focus Stacks (0-5)",
      control: "stacks",
      defaultValue: 3,
      max: 5,
      hint: "+8~16% CRIT Rate per stack",
    }
  ],
  buffs: [
    {
      id: "royal-bow-crit",
      label: "CRIT Rate% (Royal Bow)",
      stat: "critRate",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "royal-bow-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["royal-bow-stacks"]??3);return s*[8,10,12,14,16][r-1]},
    }
  ],
  
};
