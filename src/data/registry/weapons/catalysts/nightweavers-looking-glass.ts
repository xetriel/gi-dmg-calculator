import type { WeaponConfig } from "../types";

export const nightweaversLookingGlass: WeaponConfig = {
  id: "nightweavers-looking-glass",
  name: "Nightweaver's Looking Glass",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "Nocturnal Vision",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. When an Elemental Burst hits opponents, increases Elemental Mastery by 80~160 for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "nightweaver-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "nightweaver-em",
      label: "Elemental Mastery",
      stat: "em",
      refinementValues: [80, 100, 120, 140, 160],
      isTeamBuff: false,
      compute: (r) => [80, 100, 120, 140, 160][r - 1],
    }
  ],
  
};
