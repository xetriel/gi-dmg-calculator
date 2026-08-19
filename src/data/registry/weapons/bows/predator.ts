import type { WeaponConfig } from "../types";

export const predator: WeaponConfig = {
  id: "predator",
  name: "Predator",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Strong Strike",
  passiveDesc:
    "Dealing Cryo DMG increases Normal and Charged Attack DMG by 10% for 6s. Max 2 stacks. If equipped by Aloy, ATK is increased by 66.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "predator-stacks",
      label: "Cryo DMG Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+10% NA/CA DMG per stack",
    }
  ],
  buffs: [
    {
      id: "predator-na-dmg",
      label: "Normal Attack DMG Bonus (Predator)",
      stat: "normalDmgBonus",
      refinementValues: [20, 20, 20, 20, 20],
      isTeamBuff: false,
      conditionKey: "predator-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["predator-stacks"]??2);return s*10},
    },
    {
      id: "predator-flat-atk",
      label: "Aloy Flat ATK (Predator)",
      stat: "atk",
      refinementValues: [66, 66, 66, 66, 66],
      isTeamBuff: false,
      compute: ()=>66,
    }
  ],
  signatureFor: ["aloy"],
};
