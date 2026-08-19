import type { WeaponConfig } from "../types";

export const finaleOfTheDeep: WeaponConfig = {
  id: "finale-of-the-deep",
  name: "Finale of the Deep",
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
  passiveName: "An End Sublime",
  passiveDesc:
    "When using an Elemental Skill, ATK will be increased by 12~24% for 15s, and a Bond of Life equal to 25% of Max HP will be granted. When cleared, grants 150~300 flat ATK.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "finale-cleared-bol",
      label: "Bond of Life Cleared (Flat ATK Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "+150~300 Flat ATK for 15s",
    }
  ],
  buffs: [
    {
      id: "finale-atk-pct",
      label: "ATK% (Finale of the Deep)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      compute: (r,ctx)=>[12,15,18,21,24][r-1]/100*ctx.baseAtk,
    },
    {
      id: "finale-flat-atk",
      label: "Flat ATK from Cleared BoL (Finale of the Deep)",
      stat: "atk",
      refinementValues: [150, 187.5, 225, 262.5, 300],
      isTeamBuff: false,
      conditionKey: "finale-cleared-bol",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["finale-cleared-bol"]??"1")==="1"||Number(ctx.inputs?.["finale-cleared-bol"]??1)>0;return on?[150,187.5,225,262.5,300][r-1]:0},
    }
  ],
  
};
