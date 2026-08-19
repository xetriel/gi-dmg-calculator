import type { WeaponConfig } from "../types";

export const prototypeRancour: WeaponConfig = {
  id: "prototype-rancour",
  name: "Prototype Rancour",
  type: "Sword",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "physicalDmgBonus",
    label: "Physical DMG Bonus%",
    value: 34.5,
    baseValue: 7.5,
  },
  passiveName: "Smashed Stone",
  passiveDesc:
    "On hit, Normal or Charged Attacks increase ATK and DEF by 4~8% for 6s. Max 4 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "rancour-stacks",
      label: "Smashed Stone Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "+4~8% ATK & DEF per stack",
    }
  ],
  buffs: [
    {
      id: "rancour-atk",
      label: "ATK% (Prototype Rancour)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "rancour-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["rancour-stacks"]??4);return s*[4,5,6,7,8][r-1]/100*ctx.baseAtk},
    },
    {
      id: "rancour-def",
      label: "DEF% (Prototype Rancour)",
      stat: "def",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "rancour-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["rancour-stacks"]??4);return s*[4,5,6,7,8][r-1]},
    }
  ],
  
};
