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
    "Increases DMG against weak points by 24~48%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "sharpshooter-weakpoint",
      label: "Weak Point Hit Active",
      control: "toggle",
      defaultValue: 1,
      hint: "+24~48% DMG bonus against weak points",
    }
  ],
  buffs: [
    {
      id: "sharpshooter-dmg",
      label: "Weak Point DMG Bonus (Sharpshooter's Oath)",
      stat: "dmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "sharpshooter-weakpoint",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["sharpshooter-weakpoint"]??"1")==="1"||Number(ctx.inputs?.["sharpshooter-weakpoint"]??1)>0;return on?[24,30,36,42,48][r-1]:0},
    }
  ],
  
};
