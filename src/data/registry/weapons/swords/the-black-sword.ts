import type { WeaponConfig } from "../types";

export const theBlackSword: WeaponConfig = {
  id: "the-black-sword",
  name: "The Black Sword",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Justice",
  passiveDesc:
    "Increases DMG dealt by Normal and Charged Attacks by 20~40%. Additionally, regenerates 60~100% of ATK as HP when Normal and Charged Attacks score a CRIT Hit.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "black-sword-na-dmg",
      label: "Normal Attack DMG Bonus (The Black Sword)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: r=>[20,25,30,35,40][r-1],
    },
    {
      id: "black-sword-ca-dmg",
      label: "Charged Attack DMG Bonus (The Black Sword)",
      stat: "chargedDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: r=>[20,25,30,35,40][r-1],
    }
  ],
  
};
