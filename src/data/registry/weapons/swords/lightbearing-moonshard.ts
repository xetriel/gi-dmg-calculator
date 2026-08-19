import type { WeaponConfig } from "../types";

export const lightbearingMoonshard: WeaponConfig = {
  id: "lightbearing-moonshard",
  name: "Lightbearing Moonshard",
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
  passiveName: "Lunar Glow",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. When an Elemental Burst is used, increases ATK by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "moonshard-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "moonshard-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
