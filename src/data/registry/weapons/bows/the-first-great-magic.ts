import type { WeaponConfig } from "../types";

export const theFirstGreatMagic: WeaponConfig = {
  id: "the-first-great-magic",
  name: "The First Great Magic",
  type: "Bow",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Parsifal the Great",
  passiveDesc:
    "Charged Attack DMG increased by 16~32%. For every party member with the same Elemental Type as the wielder (including wielder), gain 1 Gimmick stack: ATK increased by 16/32/48% ~ 32/64/96%. For every member with a different type, gain 1 Theatrics stack: Movement SPD increased by 4/7/10% ~ 12/15/18%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "great-magic-same-stacks",
      label: "Same-Element Party Members (1-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+16/32/48% ATK for 1/2/3 matching element members",
    }
  ],
  buffs: [
    {
      id: "great-magic-ca-dmg",
      label: "Charged Attack DMG Bonus (The First Great Magic)",
      stat: "chargedDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "great-magic-atk",
      label: "ATK% (The First Great Magic Stacks)",
      stat: "atk",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "great-magic-same-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['great-magic-same-stacks'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 1: [16, 20, 24, 28, 32], 2: [32, 40, 48, 56, 64], 3: [48, 60, 72, 84, 96] }; const pct = (tiers[s] ?? tiers[3])[r - 1]; return (pct / 100) * ctx.baseAtk; },
    }
  ],
  signatureFor: ["lyney"],
};
