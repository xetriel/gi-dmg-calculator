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
  passiveName: "Blackmarrow Radiance",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "blackmarrow-elem-dmg",
      label: "All Elemental DMG Bonus (Blackmarrow Lantern)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
