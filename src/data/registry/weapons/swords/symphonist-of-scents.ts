import type { WeaponConfig } from "../types";

export const symphonistOfScents: WeaponConfig = {
  id: "symphonist-of-scents",
  name: "Symphonist of Scents",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Fragrant Harmony",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. Normal and Charged Attacks dealing Elemental DMG increase ATK by 16~32% for 10s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "symphonist-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "symphonist-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
