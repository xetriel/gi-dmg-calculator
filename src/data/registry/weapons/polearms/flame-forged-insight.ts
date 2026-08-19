import type { WeaponConfig } from "../types";

export const flameForgedInsight: WeaponConfig = {
  id: "flame-forged-insight",
  name: "Flame-Forged Insight",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Flame Insight",
  passiveDesc:
    "Increases Normal and Charged Attack DMG by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "flame-insight-na-ca",
      label: "Normal/Charged Attack DMG Bonus",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
