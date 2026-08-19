import type { WeaponConfig } from "../types";

export const ringOfYaxche: WeaponConfig = {
  id: "ring-of-yaxche",
  name: "Ring of Yaxche",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Echoing Chime",
  passiveDesc:
    "Using an Elemental Skill increases Normal Attack DMG by 0.6~1.2% for every 1,000 Max HP for 10s. Max increase is 16~32%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "yaxche-max-hp",
      label: "Character Max HP",
      control: "stacks",
      defaultValue: 35000,
      max: 100000,
      hint: "Max HP used for NA DMG bonus conversion",
    }
  ],
  buffs: [
    {
      id: "yaxche-na-dmg",
      label: "Normal Attack DMG Bonus (Ring of Yaxche)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r,ctx)=>{const hp=Number(ctx.inputs?.["yaxche-max-hp"]??35e3);const per1k=[.6,.75,.9,1.05,1.2][r-1];const cap=[16,20,24,28,32][r-1];return Math.min(hp/1e3*per1k,cap)},
    }
  ],
  
};
