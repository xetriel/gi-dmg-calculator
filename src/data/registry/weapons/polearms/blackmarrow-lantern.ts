import type { WeaponConfig } from "../types";

export const blackmarrowLantern: WeaponConfig = {
  id: "blackmarrow-lantern",
  name: "Blackmarrow Lantern",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Marrow Flame",
  passiveDesc:
    "Increases Elemental Skill DMG by 16~32% for 10s after triggering an Elemental Reaction.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "blackmarrow-skill-dmg",
      label: "Elemental Skill DMG Bonus",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
