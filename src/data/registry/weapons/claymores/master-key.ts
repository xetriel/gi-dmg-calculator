import type { WeaponConfig } from "../types";

export const masterKey: WeaponConfig = {
  id: "master-key",
  name: "Master Key",
  type: "Claymore",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 61.3,
    baseValue: 13.3,
  },
  passiveName: "Lockpick",
  passiveDesc:
    "Using an Elemental Burst increases ATK by 16~32% for 12s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "master-key-burst-active",
      label: "Burst Used (+16~32% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "master-key-atk",
      label: "ATK% (Master Key)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "master-key-burst-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['master-key-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['master-key-burst-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
