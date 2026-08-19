import type { WeaponConfig } from "../types";

export const dodocoTales: WeaponConfig = {
  id: "dodoco-tales",
  name: "Dodoco Tales",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Dodoventure!",
  passiveDesc:
    "Normal Attack hits increase Charged Attack DMG by 16~32% for 6s. Charged Attack hits increase ATK by 8~16% for 6s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "dodoco-na-hit",
      label: "Normal Attack Hit (+16~32% CA DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% Charged Attack DMG",
    },
    {
      id: "dodoco-ca-hit",
      label: "Charged Attack Hit (+8~16% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+8~16% ATK",
    }
  ],
  buffs: [
    {
      id: "dodoco-ca-dmg",
      label: "Charged Attack DMG Bonus (Dodoco Tales)",
      stat: "chargedDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "dodoco-na-hit",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["dodoco-na-hit"]??"1")==="1"||Number(ctx.inputs?.["dodoco-na-hit"]??1)>0;return on?[16,20,24,28,32][r-1]:0},
    },
    {
      id: "dodoco-atk",
      label: "ATK% (Dodoco Tales)",
      stat: "atk",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "dodoco-ca-hit",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["dodoco-ca-hit"]??"1")==="1"||Number(ctx.inputs?.["dodoco-ca-hit"]??1)>0;return on?[8,10,12,14,16][r-1]/100*ctx.baseAtk:0},
    }
  ],
  signatureFor: ["klee"],
};
