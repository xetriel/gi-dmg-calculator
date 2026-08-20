import type { WeaponConfig } from "../types";

export const kitainCrossSpear: WeaponConfig = {
  id: "kitain-cross-spear",
  name: "Kitain Cross Spear",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 110,
    baseValue: 24,
  },
  passiveName: "Samurai Conduct",
  passiveDesc:
    "Increases Elemental Skill DMG by 6~12%. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates 3~5 Energy every 2s for 6s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "kitain-skill-dmg",
      label: "Elemental Skill DMG Bonus (Kitain Cross Spear)",
      stat: "skillDmgBonus",
      refinementValues: [6, 7.5, 9, 10.5, 12],
      isTeamBuff: false,
      compute: (r) => [6, 7.5, 9, 10.5, 12][r - 1],
    }
  ],
  
};
