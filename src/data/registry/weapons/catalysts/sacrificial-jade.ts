import type { WeaponConfig } from "../types";

export const sacrificialJade: WeaponConfig = {
  id: "sacrificial-jade",
  name: "Sacrificial Jade",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 36.8,
    baseValue: 8,
  },
  passiveName: "Jade Precept",
  passiveDesc:
    "When not on the field for more than 5s, Max HP will be increased by 32~64% and Elemental Mastery will be increased by 40~80. These effects will be canceled after the wielder has been on the field for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "sac-jade-active",
      label: "Jade Precept Active (Off-field >5s)",
      control: "toggle",
      defaultValue: 1,
      hint: "+32~64% Max HP and +40~80 EM",
    }
  ],
  buffs: [
    {
      id: "sac-jade-hp",
      label: "Max HP% (Sacrificial Jade)",
      stat: "hp",
      refinementValues: [32, 40, 48, 56, 64],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "sac-jade-active",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["sac-jade-active"]??"1")==="1"||Number(ctx.inputs?.["sac-jade-active"]??1)>0;return on?[32,40,48,56,64][r-1]:0},
    },
    {
      id: "sac-jade-em",
      label: "Elemental Mastery (Sacrificial Jade)",
      stat: "em",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "sac-jade-active",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["sac-jade-active"]??"1")==="1"||Number(ctx.inputs?.["sac-jade-active"]??1)>0;return on?[40,50,60,70,80][r-1]:0},
    }
  ],
  
};
