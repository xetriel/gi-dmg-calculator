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
  passiveName: "Dry-Well Receding",
  passiveDesc:
    "The equipping character can gain the Remedy effect: Providing healing, using an Elemental Skill, or when protected by a Bond of Life increases Max HP by 12/24/40% ~ 24/48/80% at 1/2/3 stacks for 25s. At 3 stacks, Elemental Burst CRIT Rate is increased by 28~56%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "silvershower-stacks",
      label: "Remedy Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+12/24/40% Max HP; +28~56% Burst CRIT Rate at 3 stacks",
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
      conditionKey: "silvershower-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['silvershower-stacks'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 0: [0, 0, 0, 0, 0], 1: [12, 15, 18, 21, 24], 2: [24, 30, 36, 42, 48], 3: [40, 50, 60, 70, 80] }; return (tiers[s] ?? tiers[3])[r - 1]; },
    },
    {
      id: "silvershower-burst-crit",
      label: "Elemental Burst CRIT Rate% (Silvershower)",
      stat: "critRate",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      conditionKey: "silvershower-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['silvershower-stacks'] ?? 3); return s >= 3 ? [28, 35, 42, 49, 56][r - 1] : 0; },
    }
  ],
  signatureFor: ["sigewinne"],
};
