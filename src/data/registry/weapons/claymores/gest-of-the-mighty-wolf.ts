import type { WeaponConfig } from "../types";

export const gestOfTheMightyWolf: WeaponConfig = {
  id: "gest-of-the-mighty-wolf",
  name: "Gest of the Mighty Wolf",
  type: "Claymore",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Wolf's Song",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. Normal and Charged Attack hits increase ATK by 16~32% for 8s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "mighty-wolf-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "mighty-wolf-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
