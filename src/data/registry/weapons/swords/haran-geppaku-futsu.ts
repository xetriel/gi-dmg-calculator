import type { WeaponConfig } from "../types";

export const haranGeppakuFutsu: WeaponConfig = {
  id: "haran-geppaku-futsu",
  name: "Haran Geppaku Futsu",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Honed Flow",
  passiveDesc:
    "Obtain 12~24% All Elemental DMG Bonus. When nearby party members use Elemental Skills, obtain 1 Wavespike stack (max 2). When the wielder uses an Elemental Skill, consume all stacks to gain 20~40% Normal Attack DMG Bonus per stack for 8s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "wavespike-stacks",
      label: "Wavespike Stacks Consumed (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+20~40% Normal Attack DMG Bonus per stack",
    }
  ],
  buffs: [
    {
      id: "haran-elem-dmg",
      label: "All Elemental DMG Bonus (Haran Geppaku Futsu)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "haran-na-dmg",
      label: "Normal Attack DMG Bonus (Haran Wavespike)",
      stat: "normalDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "wavespike-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['wavespike-stacks'] ?? 2); return s * [20, 25, 30, 35, 40][r - 1]; },
    }
  ],
  signatureFor: ["kamisato-ayato"],
};
