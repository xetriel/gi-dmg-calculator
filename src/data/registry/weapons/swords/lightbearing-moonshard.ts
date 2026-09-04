import type { WeaponConfig } from "../types";

export const lightbearingMoonshard: WeaponConfig = {
  id: "lightbearing-moonshard",
  name: "Lightbearing Moonshard",
  type: "Sword",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "Legacy of Lang-Gan",
  passiveDesc:
    "Increases DEF by 20~40%. DMG inflicted by Lunar-Crystallize reactions increases by 64~128% for 5s after the equipping character uses an Elemental Skill.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "moonshard-def",
      label: "DEF% (Legacy of Lang-Gan)",
      stat: "def",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    },
  ],
};
