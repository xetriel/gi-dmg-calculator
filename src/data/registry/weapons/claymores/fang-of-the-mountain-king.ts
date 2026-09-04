import type { WeaponConfig } from "../types";

export const fangOfTheMountainKing: WeaponConfig = {
  id: "fang-of-the-mountain-king",
  name: "Fang of the Mountain King",
  type: "Claymore",
  rarity: 5,
  baseAtk: 741,
  lvl1BaseAtk: 49,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 11,
    baseValue: 2.4,
  },
  passiveName: "Turquoise Hunt",
  passiveDesc:
    "Gain 1 stack of Canopy's Favor after hitting an opponent with an Elemental Skill. This can be triggered once every 0.5s. After a nearby party member triggers a Burning or Burgeon reaction, the equipping character will gain 3 stacks. This effect can be triggered once every 2s and can be triggered even when the triggering party member is off-field. Canopy's Favor: Elemental Skill and Burst DMG is increased by 10%/12.5%/15%/17.5%/20% for 6s. Max 6 stacks. Each stack is counted independently.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mountain-king-stacks",
      label: "Canopy's Favor Stacks (0-6)",
      control: "stacks",
      defaultValue: 6,
      max: 6,
      hint: "+10/12.5/15/17.5/20% Skill & Burst DMG per stack (up to +60~120% at 6 stacks)",
    },
  ],
  buffs: [
    {
      id: "mountain-king-skill-dmg",
      label: "Elemental Skill DMG Bonus (Fang of the Mountain King)",
      stat: "skillDmgBonus",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      conditionKey: "mountain-king-stacks",
      compute: (r, ctx) => {
        const s = Math.min(6, Math.max(0, Number(ctx.inputs?.["mountain-king-stacks"] ?? 6)));
        return s * [10, 12.5, 15, 17.5, 20][r - 1];
      },
    },
    {
      id: "mountain-king-burst-dmg",
      label: "Elemental Burst DMG Bonus (Fang of the Mountain King)",
      stat: "burstDmgBonus",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      conditionKey: "mountain-king-stacks",
      compute: (r, ctx) => {
        const s = Math.min(6, Math.max(0, Number(ctx.inputs?.["mountain-king-stacks"] ?? 6)));
        return s * [10, 12.5, 15, 17.5, 20][r - 1];
      },
    },
  ],
  signatureFor: ["kinich"],
};
