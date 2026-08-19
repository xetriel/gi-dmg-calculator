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
  passiveName: "Byakuya Kougetsu",
  passiveDesc:
    "Healing Bonus is increased by 10~20%, Normal Attack DMG is increased by 1~3% of the Max HP of the character equipping this weapon. For 12s after using an Elemental Burst, Normal Attacks that hit opponents will restore 0.6 Energy.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "moonglow-max-hp",
      label: "Character Max HP",
      control: "stacks",
      defaultValue: 40000,
      max: 100000,
      hint: "Max HP used for flat NA DMG calculation",
    }
  ],
  buffs: [
    {
      id: "moonglow-heal",
      label: "Healing Bonus% (Everlasting Moonglow)",
      stat: "healingBonus",
      refinementValues: [10, 12.5, 15, 17.5, 20],
      isTeamBuff: false,
      compute: (r) => [10, 12.5, 15, 17.5, 20][r - 1],
    },
    {
      id: "moonglow-flat-na",
      label: "Flat Normal Attack DMG from HP (Everlasting Moonglow)",
      stat: "normalDmgBonus",
      refinementValues: [1, 1.5, 2, 2.5, 3],
      isTeamBuff: false,
      compute: (r, ctx) => { const hp = Number(ctx.inputs?.['moonglow-max-hp'] ?? 40000); const ratio = [0.01, 0.015, 0.02, 0.025, 0.03][r - 1]; return hp * ratio; },
    }
  ],
  signatureFor: ["sangonomiya-kokomi"],
};
