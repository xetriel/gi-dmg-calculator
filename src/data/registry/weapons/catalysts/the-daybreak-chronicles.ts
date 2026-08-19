import type { WeaponConfig } from "../types";

export const theDaybreakChronicles: WeaponConfig = {
  id: "the-daybreak-chronicles",
  name: "The Daybreak Chronicles",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Chronicle of Dawn",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. When an Elemental Burst is used, increases ATK by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "daybreak-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "daybreak-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
