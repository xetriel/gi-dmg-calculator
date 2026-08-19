import type { WeaponConfig } from "../types";

export const prototypeStarglitter: WeaponConfig = {
  id: "prototype-starglitter",
  name: "Prototype Starglitter",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Magic Affinity",
  passiveDesc:
    "After using an Elemental Skill, increases Normal and Charged Attack DMG by 8~16% for 12s. Max 2 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "starglitter-stacks",
      label: "Magic Affinity Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+8~16% Normal & Charged Attack DMG per stack",
    }
  ],
  buffs: [
    {
      id: "starglitter-na-dmg",
      label: "Normal Attack DMG Bonus (Prototype Starglitter)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "starglitter-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["starglitter-stacks"]??2);return s*[8,10,12,14,16][r-1]},
    },
    {
      id: "starglitter-ca-dmg",
      label: "Charged Attack DMG Bonus (Prototype Starglitter)",
      stat: "chargedDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "starglitter-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["starglitter-stacks"]??2);return s*[8,10,12,14,16][r-1]},
    }
  ],
  
};
