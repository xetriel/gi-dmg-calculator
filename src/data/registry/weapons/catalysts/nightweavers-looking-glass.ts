import type { WeaponConfig } from "../types";

export const nightweaversLookingGlass: WeaponConfig = {
  id: "nightweavers-looking-glass",
  name: "Nightweaver's Looking Glass",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 265,
    baseValue: 58,
  },
  passiveName: "Millennial Hymn",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. Normal and Charged Attack DMG is increased by 20~40%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "nightweaver-elem-dmg",
      label: "All Elemental DMG Bonus (Nightweaver's Looking Glass)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "nightweaver-na-dmg",
      label: "Normal Attack DMG Bonus (Nightweaver's Looking Glass)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "nightweaver-ca-dmg",
      label: "Charged Attack DMG Bonus (Nightweaver's Looking Glass)",
      stat: "chargedDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
