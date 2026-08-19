import type { WeaponConfig } from "../types";

export const fracturedHalo: WeaponConfig = {
  id: "fractured-halo",
  name: "Fractured Halo",
  type: "Polearm",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Broken Orbit",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. When an Elemental Skill hits an opponent, ATK is increased by 16~32% for 10s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "fractured-halo-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "fractured-halo-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
