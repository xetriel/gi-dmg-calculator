import type { WeaponConfig } from "../types";

export const prospectorsShovel: WeaponConfig = {
  id: "prospectors-shovel",
  name: "Prospector's Shovel",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Tunneler",
  passiveDesc:
    "Increases DEF by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "prospector-shovel-def",
      label: "DEF% (Prospector's Shovel)",
      stat: "def",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
