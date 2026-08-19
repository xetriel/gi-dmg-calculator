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
      id: "lithic-spear-liyue-members",
      label: "Liyue Characters in Party (0-4)",
      control: "stacks",
      defaultValue: 2,
      max: 4,
      hint: "+7~11% ATK & +3~7% CRIT Rate per Liyue character",
    }
  ],
  buffs: [
    {
      id: "lithic-spear-atk",
      label: "ATK% (Lithic Spear)",
      stat: "atk",
      refinementValues: [28, 32, 36, 40, 44],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "lithic-spear-liyue-members",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["lithic-spear-liyue-members"]??2);return s*[7,8,9,10,11][r-1]/100*ctx.baseAtk},
    },
    {
      id: "lithic-spear-crit",
      label: "CRIT Rate% (Lithic Spear)",
      stat: "critRate",
      refinementValues: [12, 16, 20, 24, 28],
      isTeamBuff: false,
      conditionKey: "lithic-spear-liyue-members",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["lithic-spear-liyue-members"]??2);return s*[3,4,5,6,7][r-1]},
    }
  ],
  
};
