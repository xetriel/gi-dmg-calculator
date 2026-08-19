import type { WeaponConfig } from "../types";

export const jadeVista: WeaponConfig = {
  id: "jade-vista",
  name: "Jade Vista",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Jade Sight",
  passiveDesc:
    "Increases Max HP by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "jade-vista-hp",
      label: "HP%",
      stat: "hp",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
