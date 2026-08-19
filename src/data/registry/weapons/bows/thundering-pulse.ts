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
    "Increases ATK by 20~40% and grants Thunder Emblem stacks (max 3): increases Normal Attack DMG by 12/24/40% ~ 24/48/80%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "pulse-emblem-stacks",
      label: "Thunder Emblem Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "1: +12~24%, 2: +24~48%, 3: +40~80% Normal Attack DMG",
    }
  ],
  buffs: [
    {
      id: "pulse-atk",
      label: "ATK% (Thundering Pulse)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "pulse-na-dmg",
      label: "Normal Attack DMG Bonus (Thundering Pulse)",
      stat: "normalDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "pulse-emblem-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['pulse-emblem-stacks'] ?? 3); if (s === 3) return [40, 50, 60, 70, 80][r - 1]; if (s === 2) return [24, 30, 36, 42, 48][r - 1]; if (s === 1) return [12, 15, 18, 21, 24][r - 1]; return 0; },
    }
  ],
  signatureFor: ["yoimiya"],
};
