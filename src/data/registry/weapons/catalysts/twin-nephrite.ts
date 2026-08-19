import type { WeaponConfig } from "../types";

export const twinNephrite: WeaponConfig = {
  id: "twin-nephrite",
  name: "Twin Nephrite",
  type: "Catalyst",
  rarity: 3,
  baseAtk: 448,
  lvl1BaseAtk: 40,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 15.6,
    baseValue: 3.4,
  },
  passiveName: "Guerilla Tactics",
  passiveDesc:
    "Defeating an opponent increases Movement SPD and ATK by 12~20% for 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "twin-nephrite-atk",
      label: "ATK% (Twin Nephrite)",
      stat: "atk",
      refinementValues: [12, 14, 16, 18, 20],
      isTeamBuff: false,
      isPercent: true,
      compute: (r,ctx)=>[12,14,16,18,20][r-1]/100*ctx.baseAtk,
    }
  ],
  
};
