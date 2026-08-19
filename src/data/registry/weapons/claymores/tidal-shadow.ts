import type { WeaponConfig } from "../types";

export const tidalShadow: WeaponConfig = {
  id: "tidal-shadow",
  name: "Tidal Shadow",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "White Wave Fold",
  passiveDesc:
    "After the wielder is healed, ATK is increased by 24~48% for 8s. This can be triggered even when the character is not on the field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "tidal-shadow-healed",
      label: "Wielder Received Healing (+24~48% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+24~48% ATK for 8s",
    }
  ],
  buffs: [
    {
      id: "tidal-shadow-atk",
      label: "ATK% (Tidal Shadow)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "tidal-shadow-healed",
      compute: (r, ctx) => { const on = (ctx.inputs?.['tidal-shadow-healed'] ?? '1') === '1' || Number(ctx.inputs?.['tidal-shadow-healed'] ?? 1) > 0; return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
