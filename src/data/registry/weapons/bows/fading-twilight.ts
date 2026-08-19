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
    "Has 3 states: Evengleam, Afterglow, and Dawnblaze, which increase DMG dealt by 6/10/14% ~ 12/20/28% respectively. State changes upon hitting opponents every 7s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "twilight-state",
      label: "Twilight State (1=Evengleam, 2=Afterglow, 3=Dawnblaze)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      min: 1,
      hint: "Tiered All DMG Bonus (+6/10/14% at R1, up to +12/20/28% at R5)",
    }
  ],
  buffs: [
    {
      id: "twilight-dmg",
      label: "All DMG Bonus (Fading Twilight)",
      stat: "dmgBonus",
      refinementValues: [14, 17.5, 21, 24.5, 28],
      isTeamBuff: false,
      conditionKey: "twilight-state",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.["twilight-state"] ?? 3); const tiers: Record<number, number[]> = { 1: [6, 7.5, 9, 10.5, 12], 2: [10, 12.5, 15, 17.5, 20], 3: [14, 17.5, 21, 24.5, 28] }; return (tiers[s] ?? tiers[3])[r - 1]; },
    }
  ],
  
};
