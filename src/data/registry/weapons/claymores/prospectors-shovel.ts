import type { WeaponConfig } from "../types";

export const prospectorsShovel: WeaponConfig = {
  id: "prospectors-shovel",
  name: "Prospector's Shovel",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 51.7,
    baseValue: 11.3,
  },
  passiveName: "Tunneler",
  passiveDesc:
    "Increases DEF by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "prospector-shovel-def",
      label: "DEF%",
      stat: "def",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
