import type { WeaponConfig } from "../types";

export const flowingPurity: WeaponConfig = {
  id: "flowing-purity",
  name: "Flowing Purity",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Unfinished Masterpiece",
  passiveDesc:
    "When using an Elemental Skill, All Elemental DMG Bonus is increased by 8~16% for 15s and grants a Bond of Life equal to 24% of Max HP. When cleared, each 1,000 BoL cleared grants 2~4% All Elemental DMG Bonus (up to 12~24%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "flowing-purity-cleared-bol",
      label: "Bond of Life Cleared (+12~24% Elem DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Max cleared BoL bonus",
    }
  ],
  buffs: [
    {
      id: "flowing-base-elem",
      label: "All Elemental DMG Bonus (Flowing Purity Base)",
      stat: "dmgBonus",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      compute: r=>[8,10,12,14,16][r-1],
    },
    {
      id: "flowing-bol-elem",
      label: "All Elemental DMG Bonus from Cleared BoL",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "flowing-purity-cleared-bol",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["flowing-purity-cleared-bol"]??"1")==="1"||Number(ctx.inputs?.["flowing-purity-cleared-bol"]??1)>0;return on?[12,15,18,21,24][r-1]:0},
    }
  ],
  
};
