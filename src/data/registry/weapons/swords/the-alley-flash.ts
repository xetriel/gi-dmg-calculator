import type { WeaponConfig } from "../types";

export const theAlleyFlash: WeaponConfig = {
  id: "the-alley-flash",
  name: "The Alley Flash",
  type: "Sword",
  rarity: 4,
  baseAtk: 620,
  lvl1BaseAtk: 45,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 55,
    baseValue: 12,
  },
  passiveName: "Itinerant Hero",
  passiveDesc:
    "Increases DMG dealt by the character equipping this weapon by 12~24%. Taking DMG disables this effect for 5s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "alley-flash-dmg",
      label: "All DMG Bonus (The Alley Flash)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: r=>[12,15,18,21,24][r-1],
    }
  ],
  
};
