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
    "Gain 12~24% All Elemental DMG Bonus. Obtain the Tireless Hunt effect after hitting an opponent with a Charged Attack: Charged Attack DMG is increased by 160~320% of Elemental Mastery for 12 hits or 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "hunters-path-em",
      label: "Character EM",
      control: "stacks",
      defaultValue: 400,
      max: 2000,
      hint: "EM used for flat Charged Attack DMG bonus",
    },
    {
      id: "hunters-path-active",
      label: "Tireless Hunt Active",
      control: "toggle",
      defaultValue: 1,
      hint: "+160~320% of EM as flat CA DMG bonus",
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
      label: "Flat CA DMG from EM (Hunter's Path)",
      stat: "flatDmgBonus",
      refinementValues: [160, 200, 240, 280, 320],
      isTeamBuff: false,
      conditionKey: "hunters-path-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['hunters-path-active'] ?? '1') === '1' || Number(ctx.inputs?.['hunters-path-active'] ?? 1) > 0; if (!on) return 0; const em = Number(ctx.inputs?.['hunters-path-em'] ?? 400); return em * ([1.6, 2.0, 2.4, 2.8, 3.2][r - 1]); },
    }
  ],
  signatureFor: ["tighnari"],
};
