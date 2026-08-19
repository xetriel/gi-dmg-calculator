import type { WeaponConfig } from "../types";

export const fadingTwilight: WeaponConfig = {
  id: "fading-twilight",
  name: "Fading Twilight",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Radiance Infusion",
  passiveDesc:
    "Has 3 states: Evengleam (+6~12% DMG), Afterglow (+10~20% DMG), Dawnblaze (+14~28% DMG).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "fading-twilight-state",
      label: "Radiance Infusion State (1: Evengleam, 2: Afterglow, 3: Dawnblaze)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "1: +6~12% DMG, 2: +10~20% DMG, 3: +14~28% DMG",
    }
  ],
  buffs: [
    {
      id: "twilight-dmg",
      label: "All DMG Bonus (Fading Twilight)",
      stat: "dmgBonus",
      refinementValues: [14, 17.5, 21, 24.5, 28],
      isTeamBuff: false,
      conditionKey: "fading-twilight-state",
      compute: (r, ctx) => { const state = Number(ctx.inputs?.['fading-twilight-state'] ?? 3); const map: Record<number, number[]> = { 1: [6, 7.5, 9, 10.5, 12], 2: [10, 12.5, 15, 17.5, 20], 3: [14, 17.5, 21, 24.5, 28] }; return (map[state] || [0, 0, 0, 0, 0])[r - 1] || 0; },
    }
  ],
  
};
