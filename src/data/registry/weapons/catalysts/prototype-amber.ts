import type { WeaponConfig } from "../types";

export const prototypeAmber: WeaponConfig = {
  id: "prototype-amber",
  name: "Prototype Amber",
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
  passiveName: "Gilding",
  passiveDesc:
    "Using an Elemental Burst regenerates 4~6 Energy every 2s for 6s. All party members will regenerate 4~6% HP every 2s for this duration.",
  isSupport: true,
  buffType: "team",
  buffs: [

  ],
  
};
