import type { WeaponConfig } from "../types";

export const disasterAndRemorse: WeaponConfig = {
  id: "disaster-and-remorse",
  name: "Disaster and Remorse",
  type: "Polearm",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Mourning Veil",
  passiveDesc:
    "ATK is increased by 20~40%. When an Elemental Burst is unleashed, increases All Elemental DMG Bonus by 16~32% for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "disaster-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "disaster-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
