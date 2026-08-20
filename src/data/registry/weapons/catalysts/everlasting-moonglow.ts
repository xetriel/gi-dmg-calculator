import type { WeaponConfig } from "../types";

export const everlastingMoonglow: WeaponConfig = {
  id: "everlasting-moonglow",
  name: "Everlasting Moonglow",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 49.6,
    baseValue: 10.8,
  },
  passiveName: "Byakuya Koukoku",
  passiveDesc:
    "Healing Bonus is increased by 10~20%, Normal Attack DMG is increased by 1~3% of the Max HP of the character equipping this weapon.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "moonglow-wielder-hp",
      label: "Character Total Max HP (e.g. 40000)",
      control: "stacks",
      defaultValue: 40000,
      max: 80000,
      hint: "Max HP used for flat Normal Attack DMG bonus",
    }
  ],
  buffs: [
    {
      id: "moonglow-healing-bonus",
      label: "Healing Bonus% (Everlasting Moonglow)",
      stat: "healingBonus",
      refinementValues: [10, 12.5, 15, 17.5, 20],
      isTeamBuff: false,
      compute: (r) => [10, 12.5, 15, 17.5, 20][r - 1],
    },
    {
      id: "moonglow-na-flat",
      label: "Flat Normal Attack DMG from Max HP (Everlasting Moonglow)",
      stat: "normalDmgBonus",
      refinementValues: [1, 1.5, 2, 2.5, 3],
      isTeamBuff: false,
      conditionKey: "moonglow-wielder-hp",
      compute: (r, ctx) => { const hp = Number(ctx.inputs?.['moonglow-wielder-hp'] ?? 40000); const ratio = [0.01, 0.015, 0.02, 0.025, 0.03][r - 1]; return hp * ratio; },
    }
  ],
  signatureFor: ["sangonomiya-kokomi"],
};
