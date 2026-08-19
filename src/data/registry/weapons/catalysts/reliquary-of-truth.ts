import type { WeaponConfig } from "../types";

export const reliquaryOfTruth: WeaponConfig = {
  id: "reliquary-of-truth",
  name: "Reliquary of Truth",
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
  passiveName: "Ancient Truth",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. Elemental Skill and Burst DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "reliquary-elem-dmg",
      label: "All Elemental DMG Bonus (Reliquary of Truth)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "reliquary-skill-dmg",
      label: "Elemental Skill DMG Bonus (Reliquary of Truth)",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "reliquary-burst-dmg",
      label: "Elemental Burst DMG Bonus (Reliquary of Truth)",
      stat: "burstDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
