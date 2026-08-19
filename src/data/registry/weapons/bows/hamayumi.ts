import type { WeaponConfig } from "../types";

export const hamayumi: WeaponConfig = {
  id: "hamayumi",
  name: "Hamayumi",
  type: "Bow",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Full Draw",
  passiveDesc:
    "Increases Normal Attack DMG by 16~32% and Charged Attack DMG by 12~24%. When 100% Energy, this effect is increased by 100% (+32~64% NA, +24~48% CA).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "hamayumi-full-energy",
      label: "Character Energy is 100% (2x Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "Doubles NA and CA DMG bonuses",
    }
  ],
  buffs: [
    {
      id: "hamayumi-na-dmg",
      label: "Normal Attack DMG Bonus (Hamayumi)",
      stat: "normalDmgBonus",
      refinementValues: [32, 40, 48, 56, 64],
      isTeamBuff: false,
      conditionKey: "hamayumi-full-energy",
      compute: (r, ctx) => { const full = (ctx.inputs?.['hamayumi-full-energy'] ?? '1') === '1' || Number(ctx.inputs?.['hamayumi-full-energy'] ?? 1) > 0; const mult = full ? 2 : 1; return [16, 20, 24, 28, 32][r - 1] * mult; },
    },
    {
      id: "hamayumi-ca-dmg",
      label: "Charged Attack DMG Bonus (Hamayumi)",
      stat: "chargedDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "hamayumi-full-energy",
      compute: (r, ctx) => { const full = (ctx.inputs?.['hamayumi-full-energy'] ?? '1') === '1' || Number(ctx.inputs?.['hamayumi-full-energy'] ?? 1) > 0; const mult = full ? 2 : 1; return [12, 15, 18, 21, 24][r - 1] * mult; },
    }
  ],
  
};
