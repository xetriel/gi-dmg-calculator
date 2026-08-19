import type { WeaponConfig } from "../types";

export const serenitysCall: WeaponConfig = {
  id: "serenitys-call",
  name: "Serenity's Call",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
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
