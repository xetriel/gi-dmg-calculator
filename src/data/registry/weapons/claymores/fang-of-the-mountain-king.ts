import type { WeaponConfig } from "../types";

export const fangOfTheMountainKing: WeaponConfig = {
  id: "fang-of-the-mountain-king",
  name: "Fang of the Mountain King",
  type: "Claymore",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Turquoise Dawn",
  passiveDesc:
    "Gain 1 stack of Canopy's Favor when an Elemental Skill hits an opponent. Max 6 stacks. At 6 stacks, Elemental Skill and Elemental Burst DMG is increased by 48~96%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mountain-king-stacks",
      label: "Canopy's Favor Stacks (0-6)",
      control: "stacks",
      defaultValue: 6,
      max: 6,
      hint: "+8~16% Skill & Burst DMG per stack (up to +48~96%)",
    }
  ],
  buffs: [
    {
      id: "mountain-king-skill-dmg",
      label: "Elemental Skill DMG Bonus (Fang of Mountain King)",
      stat: "skillDmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "mountain-king-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['mountain-king-stacks'] ?? 6); return s * [8, 10, 12, 14, 16][r - 1]; },
    },
    {
      id: "mountain-king-burst-dmg",
      label: "Elemental Burst DMG Bonus (Fang of Mountain King)",
      stat: "burstDmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "mountain-king-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['mountain-king-stacks'] ?? 6); return s * [8, 10, 12, 14, 16][r - 1]; },
    }
  ],
  signatureFor: ["kinich"],
};
