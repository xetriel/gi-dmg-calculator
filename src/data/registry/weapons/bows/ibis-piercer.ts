import type { WeaponConfig } from "../types";

export const ibisPiercer: WeaponConfig = {
  id: "ibis-piercer",
  name: "Ibis Piercer",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Secret Wisdom's Favor",
  passiveDesc:
    "The character's Elemental Mastery will be increased by 40~80 within 6s after Charged Attacks hit opponents. Max 2 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "ibis-stacks",
      label: "Charged Hit Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+40~80 EM per stack (up to +80~160 EM)",
    }
  ],
  buffs: [
    {
      id: "ibis-em",
      label: "Elemental Mastery (Ibis Piercer)",
      stat: "em",
      refinementValues: [80, 100, 120, 140, 160],
      isTeamBuff: false,
      conditionKey: "ibis-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["ibis-stacks"]??2);return s*[40,50,60,70,80][r-1]},
    }
  ],
  
};
