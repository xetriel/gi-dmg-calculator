import type { WeaponConfig } from "../types";

export const athameArtis: WeaponConfig = {
  id: "athame-artis",
  name: "Athame Artis",
  type: "Sword",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Ritual Cleaving",
  passiveDesc:
    "Increases Normal and Charged Attack DMG by 20~40%. When an Elemental Burst is used, increases ATK by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "athame-na-ca-dmg",
      label: "Normal/Charged Attack DMG Bonus",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "athame-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
