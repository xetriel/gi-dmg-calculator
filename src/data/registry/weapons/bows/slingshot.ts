import type { WeaponConfig } from "../types";

export const slingshot: WeaponConfig = {
  id: "slingshot",
  name: "Slingshot",
  type: "Bow",
  rarity: 3,
  baseAtk: 354,
  lvl1BaseAtk: 38,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 31.2,
    baseValue: 6.8,
  },
  passiveName: "Slingshot",
  passiveDesc:
    "If a Normal or Charged Attack hits a target within 0.3s of being fired, increases DMG by 36~60%. Otherwise, decreases DMG by 10%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "slingshot-pointblank",
      label: "Hit within 0.3s (+36~60% DMG vs -10%)",
      control: "toggle",
      defaultValue: 1,
      hint: "Toggle on for +36~60% DMG, off for -10% DMG penalty",
    }
  ],
  buffs: [
    {
      id: "slingshot-na-ca-dmg",
      label: "Normal & Charged Attack DMG Bonus (Slingshot)",
      stat: "normalDmgBonus",
      refinementValues: [36, 42, 48, 54, 60],
      isTeamBuff: false,
      conditionKey: "slingshot-pointblank",
      compute: (r, ctx) => { const on = (ctx.inputs?.['slingshot-pointblank'] ?? '1') === '1' || Number(ctx.inputs?.['slingshot-pointblank'] ?? 1) > 0; return on ? [36, 42, 48, 54, 60][r - 1] : -10; },
    }
  ],
  
};
