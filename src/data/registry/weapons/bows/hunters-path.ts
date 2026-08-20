import type { WeaponConfig } from "../types";

export const huntersPath: WeaponConfig = {
  id: "hunters-path",
  name: "Hunter's Path",
  type: "Bow",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "At the End of the Beast-Paths",
  passiveDesc:
    "Gain 12~24% All Elemental DMG Bonus. Gain the Tireless Hunt effect after hitting an opponent with a Charged Attack, increasing Charged Attack DMG by 160~320% of Elemental Mastery.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "hunters-path-wielder-em",
      label: "Character Total Elemental Mastery (e.g. 300)",
      control: "stacks",
      defaultValue: 300,
      max: 2000,
      hint: "Total EM used to compute flat Charged Attack DMG bonus",
    },
    {
      id: "hunters-path-tireless-hunt",
      label: "Tireless Hunt Active (+160~320% EM as CA DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Adds EM scaling to Charged Attack DMG",
    }
  ],
  buffs: [
    {
      id: "hunters-path-elem-dmg",
      label: "All Elemental DMG Bonus (Hunter's Path)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "hunters-path-flat-ca",
      label: "Flat Charged Attack DMG from EM (Hunter's Path)",
      stat: "chargedDmgBonus",
      refinementValues: [160, 200, 240, 280, 320],
      isTeamBuff: false,
      conditionKey: "hunters-path-tireless-hunt",
      compute: (r, ctx) => { const on = (ctx.inputs?.['hunters-path-tireless-hunt'] ?? '1') === '1' || Number(ctx.inputs?.['hunters-path-tireless-hunt'] ?? 1) > 0; if (!on) return 0; const em = Number(ctx.inputs?.['hunters-path-wielder-em'] ?? 300); const ratio = [1.6, 2.0, 2.4, 2.8, 3.2][r - 1]; return em * ratio; },
    }
  ],
  signatureFor: ["tighnari"],
};
