import type { WeaponConfig } from "../types";

export const kagurasVerity: WeaponConfig = {
  id: "kaguras-verity",
  name: "Kagura's Verity",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Kagura Dance",
  passiveDesc:
    "Gains the Kagura Dance effect when using an Elemental Skill, causing the Elemental Skill DMG of the character equipping this weapon to increase by 12~24% for 16s. Max 3 stacks. At 3 stacks, this character will gain 12~24% All Elemental DMG Bonus.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "kagura-stacks",
      label: "Kagura Dance Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+12~24% Skill DMG per stack; +12~24% All Elem DMG at 3 stacks",
    }
  ],
  buffs: [
    {
      id: "kagura-skill-dmg",
      label: "Elemental Skill DMG Bonus (Kagura's Verity)",
      stat: "skillDmgBonus",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      conditionKey: "kagura-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['kagura-stacks'] ?? 3); return s * [12, 15, 18, 21, 24][r - 1]; },
    },
    {
      id: "kagura-elem-dmg",
      label: "All Elemental DMG Bonus (Kagura Max Stacks)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "kagura-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['kagura-stacks'] ?? 3); return s >= 3 ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  signatureFor: ["yae-miko"],
};
