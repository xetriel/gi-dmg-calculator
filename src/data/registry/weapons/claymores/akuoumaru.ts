import type { WeaponConfig } from "../types";

export const akuoumaru: WeaponConfig = {
  id: "akuoumaru",
  name: "Akuoumaru",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Watatsumi Wavewalker",
  passiveDesc:
    "For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12~0.24%. A maximum of 40~80% increased Elemental Burst DMG can be achieved this way.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "party-energy-capacity",
      label: "Combined Party Energy Capacity (e.g. 240-330)",
      control: "stacks",
      defaultValue: 280,
      max: 400,
      hint: "Total Energy of party (e.g. 80+80+60+60 = 280)",
    }
  ],
  buffs: [
    {
      id: "akuoumaru-burst-dmg",
      label: "Elemental Burst DMG Bonus (Akuoumaru)",
      stat: "burstDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      compute: (r,ctx)=>{const energy=Number(ctx.inputs?.["party-energy-capacity"]??280);const ratio=[.0012,.0015,.0018,.0021,.0024][r-1];const cap=[40,50,60,70,80][r-1];return Math.min(energy*ratio*100,cap)},
    }
  ],
  
};
