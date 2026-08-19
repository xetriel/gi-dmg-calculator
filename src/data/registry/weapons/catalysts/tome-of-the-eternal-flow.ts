import type { WeaponConfig } from "../types";

export const tomeOfTheEternalFlow: WeaponConfig = {
  id: "tome-of-the-eternal-flow",
  name: "Tome of the Eternal Flow",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "Aeon Wave",
  passiveDesc:
    "HP is increased by 16~32%. When current HP increases or decreases, Charged Attack DMG is increased by 14~30% for 4s. Max 3 stacks (+42~90% CA DMG).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "tome-hp-stacks",
      label: "Aeon Wave Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+14~30% Charged Attack DMG per stack (up to +42~90%)",
    }
  ],
  buffs: [
    {
      id: "tome-hp",
      label: "Max HP% (Tome of the Eternal Flow)",
      stat: "hp",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "tome-ca-dmg",
      label: "Charged Attack DMG Bonus (Tome of the Eternal Flow)",
      stat: "chargedDmgBonus",
      refinementValues: [42, 54, 66, 78, 90],
      isTeamBuff: false,
      conditionKey: "tome-hp-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['tome-hp-stacks'] ?? 3); return s * [14, 18, 22, 26, 30][r - 1]; },
    }
  ],
  signatureFor: ["neuvillette"],
};
