import type { WeaponConfig } from "../types";

export const prototypeCrescent: WeaponConfig = {
  id: "prototype-crescent",
  name: "Prototype Crescent",
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
  passiveName: "Unreturning",
  passiveDesc:
    "Charged Attack hits on weak points increase Movement SPD by 10% and ATK by 36~72% for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "crescent-weakpoint-hit",
      label: "Weak Point Hit Triggered",
      control: "toggle",
      defaultValue: 1,
      hint: "+36~72% ATK for 10s",
    }
  ],
  buffs: [
    {
      id: "crescent-atk",
      label: "ATK% (Prototype Crescent)",
      stat: "atk",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "crescent-weakpoint-hit",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["crescent-weakpoint-hit"]??"1")==="1"||Number(ctx.inputs?.["crescent-weakpoint-hit"]??1)>0;return on?[36,45,54,63,72][r-1]/100*ctx.baseAtk:0},
    }
  ],
  
};
