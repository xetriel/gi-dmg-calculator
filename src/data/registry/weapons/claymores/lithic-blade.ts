import type { WeaponConfig } from "../types";

export const lithicBlade: WeaponConfig = {
  id: "lithic-blade",
  name: "Lithic Blade",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Lithic Axiom: Unity",
  passiveDesc:
    "For every character in the party who hails from Liyue, the character equipping this weapon gains 7~11% ATK increase and 3~7% CRIT Rate increase. Max 4 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "lithic-liyue-members",
      label: "Liyue Characters in Party (0-4)",
      control: "stacks",
      defaultValue: 2,
      max: 4,
      hint: "+7~11% ATK & +3~7% CRIT Rate per Liyue character",
    }
  ],
  buffs: [
    {
      id: "lithic-atk",
      label: "ATK% (Lithic Blade)",
      stat: "atk",
      refinementValues: [28, 32, 36, 40, 44],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "lithic-liyue-members",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["lithic-liyue-members"]??2);return s*[7,8,9,10,11][r-1]/100*ctx.baseAtk},
    },
    {
      id: "lithic-crit-rate",
      label: "CRIT Rate% (Lithic Blade)",
      stat: "critRate",
      refinementValues: [12, 16, 20, 24, 28],
      isTeamBuff: false,
      conditionKey: "lithic-liyue-members",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["lithic-liyue-members"]??2);return s*[3,4,5,6,7][r-1]},
    }
  ],
  
};
