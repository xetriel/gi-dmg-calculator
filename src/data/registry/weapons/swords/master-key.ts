import type { WeaponConfig } from "../types";

export const masterKey: WeaponConfig = {
  id: "master-key",
  name: "Master Key",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Lockpick",
  passiveDesc:
    "Using an Elemental Burst increases ATK by 16~32% for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "master-key-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
