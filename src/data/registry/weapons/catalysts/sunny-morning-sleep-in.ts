import type { WeaponConfig } from "../types";

export const sunnyMorningSleepIn: WeaponConfig = {
  id: "sunny-morning-sleep-in",
  name: "Sunny Morning Sleep-In",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Lazy Sun",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. Normal Attack hits grant 16~32% ATK for 10s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "sunny-morning-elem",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "sunny-morning-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
