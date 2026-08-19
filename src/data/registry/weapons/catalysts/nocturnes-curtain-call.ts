import type { WeaponConfig } from "../types";

export const nocturnesCurtainCall: WeaponConfig = {
  id: "nocturnes-curtain-call",
  name: "Nocturne's Curtain Call",
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
  passiveName: "Curtain Call",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. After using an Elemental Skill, increases Normal and Charged Attack DMG by 20~40% for 10s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "nocturne-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "nocturne-na-ca",
      label: "Normal/Charged Attack DMG Bonus",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
