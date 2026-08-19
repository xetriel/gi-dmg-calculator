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
  passiveName: "Truth Seeker",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. When triggering an Elemental Reaction, increases Elemental Mastery by 80~160 for 10s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "reliquary-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "reliquary-em",
      label: "Elemental Mastery",
      stat: "em",
      refinementValues: [80, 100, 120, 140, 160],
      isTeamBuff: false,
      compute: (r) => [80, 100, 120, 140, 160][r - 1],
    }
  ],
  
};
