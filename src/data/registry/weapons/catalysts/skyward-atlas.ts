import type { WeaponConfig } from "../types";

export const skywardAtlas: WeaponConfig = {
  id: "skyward-atlas",
  name: "Skyward Atlas",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Wandering Clouds",
  passiveDesc:
    "Increases Elemental DMG Bonus by 12~24%. Normal Attack hits have a 50% chance to earn the favor of the clouds, actively seeking surrounding opponents to deal 160~320% ATK DMG for 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "skyward-atlas-elem-dmg",
      label: "All Elemental DMG Bonus (Skyward Atlas)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
