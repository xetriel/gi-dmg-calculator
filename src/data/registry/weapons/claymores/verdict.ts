import type { WeaponConfig } from "../types";

export const verdict: WeaponConfig = {
  id: "verdict",
  name: "Verdict",
  type: "Claymore",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 22.1,
    baseValue: 4.8,
  },
  passiveName: "Many Oaths of Dawn and Dusk",
  passiveDesc:
    "Increases ATK by 20~40%. When party members obtain Elemental Shards from Crystallize reactions, gain 1 Seal (max 2): increases Elemental Skill DMG by 18~36% per Seal.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "verdict-seals",
      label: "Crystallize Seals (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+18~36% Skill DMG per Seal (up to +36~72%)",
    }
  ],
  buffs: [
    {
      id: "verdict-atk",
      label: "ATK% (Verdict)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "verdict-skill-dmg",
      label: "Elemental Skill DMG Bonus (Verdict Seals)",
      stat: "skillDmgBonus",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      conditionKey: "verdict-seals",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['verdict-seals'] ?? 2); return s * [18, 22.5, 27, 31.5, 36][r - 1]; },
    }
  ],
  signatureFor: ["navia"],
};
