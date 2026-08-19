import type { WeaponConfig } from "../types";

export const deathmatch: WeaponConfig = {
  id: "deathmatch",
  name: "Deathmatch",
  type: "Polearm",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 36.8,
    baseValue: 8,
  },
  passiveName: "Gladiator",
  passiveDesc:
    "If there are at least 2 opponents nearby, ATK is increased by 16~32% and DEF is increased by 16~32%. If there are fewer than 2 opponents nearby, ATK is increased by 24~48%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "deathmatch-single-target",
      label: "Fewer than 2 opponents (<2 targets)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases ATK by 24~48% (instead of 16~32% ATK/DEF)",
    }
  ],
  buffs: [
    {
      id: "deathmatch-atk",
      label: "ATK% (Deathmatch Gladiator)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      compute: (r,ctx)=>{const single=(ctx.inputs?.["deathmatch-single-target"]??"1")==="1"||Number(ctx.inputs?.["deathmatch-single-target"]??1)>0;const pct=single?[24,30,36,42,48][r-1]:[16,20,24,28,32][r-1];return pct/100*ctx.baseAtk},
    }
  ],
  
};
