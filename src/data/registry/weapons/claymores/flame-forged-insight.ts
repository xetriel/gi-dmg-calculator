import type { WeaponConfig } from "../types";

export const flameForgedInsight: WeaponConfig = {
  id: "flame-forged-insight",
  name: "Flame-Forged Insight",
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
  passiveName: "Flame Forging",
  passiveDesc:
    "Increases Pyro DMG Bonus by 12~24%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "flame-insight-pyro-dmg",
      label: "Pyro DMG Bonus (Flame-Forged Insight)",
      stat: "pyroDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
