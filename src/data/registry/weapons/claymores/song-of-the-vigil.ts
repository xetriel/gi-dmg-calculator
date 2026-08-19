import type { WeaponConfig } from "../types";

export const songOfTheVigil: WeaponConfig = {
  id: "song-of-the-vigil",
  name: "Song of the Vigil",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Vigilant Song",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "vigil-elem-dmg",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
