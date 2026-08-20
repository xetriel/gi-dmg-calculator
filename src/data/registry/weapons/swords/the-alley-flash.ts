import type { WeaponConfig } from "../types";

export const theAlleyFlash: WeaponConfig = {
  id: "the-alley-flash",
  name: "The Alley Flash",
  type: "Sword",
  rarity: 4,
  baseAtk: 620,
  lvl1BaseAtk: 45,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 55,
    baseValue: 12,
  },
  passiveName: "Itinerant Hero",
  passiveDesc:
    "Increases DMG dealt by the character equipping this weapon by 12~24%. Taking DMG disables this effect for 5s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "alley-flash-unhit",
      label: "Not Damaged Within 5s (Active DMG Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% All DMG bonus when not taking DMG",
    }
  ],
  buffs: [
    {
      id: "alley-flash-dmg",
      label: "All DMG Bonus (The Alley Flash)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "alley-flash-unhit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['alley-flash-unhit'] ?? '1') === '1' || Number(ctx.inputs?.['alley-flash-unhit'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  
};
