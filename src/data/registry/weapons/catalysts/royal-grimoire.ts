import type { WeaponConfig } from "../types";

export const royalGrimoire: WeaponConfig = {
  id: "royal-grimoire",
  name: "Royal Grimoire",
  type: "Catalyst",
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
      id: "royal-grimoire-stacks",
      label: "Focus Stacks (0-5)",
      control: "stacks",
      defaultValue: 3,
      max: 5,
      hint: "+8~16% CRIT Rate per stack",
    }
  ],
  buffs: [
    {
      id: "royal-grimoire-crit",
      label: "CRIT Rate% (Royal Grimoire)",
      stat: "critRate",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "royal-grimoire-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["royal-grimoire-stacks"]??3);return s*[8,10,12,14,16][r-1]},
    }
  ],
  
};
