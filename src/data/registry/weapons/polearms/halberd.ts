import type { WeaponConfig } from "../types";

export const halberd: WeaponConfig = {
  id: "halberd",
  name: "Halberd",
  type: "Polearm",
  rarity: 3,
  baseAtk: 448,
  lvl1BaseAtk: 40,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 23.5,
    baseValue: 5.1,
  },
  passiveName: "Heavy",
  passiveDesc:
    "Normal Attacks deal an additional 160~320% ATK DMG. Can only occur once every 10s.",
  isSupport: false,
  buffType: "self",
  buffs: [

  ],
  
};
