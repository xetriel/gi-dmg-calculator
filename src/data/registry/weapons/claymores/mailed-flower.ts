import type { WeaponConfig } from "../types";

export const mailedFlower: WeaponConfig = {
  id: "mailed-flower",
  name: "Mailed Flower",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 110,
    baseValue: 24,
  },
  passiveName: "Whispers of Wind and Flower",
  passiveDesc:
    "Within 8s after an Elemental Skill hits an opponent or triggers an Elemental Reaction, ATK is increased by 12~24% and Elemental Mastery is increased by 48~96.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mailed-flower-active",
      label: "Skill Hit / Reaction Triggered",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% ATK and +48~96 EM for 8s",
    }
  ],
  buffs: [
    {
      id: "mailed-flower-atk",
      label: "ATK% (Mailed Flower)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "mailed-flower-active",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["mailed-flower-active"]??"1")==="1"||Number(ctx.inputs?.["mailed-flower-active"]??1)>0;return on?[12,15,18,21,24][r-1]/100*ctx.baseAtk:0},
    },
    {
      id: "mailed-flower-em",
      label: "Elemental Mastery (Mailed Flower)",
      stat: "em",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "mailed-flower-active",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["mailed-flower-active"]??"1")==="1"||Number(ctx.inputs?.["mailed-flower-active"]??1)>0;return on?[48,60,72,84,96][r-1]:0},
    }
  ],
  
};
