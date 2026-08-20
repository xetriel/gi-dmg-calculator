import type { WeaponConfig } from "../types";

export const silvershowerHeartstrings: WeaponConfig = {
  id: "silvershower-heartstrings",
  name: "Silvershower Heartstrings",
  type: "Bow",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Dry Spell",
  passiveDesc:
    "The wielder can gain the Remedy effect (max 3 stacks): increases Max HP by 12/24/40% ~ 24/48/80%. At 3 stacks, increases Elemental Burst CRIT Rate by 28~56%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "silvershower-remedy-stacks",
      label: "Remedy Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "1: +12~24% HP, 2: +24~48% HP, 3: +40~80% HP & +28~56% Burst CRIT Rate",
    }
  ],
  buffs: [
    {
      id: "silvershower-hp",
      label: "Max HP% (Silvershower Heartstrings)",
      stat: "hp",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "silvershower-remedy-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['silvershower-remedy-stacks'] ?? 3); if (s === 3) return [40, 50, 60, 70, 80][r - 1]; if (s === 2) return [24, 30, 36, 42, 48][r - 1]; if (s === 1) return [12, 15, 18, 21, 24][r - 1]; return 0; },
    },
    {
      id: "silvershower-burst-crit",
      label: "Elemental Burst CRIT Rate% (Silvershower)",
      stat: "critRate",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      conditionKey: "silvershower-remedy-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['silvershower-remedy-stacks'] ?? 3); return s >= 3 ? [28, 35, 42, 49, 56][r - 1] : 0; },
    }
  ],
  signatureFor: ["sigewinne"],
};
