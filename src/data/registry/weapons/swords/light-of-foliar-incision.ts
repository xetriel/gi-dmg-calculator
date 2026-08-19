import type { WeaponConfig } from "../types";

export const lightOfFoliarIncision: WeaponConfig = {
  id: "light-of-foliar-incision",
  name: "Light of Foliar Incision",
  type: "Sword",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "Whitemoon Bristle",
  passiveDesc:
    "CRIT Rate is increased by 4~8%. After Normal Attacks deal Elemental DMG, the Foliar Incision effect is obtained: increases DMG dealt by Normal Attacks and Elemental Skills by 120~240% of Elemental Mastery for 28 hits or 12s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "foliar-wielder-em",
      label: "Character EM",
      control: "stacks",
      defaultValue: 400,
      max: 2000,
      hint: "EM used for Foliar Incision flat DMG",
    },
    {
      id: "foliar-incision-active",
      label: "Foliar Incision Active",
      control: "toggle",
      defaultValue: 1,
      hint: "+120~240% of EM as flat NA/Skill DMG",
    }
  ],
  buffs: [
    {
      id: "foliar-crit-rate",
      label: "CRIT Rate% (Light of Foliar Incision)",
      stat: "critRate",
      refinementValues: [4, 5, 6, 7, 8],
      isTeamBuff: false,
      compute: (r) => [4, 5, 6, 7, 8][r - 1],
    },
    {
      id: "foliar-na-flat",
      label: "Normal Attack Flat DMG from EM",
      stat: "normalDmgBonus",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "foliar-incision-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['foliar-incision-active'] ?? '1') === '1' || Number(ctx.inputs?.['foliar-incision-active'] ?? 1) > 0; if (!on) return 0; const em = Number(ctx.inputs?.['foliar-wielder-em'] ?? 400); return em * ([1.2, 1.5, 1.8, 2.1, 2.4][r - 1]); },
    },
    {
      id: "foliar-skill-flat",
      label: "Elemental Skill Flat DMG from EM",
      stat: "skillDmgBonus",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "foliar-incision-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['foliar-incision-active'] ?? '1') === '1' || Number(ctx.inputs?.['foliar-incision-active'] ?? 1) > 0; if (!on) return 0; const em = Number(ctx.inputs?.['foliar-wielder-em'] ?? 400); return em * ([1.2, 1.5, 1.8, 2.1, 2.4][r - 1]); },
    }
  ],
  signatureFor: ["alhaitham"],
};
