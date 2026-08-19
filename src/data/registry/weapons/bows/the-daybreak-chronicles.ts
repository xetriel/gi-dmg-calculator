import type { WeaponConfig } from "../types";

export const theDaybreakChronicles: WeaponConfig = {
  id: "the-daybreak-chronicles",
  name: "The Daybreak Chronicles",
  type: "Bow",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Ode Beyond Time",
  passiveDesc:
    "3s after leaving combat, increases Normal Attack, Elemental Skill, and Elemental Burst DMG by 60~120%. In combat, decreases by 10% per second. Hitting opponents increases the corresponding attack type's DMG by 10% per hit (20% if Hexerei: Secret Rite) up to +60~120%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "daybreak-na-buff",
      label: "Normal Attack DMG Bonus (+0~120%)",
      control: "stacks",
      defaultValue: 60,
      max: 120,
      hint: "Current NA DMG bonus maintained (+60~120%)",
    },
    {
      id: "daybreak-skill-buff",
      label: "Elemental Skill DMG Bonus (+0~120%)",
      control: "stacks",
      defaultValue: 60,
      max: 120,
      hint: "Current Skill DMG bonus maintained (+60~120%)",
    },
    {
      id: "daybreak-burst-buff",
      label: "Elemental Burst DMG Bonus (+0~120%)",
      control: "stacks",
      defaultValue: 60,
      max: 120,
      hint: "Current Burst DMG bonus maintained (+60~120%)",
    }
  ],
  buffs: [
    {
      id: "daybreak-na-dmg",
      label: "Normal Attack DMG Bonus (The Daybreak Chronicles)",
      stat: "normalDmgBonus",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      conditionKey: "daybreak-na-buff",
      compute: (r, ctx) => { const cap = [60, 75, 90, 105, 120][r - 1]; const val = Number(ctx.inputs?.['daybreak-na-buff'] ?? 60); return Math.min(val, cap); },
    },
    {
      id: "daybreak-skill-dmg",
      label: "Elemental Skill DMG Bonus (The Daybreak Chronicles)",
      stat: "skillDmgBonus",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      conditionKey: "daybreak-skill-buff",
      compute: (r, ctx) => { const cap = [60, 75, 90, 105, 120][r - 1]; const val = Number(ctx.inputs?.['daybreak-skill-buff'] ?? 60); return Math.min(val, cap); },
    },
    {
      id: "daybreak-burst-dmg",
      label: "Elemental Burst DMG Bonus (The Daybreak Chronicles)",
      stat: "burstDmgBonus",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      conditionKey: "daybreak-burst-buff",
      compute: (r, ctx) => { const cap = [60, 75, 90, 105, 120][r - 1]; const val = Number(ctx.inputs?.['daybreak-burst-buff'] ?? 60); return Math.min(val, cap); },
    }
  ],
  signatureFor: ["venti"],
};
