import type { WeaponConfig } from "../types";

export const flowingPurity: WeaponConfig = {
  id: "flowing-purity",
  name: "Flowing Purity",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Unfinished Masterpiece",
  passiveDesc:
    "Using an Elemental Skill increases All Elemental DMG Bonus by 8~16% for 15s and grants a Bond of Life equal to 24% of Max HP. When BoL is cleared, grants +2~4% All Elemental DMG Bonus per 1,000 HP cleared (up to +12~24%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "flowing-purity-skill",
      label: "Elemental Skill Used (+8~16% Elem DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+8~16% All Elemental DMG Bonus for 15s",
    },
    {
      id: "flowing-purity-bol-cleared",
      label: "Bond of Life Cleared Max Stack (+12~24% Elem DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% All Elemental DMG Bonus when BoL is cleared",
    }
  ],
  buffs: [
    {
      id: "flowing-purity-skill-dmg",
      label: "All Elemental DMG Bonus (Flowing Purity Skill)",
      stat: "dmgBonus",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      conditionKey: "flowing-purity-skill",
      compute: (r, ctx) => { const on = (ctx.inputs?.['flowing-purity-skill'] ?? '1') === '1' || Number(ctx.inputs?.['flowing-purity-skill'] ?? 1) > 0; return on ? [8, 10, 12, 14, 16][r - 1] : 0; },
    },
    {
      id: "flowing-purity-bol-dmg",
      label: "All Elemental DMG Bonus (Flowing Purity BoL Cleared)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "flowing-purity-bol-cleared",
      compute: (r, ctx) => { const on = (ctx.inputs?.['flowing-purity-bol-cleared'] ?? '1') === '1' || Number(ctx.inputs?.['flowing-purity-bol-cleared'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  
};
