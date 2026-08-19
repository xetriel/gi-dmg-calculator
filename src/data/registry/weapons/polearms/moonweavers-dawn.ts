import type { WeaponConfig } from "../types";

export const moonweaversDawn: WeaponConfig = {
  id: "moonweavers-dawn",
  name: "Moonweaver's Dawn",
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
  passiveName: "Moonweave",
  passiveDesc:
    "Normal and Charged Attack DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "moonweaver-na-ca",
      label: "Normal/Charged Attack DMG Bonus",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
