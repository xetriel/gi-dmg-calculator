import type { WeaponConfig } from "../types";

export const staffOfTheScarletSands: WeaponConfig = {
  id: "staff-of-the-scarlet-sands",
  name: "Staff of the Scarlet Sands",
  type: "Polearm",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Heat Haze at Horizon's End",
  passiveDesc:
    "The equipping character gains 52~104% of their Elemental Mastery as bonus ATK. When an Elemental Skill hits opponents, gain the Dream of the Scarlet Sands effect: gain 28~56% of their Elemental Mastery as bonus ATK for 10s. Max 3 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "scarlet-wielder-em",
      label: "Character EM",
      control: "stacks",
      defaultValue: 300,
      max: 2000,
      hint: "EM used for Scarlet Sands ATK conversion",
    },
    {
      id: "scarlet-dream-stacks",
      label: "Dream Stacks on Skill Hit (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+28~56% of EM as additional ATK per stack",
    }
  ],
  buffs: [
    {
      id: "scarlet-base-em-to-atk",
      label: "Flat ATK from EM (Scarlet Sands Base)",
      stat: "atk",
      refinementValues: [52, 65, 78, 91, 104],
      isTeamBuff: false,
      compute: (r, ctx) => { const em = Number(ctx.inputs?.['scarlet-wielder-em'] ?? 300); const ratio = [0.52, 0.65, 0.78, 0.91, 1.04][r - 1]; return em * ratio; },
    },
    {
      id: "scarlet-stacks-em-to-atk",
      label: "Flat ATK from EM (Scarlet Sands Stacks)",
      stat: "atk",
      refinementValues: [84, 105, 126, 147, 168],
      isTeamBuff: false,
      conditionKey: "scarlet-dream-stacks",
      compute: (r, ctx) => { const em = Number(ctx.inputs?.['scarlet-wielder-em'] ?? 300); const s = Number(ctx.inputs?.['scarlet-dream-stacks'] ?? 3); const perStack = [0.28, 0.35, 0.42, 0.49, 0.56][r - 1]; return em * s * perStack; },
    }
  ],
  signatureFor: ["cyno"],
};
