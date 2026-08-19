import type { WeaponConfig } from "../types";

export const ferrousShadow: WeaponConfig = {
  id: "ferrous-shadow",
  name: "Ferrous Shadow",
  type: "Claymore",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 35.2,
    baseValue: 7.7,
  },
  passiveName: "Unbending",
  passiveDesc:
    "When HP falls below 70~90%, increases Charged Attack DMG by 30~50%, and Charged Attacks become harder to interrupt.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "ferrous-low-hp",
      label: "HP Below 70~90%",
      control: "toggle",
      defaultValue: 1,
      hint: "+30~50% Charged Attack DMG",
    }
  ],
  buffs: [
    {
      id: "ferrous-ca-dmg",
      label: "Charged Attack DMG Bonus (Ferrous Shadow)",
      stat: "chargedDmgBonus",
      refinementValues: [30, 35, 40, 45, 50],
      isTeamBuff: false,
      conditionKey: "ferrous-low-hp",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["ferrous-low-hp"]??"1")==="1"||Number(ctx.inputs?.["ferrous-low-hp"]??1)>0;return on?[30,35,40,45,50][r-1]:0},
    }
  ],
  
};
