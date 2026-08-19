import type { WeaponConfig } from "../types";

export const fruitOfFulfillment: WeaponConfig = {
  id: "fruit-of-fulfillment",
  name: "Fruit of Fulfillment",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Full Circle",
  passiveDesc:
    "Triggering an Elemental Reaction grants the Wax and Wane effect: increases Elemental Mastery by 24~36, but decreases ATK by 5%. Max 5 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "fulfillment-stacks",
      label: "Wax and Wane Stacks (0-5)",
      control: "stacks",
      defaultValue: 5,
      max: 5,
      hint: "+24~36 EM per stack (Total +120~180 EM, -25% ATK)",
    }
  ],
  buffs: [
    {
      id: "fulfillment-em",
      label: "Elemental Mastery (Fruit of Fulfillment)",
      stat: "em",
      refinementValues: [120, 135, 150, 165, 180],
      isTeamBuff: false,
      conditionKey: "fulfillment-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["fulfillment-stacks"]??5);return s*[24,27,30,33,36][r-1]},
    },
    {
      id: "fulfillment-atk-penalty",
      label: "ATK% Penalty (Fruit of Fulfillment)",
      stat: "atk",
      refinementValues: [-25, -25, -25, -25, -25],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "fulfillment-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["fulfillment-stacks"]??5);return-s*5/100*ctx.baseAtk},
    }
  ],
  
};
