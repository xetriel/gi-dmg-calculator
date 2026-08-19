import type { WeaponConfig } from "../types";

export const missiveWindspear: WeaponConfig = {
  id: "missive-windspear",
  name: "Missive Windspear",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "The Wind Sings",
  passiveDesc:
    "Within 10s after triggering an Elemental Reaction, ATK is increased by 12~24% and Elemental Mastery is increased by 48~96.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "windspear-active",
      label: "Reaction Triggered",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% ATK and +48~96 EM for 10s",
    }
  ],
  buffs: [
    {
      id: "windspear-atk",
      label: "ATK% (Missive Windspear)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "windspear-active",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["windspear-active"]??"1")==="1"||Number(ctx.inputs?.["windspear-active"]??1)>0;return on?[12,15,18,21,24][r-1]/100*ctx.baseAtk:0},
    },
    {
      id: "windspear-em",
      label: "Elemental Mastery (Missive Windspear)",
      stat: "em",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "windspear-active",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["windspear-active"]??"1")==="1"||Number(ctx.inputs?.["windspear-active"]??1)>0;return on?[48,60,72,84,96][r-1]:0},
    }
  ],
  
};
