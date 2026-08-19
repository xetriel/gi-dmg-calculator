import type { WeaponConfig } from "../types";

export const exaiphanesBlade: WeaponConfig = {
  id: "exaiphanes-blade",
  name: "Exaiphanes Blade",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Sudden Manifestation",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. After using an Elemental Skill, increases Normal and Charged Attack DMG by 20~40% for 10s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "exaiphanes-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "exaiphanes-na-ca",
      label: "Normal/Charged Attack DMG Bonus",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
