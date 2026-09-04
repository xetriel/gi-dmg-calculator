import type { WeaponConfig } from "../types";

export const sacrificersStaff: WeaponConfig = {
  id: "sacrificers-staff",
  name: "Sacrificer's Staff",
  type: "Polearm",
  rarity: 4,
  baseAtk: 620,
  lvl1BaseAtk: 45,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 9.2,
    baseValue: 2,
  },
  passiveName: "Untainted Desire",
  passiveDesc:
    "For 6s after an Elemental Skill hits an opponent, ATK is increased by 8~16% and Energy Recharge is increased by 6~12%. Max 3 stacks. This effect can be triggered even when the equipping character is off-field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "sacrificer-stacks",
      label: "Untainted Desire Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+8~16% ATK & +6~12% ER per stack (up to +24~48% ATK and +18~36% ER)",
    },
  ],
  buffs: [
    {
      id: "sacrificer-atk",
      label: "ATK% (Untainted Desire)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "sacrificer-stacks",
      compute: (r, ctx) => {
        const s = Math.min(3, Math.max(0, Number(ctx.inputs?.["sacrificer-stacks"] ?? 3)));
        const perStack = [8, 10, 12, 14, 16][r - 1];
        return ((s * perStack) / 100) * ctx.baseAtk;
      },
    },
    {
      id: "sacrificer-er",
      label: "Energy Recharge% (Untainted Desire)",
      stat: "energyRecharge",
      refinementValues: [18, 22.5, 27, 31.5, 36],
      isTeamBuff: false,
      conditionKey: "sacrificer-stacks",
      compute: (r, ctx) => {
        const s = Math.min(3, Math.max(0, Number(ctx.inputs?.["sacrificer-stacks"] ?? 3)));
        const perStack = [6, 7.5, 9, 10.5, 12][r - 1];
        return s * perStack;
      },
    },
  ],
};
