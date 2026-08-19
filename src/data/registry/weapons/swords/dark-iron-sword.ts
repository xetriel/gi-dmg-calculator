import type { WeaponConfig } from "../types";

export const darkIronSword: WeaponConfig = {
  id: "dark-iron-sword",
  name: "Dark Iron Sword",
  type: "Sword",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 141,
    baseValue: 31,
  },
  passiveName: "Overloaded",
  passiveDesc:
    "Upon triggering an Overloaded, Superconduct, Electro-Charged, Quicken, Aggravate, Hyperbloom, or Electro-infused Swirl reaction, ATK is increased by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "dark-iron-atk",
      label: "ATK% (Dark Iron Sword)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r,ctx)=>[20,25,30,35,40][r-1]/100*ctx.baseAtk,
    }
  ],
  
};
