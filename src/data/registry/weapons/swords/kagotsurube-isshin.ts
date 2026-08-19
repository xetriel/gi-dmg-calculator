import type { WeaponConfig } from "../types";

export const kagotsurubeIsshin: WeaponConfig = {
  id: "kagotsurube-isshin",
  name: "Kagotsurube Isshin",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Isshin Art Clarity",
  passiveDesc:
    "When a Normal, Charged, or Plunging Attack hits an opponent, it will deal 180% of ATK as AoE DMG and increase ATK by 15% for 8s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "isshin-atk",
      label: "ATK% (Kagotsurube Isshin)",
      stat: "atk",
      refinementValues: [15, 15, 15, 15, 15],
      isTeamBuff: false,
      isPercent: true,
      compute: (r,ctx)=>15/100*ctx.baseAtk,
    }
  ],
  
};
