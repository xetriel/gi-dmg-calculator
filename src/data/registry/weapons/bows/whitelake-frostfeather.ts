import type { WeaponConfig } from "../types";

export const whitelakeFrostfeather: WeaponConfig = {
  id: "whitelake-frostfeather",
  name: "Whitelake Frostfeather",
  type: "Bow",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Frostfeather Gaze",
  passiveDesc:
    "Increases Cryo DMG Bonus by 12~24%. Aimed Shots increase ATK by 20~40% for 10s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "frostfeather-cryo",
      label: "Cryo DMG Bonus",
      stat: "cryoDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "frostfeather-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
