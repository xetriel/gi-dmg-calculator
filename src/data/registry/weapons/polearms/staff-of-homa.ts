import type { WeaponConfig } from "../types";

export const staffOfHoma: WeaponConfig = {
  id: "staff-of-homa",
  name: "Staff of Homa",
  type: "Polearm",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Reckless Cinnabar",
  passiveDesc:
    "HP increased by 20~40%. Additionally, provides an ATK Bonus based on 0.8~1.6% of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional 1~1.8% of Max HP.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "homa-wielder-max-hp",
      label: "Character Max HP",
      control: "stacks",
      defaultValue: 35000,
      max: 100000,
      hint: "Max HP used for flat ATK bonus conversion",
    },
    {
      id: "homa-low-hp",
      label: "HP < 50% (+1.0~1.8% extra ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "Low HP ATK bonus trigger",
    }
  ],
  buffs: [
    {
      id: "homa-hp",
      label: "HP% (Staff of Homa)",
      stat: "hp",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "homa-base-atk-from-hp",
      label: "Flat ATK from Max HP (Homa Base)",
      stat: "atk",
      refinementValues: [0.8, 1, 1.2, 1.4, 1.6],
      isTeamBuff: false,
      compute: (r, ctx) => { const hp = Number(ctx.inputs?.['homa-wielder-max-hp'] ?? 35000); const ratio = [0.008, 0.01, 0.012, 0.014, 0.016][r - 1]; return hp * ratio; },
    },
    {
      id: "homa-low-hp-atk",
      label: "Flat ATK from Max HP (Homa Low HP)",
      stat: "atk",
      refinementValues: [1, 1.2, 1.4, 1.6, 1.8],
      isTeamBuff: false,
      conditionKey: "homa-low-hp",
      compute: (r, ctx) => { const on = (ctx.inputs?.['homa-low-hp'] ?? '1') === '1' || Number(ctx.inputs?.['homa-low-hp'] ?? 1) > 0; if (!on) return 0; const hp = Number(ctx.inputs?.['homa-wielder-max-hp'] ?? 35000); const ratio = [0.01, 0.012, 0.014, 0.016, 0.018][r - 1]; return hp * ratio; },
    }
  ],
  signatureFor: ["hu-tao"],
};
