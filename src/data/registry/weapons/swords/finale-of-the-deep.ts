import type { WeaponConfig } from "../types";

export const finaleOfTheDeep: WeaponConfig = {
  id: "finale-of-the-deep",
  name: "Finale of the Deep",
  type: "Sword",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "An End Sublime",
  passiveDesc:
    "When using an Elemental Skill, ATK is increased by 12~24% for 15s, and a Bond of Life equal to 25% of Max HP is granted. When the Bond of Life is cleared, a maximum of 150~300 ATK is gained based on 2.4~4.8% of the cleared Bond of Life value for 15s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "finale-skill-active",
      label: "Skill Used (+12~24% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% ATK for 15s",
    },
    {
      id: "finale-bol-cleared-atk",
      label: "Cleared BoL Flat ATK (0-300)",
      control: "stacks",
      defaultValue: 150,
      max: 300,
      hint: "Flat ATK gained when Bond of Life is cleared (up to 150 at R1, up to 300 at R5)",
    }
  ],
  buffs: [
    {
      id: "finale-skill-atk",
      label: "ATK% (Finale of the Deep Skill)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "finale-skill-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['finale-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['finale-skill-active'] ?? 1) > 0; return on ? ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "finale-cleared-flat-atk",
      label: "Flat ATK from Cleared BoL (Finale)",
      stat: "atk",
      refinementValues: [150, 187.5, 225, 262.5, 300],
      isTeamBuff: false,
      conditionKey: "finale-bol-cleared-atk",
      compute: (r, ctx) => { const input = Number(ctx.inputs?.['finale-bol-cleared-atk'] ?? 150); const cap = [150, 187.5, 225, 262.5, 300][r - 1]; return Math.min(input, cap); },
    }
  ],
  
};
