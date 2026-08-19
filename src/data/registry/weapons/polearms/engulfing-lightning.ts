import type { WeaponConfig } from "../types";

export const engulfingLightning: WeaponConfig = {
  id: "engulfing-lightning",
  name: "Engulfing Lightning",
  type: "Polearm",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Timeless Dream: Eternal Stove",
  passiveDesc:
    "ATK increased by 28~56% of Energy Recharge over the base 100%. You can gain a maximum bonus of 80~120% ATK. Gain 30~50% Energy Recharge for 12s after using an Elemental Burst.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "engulfing-total-er",
      label: "Character Total ER% (e.g. 250%)",
      control: "stacks",
      defaultValue: 250,
      max: 400,
      hint: "Total ER% used for Engulfing ATK conversion (over 100%)",
    },
    {
      id: "engulfing-burst-active",
      label: "Post-Burst +30~50% ER Active",
      control: "toggle",
      defaultValue: 1,
      hint: "+30~50% Energy Recharge for 12s",
    }
  ],
  buffs: [
    {
      id: "engulfing-atk-from-er",
      label: "ATK% from ER (Engulfing Lightning)",
      stat: "atk",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => { const er = Number(ctx.inputs?.['engulfing-total-er'] ?? 250); const postBurst = (ctx.inputs?.['engulfing-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['engulfing-burst-active'] ?? 1) > 0; const totalEr = er + (postBurst ? [30, 35, 40, 45, 50][r - 1] : 0); const excessEr = Math.max(0, totalEr - 100); const ratio = [0.28, 0.35, 0.42, 0.49, 0.56][r - 1]; const cap = [80, 90, 100, 110, 120][r - 1]; const atkPct = Math.min(excessEr * ratio, cap); return (atkPct / 100) * ctx.baseAtk; },
    },
    {
      id: "engulfing-er-buff",
      label: "Energy Recharge% (Engulfing Lightning)",
      stat: "energyRecharge",
      refinementValues: [30, 35, 40, 45, 50],
      isTeamBuff: false,
      conditionKey: "engulfing-burst-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['engulfing-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['engulfing-burst-active'] ?? 1) > 0; return on ? [30, 35, 40, 45, 50][r - 1] : 0; },
    }
  ],
  signatureFor: ["raiden"],
};
