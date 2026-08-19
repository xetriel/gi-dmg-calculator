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
      id: "cinnabar-def",
      label: "Character Total DEF",
      control: "stacks",
      defaultValue: 2500,
      max: 10000,
      hint: "Total DEF used for Cinnabar flat Skill DMG bonus",
    }
  ],
  buffs: [
    {
      id: "cinnabar-flat-skill",
      label: "Flat Skill DMG from DEF (Cinnabar Spindle)",
      stat: "flatDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      compute: (r,ctx)=>{const def=Number(ctx.inputs?.["cinnabar-def"]??2500);const ratio=[.4,.5,.6,.7,.8][r-1];return def*ratio},
    }
  ],
  signatureFor: ["albedo"],
};
