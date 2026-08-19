import type { WeaponConfig } from "../types";

export const azurelight: WeaponConfig = {
  id: "azurelight",
  name: "Azurelight",
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
  passiveName: "Azure Brilliance",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. Elemental Skill hits increase CRIT DMG by 20~40% for 8s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "azurelight-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "azurelight-crit-dmg",
      label: "CRIT DMG%",
      stat: "critDmg",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
