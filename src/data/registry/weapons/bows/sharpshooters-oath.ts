import type { WeaponConfig } from "../types";

export const sharpshootersOath: WeaponConfig = {
  id: "sharpshooters-oath",
  name: "Sharpshooter's Oath",
  type: "Bow",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 46.9,
    baseValue: 10.2,
  },
  passiveName: "Precise",
  passiveDesc:
    "Increases DMG against weak spots by 24~48%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "sharpshooter-weakspot",
      label: "Target is Weak Spot (+24~48% DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+24~48% DMG on weak spot hit",
    }
  ],
  buffs: [
    {
      id: "sharpshooter-dmg",
      label: "All DMG Bonus on Weak Spots (Sharpshooter's Oath)",
      stat: "dmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "sharpshooter-weakspot",
      compute: (r, ctx) => { const on = (ctx.inputs?.['sharpshooter-weakspot'] ?? '1') === '1' || Number(ctx.inputs?.['sharpshooter-weakspot'] ?? 1) > 0; return on ? [24, 30, 36, 42, 48][r - 1] : 0; },
    }
  ],
  
};
