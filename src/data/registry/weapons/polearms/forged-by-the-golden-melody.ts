import type { WeaponConfig } from "../types";

export const forgedByTheGoldenMelody: WeaponConfig = {
  id: "forged-by-the-golden-melody",
  name: "Forged by the Golden Melody",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Golden Forge",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "golden-melody-elem",
      label: "All Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
