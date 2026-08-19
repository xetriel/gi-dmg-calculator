import type { WeaponConfig } from "../types";

export const thrillingTalesOfDragonSlayers: WeaponConfig = {
  id: "thrilling-tales-of-dragon-slayers",
  name: "Thrilling Tales of Dragon Slayers",
  type: "Catalyst",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 35.2,
    baseValue: 7.7,
  },
  passiveName: "Heritage",
  passiveDesc:
    "When switching characters, the new character taking the field has their ATK increased by 24~48% for 10s. This effect can only occur once every 20s.",
  isSupport: true,
  buffType: "team",
  buffs: [
    {
      id: "ttds-atk",
      label: "ATK% (Thrilling Tales of Dragon Slayers)",
      description: "Active character on-field gains +24~48% ATK",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: true,
      isPercent: true,
      compute: (r,ctx)=>{const pct=[24,30,36,42,48][r-1];return pct/100*ctx.baseAtk},
    }
  ],
  
};
