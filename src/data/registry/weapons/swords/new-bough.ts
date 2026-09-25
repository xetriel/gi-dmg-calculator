import type { WeaponConfig } from "../types";

export const newBough: WeaponConfig = {
  id: "new-bough",
  name: "New Bough",
  description:
    "A sword made from sacred wood, said to have once turned the tide of battle.",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 55.1,
    baseValue: 12.0,
  },
  passiveName: "Wildgrowth",
  passiveDesc:
    'When the equipping character hits the opponent with an attack within 12s after using the Elemental Skill, they gain the "Verdant" effect, which increases their ATK by 4%/5%/6%/7%/8% and their Elemental Mastery by 20/25/30/35/40. This effect lasts 6s and can trigger once every second. Max 3 stacks. The aforementioned effects can still trigger even when the equipping character is not on the field.\nRadiance: Stellar Glimmer: The effect of "Verdant" is changed to: Increases ATK by 6%/7.5%/9%/10.5%/12% as well as Stellar Glimmer reaction DMG dealt by the equipping character by 8%/10%/12%/14%/16%.',
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "new-bough-verdant-stacks",
      label: "Verdant Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "Attack hits within 12s after Skill grant stacks for 6s (triggers off-field)",
    },
    {
      id: "new-bough-radiance-glimmer",
      label: "Radiance: Stellar Glimmer Active",
      control: "toggle",
      defaultValue: 0,
      hint: "Changes Verdant to +6~12% ATK and +8~16% Stellar Glimmer DMG per stack",
    },
  ],
  buffs: [
    {
      id: "new-bough-atk",
      label: "ATK% (Wildgrowth)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "new-bough-verdant-stacks",
      compute: (r, ctx) => {
        const s = Math.min(3, Math.max(0, Number(ctx.inputs?.["new-bough-verdant-stacks"] ?? 3)));
        const isGlimmer =
          (ctx.inputs?.["new-bough-radiance-glimmer"] ?? "0") === "1" ||
          Number(ctx.inputs?.["new-bough-radiance-glimmer"] ?? 0) > 0;
        const perStack = isGlimmer
          ? [6, 7.5, 9, 10.5, 12][r - 1]
          : [4, 5, 6, 7, 8][r - 1];
        return ((s * perStack) / 100) * ctx.baseAtk;
      },
    },
    {
      id: "new-bough-em",
      label: "Elemental Mastery (Wildgrowth)",
      stat: "em",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      conditionKey: "new-bough-verdant-stacks",
      compute: (r, ctx) => {
        const isGlimmer =
          (ctx.inputs?.["new-bough-radiance-glimmer"] ?? "0") === "1" ||
          Number(ctx.inputs?.["new-bough-radiance-glimmer"] ?? 0) > 0;
        if (isGlimmer) return 0;
        const s = Math.min(3, Math.max(0, Number(ctx.inputs?.["new-bough-verdant-stacks"] ?? 3)));
        return s * [20, 25, 30, 35, 40][r - 1];
      },
    },
    {
      id: "new-bough-stellar-glimmer",
      label: "Stellar Glimmer DMG Bonus (Wildgrowth)",
      stat: "stellarGlimmerDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "new-bough-verdant-stacks",
      compute: (r, ctx) => {
        const isGlimmer =
          (ctx.inputs?.["new-bough-radiance-glimmer"] ?? "0") === "1" ||
          Number(ctx.inputs?.["new-bough-radiance-glimmer"] ?? 0) > 0;
        if (!isGlimmer) return 0;
        const s = Math.min(3, Math.max(0, Number(ctx.inputs?.["new-bough-verdant-stacks"] ?? 3)));
        return s * [8, 10, 12, 14, 16][r - 1];
      },
    },
  ],
};
