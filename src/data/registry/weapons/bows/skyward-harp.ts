import type { WeaponConfig } from "../types";

export const skywardHarp: WeaponConfig = {
  id: "skyward-harp",
  name: "Skyward Harp",
  type: "Bow",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 22.1,
    baseValue: 4.8,
  },
  passiveName: "Echoing Ballad",
  passiveDesc:
    "Increases CRIT DMG by 20~40%. Hits have a 60~100% chance to inflict a small AoE attack dealing 125% Physical ATK DMG every 4~2s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "skyward-harp-crit-dmg",
      label: "CRIT DMG% (Skyward Harp)",
      stat: "critDmg",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
