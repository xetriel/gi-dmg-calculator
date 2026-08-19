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
    "On hit, increases ATK by 3.2~6.0% for 6s. Max 7 stacks. This effect can only occur once every 0.3s. While in possession of the maximum possible stacks, DMG dealt is increased by 12~24%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "pjws-stacks",
      label: "Eagle Spear Stacks (0-7)",
      control: "stacks",
      defaultValue: 7,
      max: 7,
      hint: "+3.2~6.0% ATK per hit stack; +12~24% All DMG at 7 stacks",
    }
  ],
  buffs: [
    {
      id: "pjws-atk",
      label: "ATK% (Primordial Jade Winged-Spear Stacks)",
      stat: "atk",
      refinementValues: [22.4, 27.3, 32.2, 37.1, 42],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "pjws-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['pjws-stacks'] ?? 7); const perStack = [3.2, 3.9, 4.6, 5.3, 6.0][r - 1]; return ((s * perStack) / 100) * ctx.baseAtk; },
    },
    {
      id: "pjws-full-stack-dmg",
      label: "All DMG Bonus (PJWS Max Stacks)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "pjws-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['pjws-stacks'] ?? 7); return s >= 7 ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  signatureFor: ["xiao"],
};
