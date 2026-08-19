import type { WeaponConfig } from "../types";

export const whiteIronGreatsword: WeaponConfig = {
  id: "white-iron-greatsword",
  name: "White Iron Greatsword",
  type: "Claymore",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 43.9,
    baseValue: 9.6,
  },
  passiveName: "Cull the Weak",
  passiveDesc:
    "Defeating an opponent restores 8~16% HP.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
