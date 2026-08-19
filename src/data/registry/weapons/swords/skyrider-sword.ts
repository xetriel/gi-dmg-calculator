import type { WeaponConfig } from "../types";

export const skyriderSword: WeaponConfig = {
  id: "skyrider-sword",
  name: "Skyrider Sword",
  type: "Sword",
  rarity: 3,
  baseAtk: 354,
  lvl1BaseAtk: 38,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 51.7,
    baseValue: 11.3,
  },
  passiveName: "Determination",
  passiveDesc:
    "Using an Elemental Burst increases ATK and Movement SPD by 12~24% for 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "skyrider-atk",
      label: "ATK% (Skyrider Sword)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      compute: (r,ctx)=>[12,15,18,21,24][r-1]/100*ctx.baseAtk,
    }
  ],
  
};
