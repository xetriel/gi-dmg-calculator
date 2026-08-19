import type { WeaponConfig } from "../types";

export const fleuveCendreFerryman: WeaponConfig = {
  id: "fleuve-cendre-ferryman",
  name: "Fleuve Cendre Ferryman",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Ironbone",
  passiveDesc:
    "Increases Elemental Skill CRIT Rate by 8~16%. Additionally, increases Energy Recharge by 16~32% for 5s after using an Elemental Skill.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "fleuve-er-active",
      label: "Post-Skill ER Buff Active",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% Energy Recharge for 5s",
    }
  ],
  buffs: [
    {
      id: "fleuve-skill-crit",
      label: "Elemental Skill CRIT Rate% (Fleuve Cendre)",
      stat: "critRate",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      compute: r=>[8,10,12,14,16][r-1],
    },
    {
      id: "fleuve-er-buff",
      label: "Energy Recharge% (Fleuve Cendre)",
      stat: "energyRecharge",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "fleuve-er-active",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["fleuve-er-active"]??"1")==="1"||Number(ctx.inputs?.["fleuve-er-active"]??1)>0;return on?[16,20,24,28,32][r-1]:0},
    }
  ],
  
};
