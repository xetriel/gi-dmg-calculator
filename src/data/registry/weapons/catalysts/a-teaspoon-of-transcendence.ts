import type { WeaponConfig } from "../types";

export const aTeaspoonOfTranscendence: WeaponConfig = {
  id: "a-teaspoon-of-transcendence",
  name: "A Teaspoon of Transcendence",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Tea-Time Melody",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. After using an Elemental Skill, ATK is increased by 16~32% for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "teaspoon-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "teaspoon-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
