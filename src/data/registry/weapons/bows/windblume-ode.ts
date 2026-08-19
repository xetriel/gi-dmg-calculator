import type { WeaponConfig } from "../types";

export const windblumeOde: WeaponConfig = {
  id: "windblume-ode",
  name: "Windblume Ode",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Windblume Wish",
  passiveDesc:
    "After using an Elemental Skill, receive a boon from the ancient wish of the Windblume, increasing ATK by 16~32% for 6s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "windblume-skill-active",
      label: "Post-Skill ATK Buff Active",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% ATK for 6s",
    }
  ],
  buffs: [
    {
      id: "windblume-atk",
      label: "ATK% (Windblume Ode)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "windblume-skill-active",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["windblume-skill-active"]??"1")==="1"||Number(ctx.inputs?.["windblume-skill-active"]??1)>0;return on?[16,20,24,28,32][r-1]/100*ctx.baseAtk:0},
    }
  ],
  
};
