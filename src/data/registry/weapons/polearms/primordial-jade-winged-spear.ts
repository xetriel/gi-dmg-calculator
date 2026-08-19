import type { WeaponConfig } from "../types";

export const primordialJadeWingedSpear: WeaponConfig = {
  id: "primordial-jade-winged-spear",
  name: "Primordial Jade Winged-Spear",
  type: "Polearm",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 22.1,
    baseValue: 4.8,
  },
  passiveName: "Eagle Spear of Justice",
  passiveDesc:
    "On hit, increases ATK by 3.2~6.0% for 6s. Max 7 stacks. At 7 stacks, DMG dealt is increased by 12~24%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "pjws-hit-stacks",
      label: "Eagle Spear Stacks (0-7)",
      control: "stacks",
      defaultValue: 7,
      max: 7,
      hint: "+3.2~6.0% ATK per stack. At 7 stacks, +12~24% All DMG bonus.",
    }
  ],
  buffs: [
    {
      id: "pjws-atk",
      label: "ATK% from Stacks (PJWS)",
      stat: "atk",
      refinementValues: [22.4, 27.3, 32.2, 37.1, 42],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "pjws-hit-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['pjws-hit-stacks'] ?? 7); const perStack = [3.2, 3.9, 4.6, 5.3, 6.0][r - 1]; return ((s * perStack) / 100) * ctx.baseAtk; },
    },
    {
      id: "pjws-max-dmg",
      label: "All DMG Bonus at 7 Stacks (PJWS)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "pjws-hit-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['pjws-hit-stacks'] ?? 7); return s >= 7 ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  signatureFor: ["xiao"],
};
