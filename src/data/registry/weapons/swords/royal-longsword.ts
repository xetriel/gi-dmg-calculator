import type { WeaponConfig } from "../types";

export const royalLongsword: WeaponConfig = {
  id: "royal-longsword",
  name: "Royal Longsword",
  type: "Sword",
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
      id: "royal-stacks",
      label: "Royal Focus Stacks (0-5)",
      control: "stacks",
      defaultValue: 3,
      max: 5,
      hint: "+8~16% CRIT Rate per stack",
    }
  ],
  buffs: [
    {
      id: "royal-crit-rate",
      label: "CRIT Rate% (Royal Longsword)",
      stat: "critRate",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "royal-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["royal-stacks"]??3);return s*[8,10,12,14,16][r-1]},
    }
  ],
  
};
