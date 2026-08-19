import type { WeaponConfig } from "../types";

export const theCatch: WeaponConfig = {
  id: "the-catch",
  name: "The Catch",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Shanty",
  passiveDesc:
    "Increases Elemental Burst DMG by 16~32% and Elemental Burst CRIT Rate by 6~12%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "catch-burst-dmg",
      label: "Elemental Burst DMG Bonus (The Catch)",
      stat: "burstDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "catch-burst-crit",
      label: "Elemental Burst CRIT Rate% (The Catch)",
      stat: "critRate",
      refinementValues: [6, 7.5, 9, 10.5, 12],
      isTeamBuff: false,
      compute: (r) => [6, 7.5, 9, 10.5, 12][r - 1],
    }
  ],
  
};
