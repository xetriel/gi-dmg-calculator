import type { WeaponConfig } from "../types";

export const astralVulturesCrimsonPlumage: WeaponConfig = {
  id: "astral-vultures-crimson-plumage",
  name: "Astral Vulture's Crimson Plumage",
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
  passiveName: "A Golden-Eagle Stride",
  passiveDesc:
    "Triggering Swirl reaction increases ATK by 24~48% for 12s. Having 1/2 party members of different elemental types increases Charged Attack DMG by 20/48% ~ 40/96% and Elemental Burst DMG by 10/24% ~ 20/48%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "astral-swirl-active",
      label: "Swirl Triggered Active (+24~48% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+24~48% ATK for 12s",
    },
    {
      id: "astral-diff-elements-count",
      label: "Teammates of Different Elements (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "1 member: +20% CA / +10% Burst. 2 members: +48% CA / +24% Burst.",
    }
  ],
  buffs: [
    {
      id: "astral-atk",
      label: "ATK% (Astral Vulture Swirl)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "astral-swirl-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['astral-swirl-active'] ?? '1') === '1' || Number(ctx.inputs?.['astral-swirl-active'] ?? 1) > 0; return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "astral-ca-dmg",
      label: "Charged Attack DMG Bonus (Astral Vulture)",
      stat: "chargedDmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "astral-diff-elements-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['astral-diff-elements-count'] ?? 2); if (count >= 2) return [48, 60, 72, 84, 96][r - 1]; if (count === 1) return [20, 25, 30, 35, 40][r - 1]; return 0; },
    },
    {
      id: "astral-burst-dmg",
      label: "Elemental Burst DMG Bonus (Astral Vulture)",
      stat: "burstDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "astral-diff-elements-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['astral-diff-elements-count'] ?? 2); if (count >= 2) return [24, 30, 36, 42, 48][r - 1]; if (count === 1) return [10, 12.5, 15, 17.5, 20][r - 1]; return 0; },
    }
  ],
  signatureFor: ["chasca"],
};
