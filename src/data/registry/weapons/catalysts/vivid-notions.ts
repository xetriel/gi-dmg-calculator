import type { WeaponConfig } from "../types";

export const vividNotions: WeaponConfig = {
  id: "vivid-notions",
  name: "Vivid Notions",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Vivid Dream",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. ATK is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "vivid-elem-dmg",
      label: "All Elemental DMG Bonus (Vivid Notions)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "vivid-atk",
      label: "ATK% (Vivid Notions)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
