import type { WeaponConfig } from "../types";

export const emberwell: WeaponConfig = {
  id: "emberwell",
  name: "Emberwell",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Ember Surge",
  passiveDesc:
    "Increases Pyro DMG Bonus by 12~24%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "emberwell-pyro-dmg",
      label: "Pyro DMG Bonus (Emberwell)",
      stat: "pyroDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
