import type { WeaponConfig } from "../types";

export const toukabouShigure: WeaponConfig = {
  id: "toukabou-shigure",
  name: "Toukabou Shigure",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Kaidan: Rain-Tied Yuka",
  passiveDesc:
    "After an attack hits an opponent, it will inflict an instance of Cursed Parasol upon one of them for 10s. The character wielding this weapon will deal 16~32% more DMG to the opponent affected by Cursed Parasol.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "cursed-parasol-active",
      label: "Target Affected by Cursed Parasol",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% DMG dealt to the afflicted opponent",
    }
  ],
  buffs: [
    {
      id: "shigure-dmg-bonus",
      label: "All DMG Bonus vs Parasol Target (Toukabou Shigure)",
      stat: "dmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "cursed-parasol-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['cursred-parasol-active'] ?? ctx.inputs?.['cursed-parasol-active'] ?? '1') === '1' || Number(ctx.inputs?.['cursed-parasol-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    }
  ],
  
};
