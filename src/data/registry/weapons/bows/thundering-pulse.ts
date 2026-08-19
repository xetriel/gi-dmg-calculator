import type { WeaponConfig } from "../types";

export const thunderingPulse: WeaponConfig = {
  id: "thundering-pulse",
  name: "Thundering Pulse",
  type: "Bow",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Rule By Thunder",
  passiveDesc:
    "Increases ATK by 20~40% and grants Thunder Emblem stacks. At stack levels 1/2/3, Thunder Emblem increases Normal Attack DMG by 12/24/40% ~ 24/48/80%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "thunder-emblem-stacks",
      label: "Thunder Emblem Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+12/24/40% NA DMG bonus at R1 (up to +24/48/80% at R5)",
    }
  ],
  buffs: [
    {
      id: "thundering-atk",
      label: "ATK% (Thundering Pulse)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "thundering-na-dmg",
      label: "Normal Attack DMG Bonus (Thunder Emblem)",
      stat: "normalDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "thunder-emblem-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['thunder-emblem-stacks'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 0: [0, 0, 0, 0, 0], 1: [12, 15, 18, 21, 24], 2: [24, 30, 36, 42, 48], 3: [40, 50, 60, 70, 80] }; return (tiers[s] ?? tiers[3])[r - 1]; },
    }
  ],
  signatureFor: ["yoimiya"],
};
