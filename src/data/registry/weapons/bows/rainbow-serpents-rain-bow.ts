import type { WeaponConfig } from "../types";

export const rainbowSerpentsRainBow: WeaponConfig = {
  id: "rainbow-serpents-rain-bow",
  name: "Rainbow Serpent's Rain Bow",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 110,
    baseValue: 24,
  },
  passiveName: "Prismatic Rain",
  passiveDesc:
    "Triggering an Elemental Reaction increases All Elemental DMG Bonus by 12~24% for 8s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "rainbow-serpent-elem",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
