import type { WeaponConfig } from "../types";

export const wolfFang: WeaponConfig = {
  id: "wolf-fang",
  name: "Wolf-Fang",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Northwind Wolf",
  passiveDesc:
    "DMG dealt by Elemental Skill and Elemental Burst is increased by 16~32%. When an Elemental Skill or Burst hits an opponent, its CRIT Rate will be increased by 2~4% (max 4 stacks each = +8~16%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "wolf-fang-skill-stacks",
      label: "Elemental Skill CRIT Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "+2~4% Skill CRIT Rate per stack (up to +8~16%)",
    },
    {
      id: "wolf-fang-burst-stacks",
      label: "Elemental Burst CRIT Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "+2~4% Burst CRIT Rate per stack (up to +8~16%)",
    }
  ],
  buffs: [
    {
      id: "wolf-fang-base-skill-dmg",
      label: "Elemental Skill DMG Bonus (Wolf-Fang Base)",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "wolf-fang-base-burst-dmg",
      label: "Elemental Burst DMG Bonus (Wolf-Fang Base)",
      stat: "burstDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "wolf-fang-skill-crit",
      label: "Elemental Skill CRIT Rate% (Wolf-Fang Stacks)",
      stat: "critRate",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      conditionKey: "wolf-fang-skill-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['wolf-fang-skill-stacks'] ?? 4); return s * [2, 2.5, 3, 3.5, 4][r - 1]; },
    },
    {
      id: "wolf-fang-burst-crit",
      label: "Elemental Burst CRIT Rate% (Wolf-Fang Stacks)",
      stat: "critRate",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      conditionKey: "wolf-fang-burst-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['wolf-fang-burst-stacks'] ?? 4); return s * [2, 2.5, 3, 3.5, 4][r - 1]; },
    }
  ],
  
};
