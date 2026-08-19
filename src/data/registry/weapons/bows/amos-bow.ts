import type { WeaponConfig } from "../types";

export const amosBow: WeaponConfig = {
  id: "amos-bow",
  name: "Amos' Bow",
  type: "Bow",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 49.6,
    baseValue: 10.8,
  },
  passiveName: "Strong-Willed",
  passiveDesc:
    "Increases Normal and Charged Attack DMG by 12~24%. Normal and Charged Attack DMG increases by 8~16% for every 0.1s the arrow is in the air up to 5 times.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "amos-arrow-stacks",
      label: "Arrow Flight Time Stacks (0-5)",
      control: "stacks",
      defaultValue: 5,
      max: 5,
      hint: "+8~16% NA/CA DMG per 0.1s flight (up to +40~80%)",
    }
  ],
  buffs: [
    {
      id: "amos-base-na-ca-dmg",
      label: "Normal/Charged Attack DMG Bonus (Amos Base)",
      stat: "normalDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "amos-base-charged-dmg",
      label: "Charged Attack DMG Bonus (Amos Base)",
      stat: "chargedDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "amos-flight-na-dmg",
      label: "Flight Time NA DMG Bonus (Amos' Bow)",
      stat: "normalDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "amos-arrow-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['amos-arrow-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; },
    },
    {
      id: "amos-flight-ca-dmg",
      label: "Flight Time CA DMG Bonus (Amos' Bow)",
      stat: "chargedDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "amos-arrow-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['amos-arrow-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; },
    }
  ],
  signatureFor: ["ganyu"],
};
