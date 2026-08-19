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
    "HP is increased by 16~32%. When current HP increases or decreases, Charged Attack DMG is increased by 14~28% for 4s (max 3 stacks). At 3 stacks or when 3 stacks refresh, restore 8~12 Energy.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "aeon-wave-stacks",
      label: "Aeon Wave HP Change Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+14~28% Charged Attack DMG per stack (up to +42~84%)",
    }
  ],
  buffs: [
    {
      id: "tome-hp",
      label: "HP% (Tome of the Eternal Flow)",
      stat: "hp",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "tome-charged-dmg",
      label: "Charged Attack DMG Bonus (Tome of Eternal Flow)",
      stat: "chargedDmgBonus",
      refinementValues: [42, 52.5, 63, 73.5, 84],
      isTeamBuff: false,
      conditionKey: "aeon-wave-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['aeon-wave-stacks'] ?? 3); return s * [14, 17.5, 21, 24.5, 28][r - 1]; },
    }
  ],
  signatureFor: ["neuvillette"],
};
