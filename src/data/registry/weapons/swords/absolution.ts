import type { WeaponConfig } from "../types";

export const absolution: WeaponConfig = {
  id: "absolution",
  name: "Absolution",
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
  passiveName: "Deathly Pact",
  passiveDesc:
    "CRIT DMG is increased by 20~40%. When the value of a Bond of Life increases, the wielder deals 16~32% increased DMG for 6s. Max 3 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "absolution-stacks",
      label: "Bond of Life Increase Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+16~32% All DMG bonus per stack (up to +48~96%)",
    }
  ],
  buffs: [
    {
      id: "absolution-crit-dmg",
      label: "CRIT DMG% (Absolution)",
      stat: "critDmg",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "absolution-dmg-bonus",
      label: "All DMG Bonus (Absolution BoL Stacks)",
      stat: "dmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "absolution-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['absolution-stacks'] ?? 3); return s * [16, 20, 24, 28, 32][r - 1]; },
    }
  ],
  signatureFor: ["clorinde"],
};
