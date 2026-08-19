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
    "For 3s after using an Elemental Burst or creating a shield, the equipping character can gain the Primordial Jade Regalia effect: Restore 4.5~6.5 Energy every 2.5s, and gain 0.3~1.1% Elemental DMG Bonus for their corresponding Elemental Type for every 1,000 Max HP they possess, up to 12~44%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "jadefall-max-hp",
      label: "Character Max HP",
      control: "stacks",
      defaultValue: 50000,
      max: 100000,
      hint: "Max HP used for Elemental DMG Bonus conversion",
    }
  ],
  buffs: [
    {
      id: "jadefall-elem-dmg",
      label: "Elemental DMG Bonus (Jadefall's Splendor)",
      stat: "dmgBonus",
      refinementValues: [12, 20, 28, 36, 44],
      isTeamBuff: false,
      compute: (r, ctx) => { const hp = Number(ctx.inputs?.['jadefall-max-hp'] ?? 50000); const per1k = [0.3, 0.5, 0.7, 0.9, 1.1][r - 1]; const cap = [12, 20, 28, 36, 44][r - 1]; return Math.min((hp / 1000) * per1k, cap); },
    }
  ],
  signatureFor: ["baizhu"],
};
