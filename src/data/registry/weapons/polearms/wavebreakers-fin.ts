import type { WeaponConfig } from "../types";

export const wavebreakersFin: WeaponConfig = {
  id: "wavebreakers-fin",
  name: "Wavebreaker's Fin",
  type: "Polearm",
  rarity: 4,
  baseAtk: 620,
  lvl1BaseAtk: 45,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 13.8,
    baseValue: 3,
  },
  passiveName: "Watatsumi Wavewalker",
  passiveDesc:
    "For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12~0.24%. A maximum of 40~80% increased Elemental Burst DMG can be achieved this way.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "wavebreaker-party-energy",
      label: "Combined Party Energy Capacity (e.g. 240-330)",
      control: "stacks",
      defaultValue: 280,
      max: 400,
      hint: "Total Energy of party",
    }
  ],
  buffs: [
    {
      id: "wavebreaker-burst-dmg",
      label: "Elemental Burst DMG Bonus (Wavebreaker's Fin)",
      stat: "burstDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      compute: (r,ctx)=>{const energy=Number(ctx.inputs?.["wavebreaker-party-energy"]??280);const ratio=[.0012,.0015,.0018,.0021,.0024][r-1];const cap=[40,50,60,70,80][r-1];return Math.min(energy*ratio*100,cap)},
    }
  ],
  
};
