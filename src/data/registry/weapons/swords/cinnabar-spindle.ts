import type { WeaponConfig } from "../types";

export const cinnabarSpindle: WeaponConfig = {
  id: "cinnabar-spindle",
  name: "Cinnabar Spindle",
  type: "Sword",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 69,
    baseValue: 15,
  },
  passiveName: "Spotless Heart",
  passiveDesc:
    "Elemental Skill DMG is increased by 40~80% of DEF. The effect will be triggered no more than once every 1.5s and will be cleared 0.1s after the Elemental Skill deals DMG.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "cinnabar-wielder-def",
      label: "Character Total DEF",
      control: "stacks",
      defaultValue: 2500,
      max: 5000,
      hint: "Total DEF used to calculate flat Elemental Skill DMG bonus",
    }
  ],
  buffs: [
    {
      id: "cinnabar-skill-flat",
      label: "Elemental Skill Flat DMG from DEF (Cinnabar Spindle)",
      stat: "skillDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      compute: (r, ctx) => { const def = Number(ctx.inputs?.['cinnabar-wielder-def'] ?? 2500); const ratio = [0.4, 0.5, 0.6, 0.7, 0.8][r - 1]; return def * ratio; },
    }
  ],
  signatureFor: ["albedo"],
};
