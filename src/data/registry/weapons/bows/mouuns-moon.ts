import type { WeaponConfig } from "../types";

export const mouunsMoon: WeaponConfig = {
  id: "mouuns-moon",
  name: "Mouun's Moon",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Watatsumi Wavewalker",
  passiveDesc:
    "For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12~0.24%. A maximum of 40~80% increased Elemental Burst DMG can be achieved this way.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mouun-party-energy",
      label: "Combined Party Energy Capacity (e.g. 240-330)",
      control: "stacks",
      defaultValue: 280,
      max: 400,
      hint: "Total Energy of party",
    }
  ],
  buffs: [
    {
      id: "mouun-burst-dmg",
      label: "Elemental Burst DMG Bonus (Mouun's Moon)",
      stat: "burstDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      compute: (r,ctx)=>{const energy=Number(ctx.inputs?.["mouun-party-energy"]??280);const ratio=[.0012,.0015,.0018,.0021,.0024][r-1];const cap=[40,50,60,70,80][r-1];return Math.min(energy*ratio*100,cap)},
    }
  ],
  
};
