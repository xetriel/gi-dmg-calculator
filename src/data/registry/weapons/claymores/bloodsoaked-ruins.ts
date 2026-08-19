import type { WeaponConfig } from "../types";

export const bloodsoakedRuins: WeaponConfig = {
  id: "bloodsoaked-ruins",
  name: "Bloodsoaked Ruins",
  type: "Claymore",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Ancient Ruin",
  passiveDesc:
    "ATK is increased by 20~40%. When defeating an opponent, All Elemental DMG Bonus is increased by 20~40% for 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "bloodsoaked-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "bloodsoaked-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
