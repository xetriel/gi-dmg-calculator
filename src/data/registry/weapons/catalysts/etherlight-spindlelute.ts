import type { WeaponConfig } from "../types";

export const etherlightSpindlelute: WeaponConfig = {
  id: "etherlight-spindlelute",
  name: "Etherlight Spindlelute",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Etherlight Resonator",
  passiveDesc:
    "Elemental Burst DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "spindlelute-burst-dmg",
      label: "Elemental Burst DMG Bonus (Etherlight Spindlelute)",
      stat: "burstDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
