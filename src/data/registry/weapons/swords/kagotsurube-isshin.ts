import type { WeaponConfig } from "../types";

export const kagotsurubeIsshin: WeaponConfig = {
  id: "kagotsurube-isshin",
  name: "Kagotsurube Isshin",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Isshin Art Clarity",
  passiveDesc:
    "When a Normal, Charged, or Plunging Attack hits an opponent, it unleashes a Hewing Gale dealing 180% ATK DMG and increases ATK by 15% for 8s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "isshin-atk-active",
      label: "Hewing Gale ATK Buff Active (+15% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+15% ATK for 8s",
    }
  ],
  buffs: [
    {
      id: "isshin-atk",
      label: "ATK% (Kagotsurube Isshin)",
      stat: "atk",
      refinementValues: [15, 15, 15, 15, 15],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "isshin-atk-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['isshin-atk-active'] ?? '1') === '1' || Number(ctx.inputs?.['isshin-atk-active'] ?? 1) > 0; return on ? (0.15 * ctx.baseAtk) : 0; },
    }
  ],
  damageInstances: [
    {
      id: "isshin-proc",
      name: "Hewing Gale DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [180, 180, 180, 180, 180],
      description: "Deals 180% ATK as AoE Physical DMG",
    },
  ],
};
