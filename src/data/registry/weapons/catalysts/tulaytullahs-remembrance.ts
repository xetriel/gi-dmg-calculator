import type { WeaponConfig } from "../types";

export const tulaytullahsRemembrance: WeaponConfig = {
  id: "tulaytullahs-remembrance",
  name: "Tulaytullah's Remembrance",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Bygone Azure Tear",
  passiveDesc:
    "Normal Attack SPD is increased by 10%. After using an Elemental Skill, Normal Attack DMG increases by 4.8~9.6% each second and by 9.6~19.2% after hitting opponents. Max increase is 48~96%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "tulaytullah-na-buff",
      label: "Normal Attack DMG Bonus % (0-96%)",
      control: "stacks",
      defaultValue: 48,
      max: 96,
      hint: "Dynamic NA DMG buildup from skill (up to 48% at R1, up to 96% at R5)",
    }
  ],
  buffs: [
    {
      id: "tulaytullah-na-dmg",
      label: "Normal Attack DMG Bonus (Tulaytullah)",
      stat: "normalDmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "tulaytullah-na-buff",
      compute: (r, ctx) => { const cap = [48, 60, 72, 84, 96][r - 1]; const input = Number(ctx.inputs?.['tulaytullah-na-buff'] ?? 48); return Math.min(input, cap); },
    }
  ],
  signatureFor: ["wanderer"],
};
