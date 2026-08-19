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
  passiveName: "Bygone Azure Teardrop",
  passiveDesc:
    "Normal Attack SPD is increased by 10~20%. After using an Elemental Skill, Normal Attack DMG increases by 4.8~9.6% every 1s for 14s, and by 9.6~19.2% when hitting opponents (max +48~96% NA DMG).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "tulaytullah-na-buff",
      label: "Skill NA DMG Ramp Up (0-48~96%)",
      control: "stacks",
      defaultValue: 48,
      max: 96,
      hint: "Max Normal Attack DMG bonus achieved during skill (+48~96%)",
    }
  ],
  buffs: [
    {
      id: "tulaytullah-na-dmg",
      label: "Normal Attack DMG Bonus (Tulaytullah's Remembrance)",
      stat: "normalDmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "tulaytullah-na-buff",
      compute: (r) => [48, 60, 72, 84, 96][r - 1],
    }
  ],
  signatureFor: ["wanderer"],
};
