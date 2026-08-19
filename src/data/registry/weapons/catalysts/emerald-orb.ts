import type { WeaponConfig } from "../types";

export const emeraldOrb: WeaponConfig = {
  id: "emerald-orb",
  name: "Emerald Orb",
  type: "Catalyst",
  rarity: 3,
  baseAtk: 448,
  lvl1BaseAtk: 40,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 94,
    baseValue: 20,
  },
  passiveName: "Rapid",
  passiveDesc:
    "Upon causing an Electro-Charged, Superconduct, Overloaded, Bloom, or Hydro-infused Swirl reaction, increases ATK by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "emerald-orb-atk",
      label: "ATK% (Emerald Orb)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r,ctx)=>[20,25,30,35,40][r-1]/100*ctx.baseAtk,
    }
  ],
  
};
