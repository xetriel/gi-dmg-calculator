import type { WeaponConfig } from "../types";

export const predator: WeaponConfig = {
  id: "predator",
  name: "Predator",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Strong Strike",
  passiveDesc:
    "Dealing Cryo DMG to opponents increases Normal and Charged Attack DMG by 10% for 6s (max 2 stacks = +20% NA/CA DMG). Equipping on Aloy increases ATK by 66.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "predator-stacks",
      label: "Cryo DMG Hits Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+10% NA and CA DMG per stack (up to +20%)",
    },
    {
      id: "predator-is-aloy",
      label: "Equipped on Aloy (+66 Flat ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+66 Flat ATK for Aloy",
    }
  ],
  buffs: [
    {
      id: "predator-na-dmg",
      label: "Normal Attack DMG Bonus (Predator)",
      stat: "normalDmgBonus",
      refinementValues: [20, 20, 20, 20, 20],
      isTeamBuff: false,
      conditionKey: "predator-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['predator-stacks'] ?? 2); return s * 10; },
    },
    {
      id: "predator-ca-dmg",
      label: "Charged Attack DMG Bonus (Predator)",
      stat: "chargedDmgBonus",
      refinementValues: [20, 20, 20, 20, 20],
      isTeamBuff: false,
      conditionKey: "predator-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['predator-stacks'] ?? 2); return s * 10; },
    },
    {
      id: "predator-aloy-atk",
      label: "Flat ATK for Aloy (Predator)",
      stat: "atk",
      refinementValues: [66, 66, 66, 66, 66],
      isTeamBuff: false,
      conditionKey: "predator-is-aloy",
      compute: (r, ctx) => { const on = (ctx.inputs?.['predator-is-aloy'] ?? '1') === '1' || Number(ctx.inputs?.['predator-is-aloy'] ?? 1) > 0; return on ? 66 : 0; },
    }
  ],
  signatureFor: ["aloy"],
};
