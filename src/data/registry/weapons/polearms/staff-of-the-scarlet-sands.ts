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
    "The equipping character gains 52~104% of their Elemental Mastery as bonus ATK. When an Elemental Skill hits opponents, gain 1 stack of the Dream of the Scarlet Sands (max 3): grants 28~56% of EM as bonus ATK per stack for 10s (up to +136~272% EM as ATK).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "scarlet-wielder-em",
      label: "Character Total Elemental Mastery (e.g. 400)",
      control: "stacks",
      defaultValue: 400,
      max: 2000,
      hint: "Total EM used to compute flat ATK bonus",
    },
    {
      id: "scarlet-sands-stacks",
      label: "Dream of Scarlet Sands Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+28~56% EM as ATK per stack (up to +84~168% EM as ATK)",
    }
  ],
  buffs: [
    {
      id: "scarlet-base-em-atk",
      label: "Flat ATK from Base EM (Staff of Scarlet Sands)",
      stat: "atk",
      refinementValues: [52, 65, 78, 91, 104],
      isTeamBuff: false,
      compute: (r, ctx) => { const em = Number(ctx.inputs?.['scarlet-wielder-em'] ?? 400); const ratio = [0.52, 0.65, 0.78, 0.91, 1.04][r - 1]; return em * ratio; },
    },
    {
      id: "scarlet-stacks-em-atk",
      label: "Flat ATK from Stacks (Staff of Scarlet Sands)",
      stat: "atk",
      refinementValues: [84, 105, 126, 147, 168],
      isTeamBuff: false,
      conditionKey: "scarlet-sands-stacks",
      compute: (r, ctx) => { const em = Number(ctx.inputs?.['scarlet-wielder-em'] ?? 400); const s = Number(ctx.inputs?.['scarlet-sands-stacks'] ?? 3); const perStack = [0.28, 0.35, 0.42, 0.49, 0.56][r - 1]; return em * s * perStack; },
    }
  ],
  signatureFor: ["cyno"],
};
