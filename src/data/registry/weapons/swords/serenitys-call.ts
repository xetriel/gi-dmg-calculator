import type { WeaponConfig } from "../types";

export const serenitysCall: WeaponConfig = {
  id: "serenitys-call",
  name: "Serenity's Call",
  type: "Sword",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 61.3,
    baseValue: 13.3,
  },
  passiveName: "Peaceful Mind",
  passiveDesc:
    "Elemental Burst DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "serenity-burst-dmg",
      label: "Elemental Burst DMG Bonus (Serenity's Call)",
      stat: "burstDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
