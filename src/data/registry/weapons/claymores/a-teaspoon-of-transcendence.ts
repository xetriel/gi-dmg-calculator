import type { WeaponConfig } from "../types";

export const aTeaspoonOfTranscendence: WeaponConfig = {
  id: "a-teaspoon-of-transcendence",
  name: "A Teaspoon of Transcendence",
  type: "Claymore",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "White Fairy's Queening",
  passiveDesc:
    "ATK increased by 28~56%. Each time Charged Attack hits, gain \"Surmount\" for 5s: Stellar-Conduct and Stellar Swirl DMG increased by 16~32% (max 3 stacks).",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "teaspoon-atk",
      label: "ATK% (White Fairy's Queening)",
      stat: "atk",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([28, 35, 42, 49, 56][r - 1] / 100) * ctx.baseAtk,
    },
  ],
};
