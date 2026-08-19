import type { WeaponConfig } from "../types";

export const cashflowSupervision: WeaponConfig = {
  id: "cashflow-supervision",
  name: "Cashflow Supervision",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 22.1,
    baseValue: 4.8,
  },
  passiveName: "Golden Blood-Tide",
  passiveDesc:
    "ATK is increased by 14~28%. When current HP increases or decreases, Normal Attack DMG is increased by 16~32% and Charged Attack DMG is increased by 14~28% for 4s. Max 3 stacks (up to +48~96% NA, +42~84% CA).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "cashflow-hp-stacks",
      label: "Blood-Tide Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+16~32% NA and +14~28% CA DMG per stack (up to +48~96% NA, +42~84% CA)",
    }
  ],
  buffs: [
    {
      id: "cashflow-atk",
      label: "ATK% (Cashflow Supervision)",
      stat: "atk",
      refinementValues: [14, 17.5, 21, 24.5, 28],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([14, 17.5, 21, 24.5, 28][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "cashflow-na-dmg",
      label: "Normal Attack DMG Bonus (Cashflow Supervision)",
      stat: "normalDmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "cashflow-hp-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['cashflow-hp-stacks'] ?? 3); return s * [16, 20, 24, 28, 32][r - 1]; },
    },
    {
      id: "cashflow-ca-dmg",
      label: "Charged Attack DMG Bonus (Cashflow Supervision)",
      stat: "chargedDmgBonus",
      refinementValues: [42, 52.5, 63, 73.5, 84],
      isTeamBuff: false,
      conditionKey: "cashflow-hp-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['cashflow-hp-stacks'] ?? 3); return s * [14, 17.5, 21, 24.5, 28][r - 1]; },
    }
  ],
  signatureFor: ["wriothesley"],
};
