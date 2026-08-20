import type { WeaponConfig } from "../types";

export const sturdyBone: WeaponConfig = {
  id: "sturdy-bone",
  name: "Sturdy Bone",
  type: "Sword",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Sprint and Strike",
  passiveDesc:
    "Sprinting or Alternate Sprinting Stamina consumption is decreased by 15%. After sprinting, Normal and Charged Attack DMG is increased by 16~32% of ATK for 6s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "sturdy-sprint-active",
      label: "Post-Sprint Active (+16~32% of ATK as Flat NA/CA DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% of ATK as flat NA/CA DMG for 6s",
    }
  ],
  buffs: [
    {
      id: "sturdy-bone-na-flat",
      label: "Normal Attack Flat DMG from ATK (Sturdy Bone)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "sturdy-sprint-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['sturdy-sprint-active'] ?? '1') === '1' || Number(ctx.inputs?.['sturdy-sprint-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "sturdy-bone-ca-flat",
      label: "Charged Attack Flat DMG from ATK (Sturdy Bone)",
      stat: "chargedDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "sturdy-sprint-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['sturdy-sprint-active'] ?? '1') === '1' || Number(ctx.inputs?.['sturdy-sprint-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
