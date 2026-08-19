import type { WeaponConfig } from "../types";

export const fracturedHalo: WeaponConfig = {
  id: "fractured-halo",
  name: "Fractured Halo",
  type: "Polearm",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Halo Fracture",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. Normal and Charged Attack DMG is increased by 20~40%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "halo-elem-dmg",
      label: "All Elemental DMG Bonus (Fractured Halo)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "halo-na-dmg",
      label: "Normal Attack DMG Bonus (Fractured Halo)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "halo-ca-dmg",
      label: "Charged Attack DMG Bonus (Fractured Halo)",
      stat: "chargedDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
