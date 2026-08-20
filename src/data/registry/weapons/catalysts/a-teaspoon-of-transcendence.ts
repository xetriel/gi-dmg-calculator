import type { WeaponConfig } from "../types";

export const aTeaspoonOfTranscendence: WeaponConfig = {
  id: "a-teaspoon-of-transcendence",
  name: "A Teaspoon of Transcendence",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Transcendence",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "teaspoon-elem-dmg",
      label: "All Elemental DMG Bonus (A Teaspoon of Transcendence)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
