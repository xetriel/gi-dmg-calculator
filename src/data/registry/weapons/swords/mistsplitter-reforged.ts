import type { WeaponConfig } from "../types";

export const mistsplitterReforged: WeaponConfig = {
  id: "mistsplitter-reforged",
  name: "Mistsplitter Reforged",
  type: "Sword",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Mistsplitter's Edge",
  passiveDesc:
    "Gain 12~24% Elemental DMG Bonus for all elements and receive the might of the Mistsplitter's Emblem. At stack levels 1/2/3, Mistsplitter's Emblem provides 8/16/28% ~ 16/32/56% Elemental DMG Bonus for the character's Elemental Type.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mistsplitter-stacks",
      label: "Mistsplitter's Emblem Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+8/16/28% Elemental DMG Bonus at R1 (up to +16/32/56% at R5)",
    }
  ],
  buffs: [
    {
      id: "mistsplitter-base-elem",
      label: "All Elemental DMG Bonus (Mistsplitter Base)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "mistsplitter-emblem-dmg",
      label: "Elemental DMG Bonus (Mistsplitter Stacks)",
      stat: "dmgBonus",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      conditionKey: "mistsplitter-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['mistsplitter-stacks'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 0: [0, 0, 0, 0, 0], 1: [8, 10, 12, 14, 16], 2: [16, 20, 24, 28, 32], 3: [28, 35, 42, 49, 56] }; return (tiers[s] ?? tiers[3])[r - 1]; },
    }
  ],
  signatureFor: ["kamisato-ayaka"],
};
