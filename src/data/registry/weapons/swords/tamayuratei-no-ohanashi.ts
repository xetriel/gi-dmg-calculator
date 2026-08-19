import type { WeaponConfig } from "../types";

export const tamayurateiNoOhanashi: WeaponConfig = {
  id: "tamayuratei-no-ohanashi",
  name: "Tamayuratei no Ohanashi",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Fleeting Story",
  passiveDesc:
    "Triggering an Elemental Reaction increases Elemental Skill DMG by 16~32% for 8s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "tamayuratei-skill-dmg",
      label: "Elemental Skill DMG Bonus",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
