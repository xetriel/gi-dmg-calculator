import type { WeaponConfig } from "../types";

export const coolSteel: WeaponConfig = {
  id: "cool-steel",
  name: "Cool Steel",
  type: "Sword",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 35.2,
    baseValue: 7.7,
  },
  passiveName: "Bane of Water and Ice",
  passiveDesc:
    "Increases DMG against opponents affected by Hydro or Cryo by 12~24%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "cool-steel-target",
      label: "Target Affected by Hydro/Cryo",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% DMG bonus",
    }
  ],
  buffs: [
    {
      id: "cool-steel-dmg",
      label: "All DMG Bonus (Cool Steel)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "cool-steel-target",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["cool-steel-target"]??"1")==="1"||Number(ctx.inputs?.["cool-steel-target"]??1)>0;return on?[12,15,18,21,24][r-1]:0},
    }
  ],
  
};
