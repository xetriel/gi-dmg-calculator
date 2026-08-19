import type { WeaponConfig } from "../types";

export const sequenceOfSolitude: WeaponConfig = {
  id: "sequence-of-solitude",
  name: "Sequence of Solitude",
  type: "Sword",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 36.8,
    baseValue: 8,
  },
  passiveName: "Solitude",
  passiveDesc:
    "Increases Normal and Charged Attack DMG by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "solitude-na-ca-dmg",
      label: "Normal/Charged Attack DMG Bonus",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
