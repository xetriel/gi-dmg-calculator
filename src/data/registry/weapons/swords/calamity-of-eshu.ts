import type { WeaponConfig } from "../types";

export const calamityOfEshu: WeaponConfig = {
  id: "calamity-of-eshu",
  name: "Calamity of Eshu",
  type: "Sword",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Pure and True",
  passiveDesc:
    "When HP is above 70%, increases Normal and Charged Attack DMG by 20~40% and Normal and Charged Attack CRIT Rate by 8~16%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "eshu-hp-70",
      label: "HP >= 70%",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% NA/CA DMG and +8~16% NA/CA CRIT Rate",
    }
  ],
  buffs: [
    {
      id: "eshu-na-ca-dmg",
      label: "Normal/Charged Attack DMG Bonus (Calamity of Eshu)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "eshu-hp-70",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["eshu-hp-70"]??"1")==="1"||Number(ctx.inputs?.["eshu-hp-70"]??1)>0;return on?[20,25,30,35,40][r-1]:0},
    },
    {
      id: "eshu-ca-dmg",
      label: "Charged Attack DMG Bonus (Calamity of Eshu)",
      stat: "chargedDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "eshu-hp-70",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["eshu-hp-70"]??"1")==="1"||Number(ctx.inputs?.["eshu-hp-70"]??1)>0;return on?[20,25,30,35,40][r-1]:0},
    }
  ],
  
};
