import type { WeaponConfig } from "../types";

export const jadefallsSplendor: WeaponConfig = {
  id: "jadefalls-splendor",
  name: "Jadefall's Splendor",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 49.6,
    baseValue: 10.8,
  },
  passiveName: "Primordial Jade Regalia",
  passiveDesc:
    "For 3s after using an Elemental Burst or creating a shield, gain 0.3~1.1% corresponding Elemental DMG Bonus for every 1,000 Max HP (up to 12~44%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "jadefall-wielder-hp",
      label: "Character Total Max HP (e.g. 50000)",
      control: "stacks",
      defaultValue: 50000,
      max: 80000,
      hint: "Max HP used to compute Elemental DMG bonus",
    },
    {
      id: "jadefall-burst-shield-active",
      label: "Burst/Shield Trigger Active (3s)",
      control: "toggle",
      defaultValue: 1,
      hint: "Grants Elemental DMG Bonus based on Max HP",
    }
  ],
  buffs: [
    {
      id: "jadefall-elem-dmg",
      label: "Elemental DMG Bonus from Max HP (Jadefall's Splendor)",
      stat: "dmgBonus",
      refinementValues: [12, 20, 28, 36, 44],
      isTeamBuff: false,
      conditionKey: "jadefall-burst-shield-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['jadefall-burst-shield-active'] ?? '1') === '1' || Number(ctx.inputs?.['jadefall-burst-shield-active'] ?? 1) > 0; if (!on) return 0; const hp = Number(ctx.inputs?.['jadefall-wielder-hp'] ?? 50000); const ratio = [0.3, 0.5, 0.7, 0.9, 1.1][r - 1]; const cap = [12, 20, 28, 36, 44][r - 1]; return Math.min((hp / 1000) * ratio, cap); },
    }
  ],
  signatureFor: ["baizhu"],
};
