import type { WeaponConfig } from "../types";

export const balladOfTheBoundlessBlue: WeaponConfig = {
  id: "ballad-of-the-boundless-blue",
  name: "Ballad of the Boundless Blue",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Dandelion Skies",
  passiveDesc:
    "Within 6s after Normal or Charged Attacks hit an opponent, Normal Attack DMG is increased by 8~16% and Charged Attack DMG is increased by 6~12%. Max 3 stacks (+24~48% NA, +18~36% CA).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "blue-stacks",
      label: "Dandelion Skies Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+8~16% NA and +6~12% CA DMG per stack (up to +24~48% NA, +18~36% CA)",
    }
  ],
  buffs: [
    {
      id: "blue-na-dmg",
      label: "Normal Attack DMG Bonus (Ballad Boundless Blue)",
      stat: "normalDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "blue-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['blue-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; },
    },
    {
      id: "blue-ca-dmg",
      label: "Charged Attack DMG Bonus (Ballad Boundless Blue)",
      stat: "chargedDmgBonus",
      refinementValues: [18, 22.5, 27, 31.5, 36],
      isTeamBuff: false,
      conditionKey: "blue-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['blue-stacks'] ?? 3); return s * [6, 7.5, 9, 10.5, 12][r - 1]; },
    }
  ],
  
};
