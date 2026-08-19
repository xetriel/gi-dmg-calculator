import type { WeaponConfig } from "../types";

export const harbingerOfDawn: WeaponConfig = {
  id: "harbinger-of-dawn",
  name: "Harbinger of Dawn",
  type: "Sword",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 46.9,
    baseValue: 10.2,
  },
  passiveName: "Vigorous",
  passiveDesc:
    "When HP is above 90%, increases CRIT Rate by 14~28%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "harbinger-hp-90",
      label: "HP > 90% (Vigorous Active)",
      control: "toggle",
      defaultValue: 1,
      hint: "+14~28% CRIT Rate when HP > 90%",
    }
  ],
  buffs: [
    {
      id: "harbinger-crit-rate",
      label: "CRIT Rate% (Harbinger of Dawn)",
      stat: "critRate",
      refinementValues: [14, 17.5, 21, 24.5, 28],
      isTeamBuff: false,
      conditionKey: "harbinger-hp-90",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["harbinger-hp-90"]??"1")==="1"||Number(ctx.inputs?.["harbinger-hp-90"]??1)>0;return on?[14,17.5,21,24.5,28][r-1]:0},
    }
  ],
  
};
