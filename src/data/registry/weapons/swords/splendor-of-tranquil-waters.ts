import type { WeaponConfig } from "../types";

export const splendorOfTranquilWaters: WeaponConfig = {
  id: "splendor-of-tranquil-waters",
  name: "Splendor of Tranquil Waters",
  type: "Sword",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "Dawn and Dusk by the Lake",
  passiveDesc:
    "When HP increases or decreases, Elemental Skill DMG is increased by 8~16% for 6s (max 3 stacks). When party members' HP increases or decreases, wielder's Max HP is increased by 14~28% for 6s (max 2 stacks).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "splendor-skill-stacks",
      label: "Wielder HP Change Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+8~16% Elemental Skill DMG per stack (up to +24~48%)",
    },
    {
      id: "splendor-hp-stacks",
      label: "Party Member HP Change Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+14~28% Max HP per stack (up to +28~56%)",
    }
  ],
  buffs: [
    {
      id: "splendor-skill-dmg",
      label: "Elemental Skill DMG Bonus (Splendor)",
      stat: "skillDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "splendor-skill-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['splendor-skill-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; },
    },
    {
      id: "splendor-hp",
      label: "Max HP% (Splendor Party Stacks)",
      stat: "hp",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "splendor-hp-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['splendor-hp-stacks'] ?? 2); return s * [14, 17.5, 21, 24.5, 28][r - 1]; },
    }
  ],
  signatureFor: ["furina"],
};
