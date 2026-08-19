import type { WeaponConfig } from "../types";

export const theStringless: WeaponConfig = {
  id: "the-stringless",
  name: "The Stringless",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Songless Ballad",
  passiveDesc:
    "Increases Elemental Skill and Elemental Burst DMG by 24~48%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "stringless-skill-dmg",
      label: "Elemental Skill DMG Bonus (The Stringless)",
      stat: "skillDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      compute: r=>[24,30,36,42,48][r-1],
    },
    {
      id: "stringless-burst-dmg",
      label: "Elemental Burst DMG Bonus (The Stringless)",
      stat: "burstDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      compute: r=>[24,30,36,42,48][r-1],
    }
  ],
  
};
