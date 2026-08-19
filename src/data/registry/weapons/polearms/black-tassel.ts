import type { WeaponConfig } from "../types";

export const blackTassel: WeaponConfig = {
  id: "black-tassel",
  name: "Black Tassel",
  type: "Polearm",
  rarity: 3,
  baseAtk: 354,
  lvl1BaseAtk: 38,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 46.9,
    baseValue: 10.2,
  },
  passiveName: "Bane of the Soft",
  passiveDesc:
    "Increases DMG against slimes by 40~80%.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
