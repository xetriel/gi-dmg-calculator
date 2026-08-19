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
      id: "slingshot-close-range",
      label: "Hit Target within 0.3s (+36~60% DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases Normal and Charged DMG by 36~60%",
    }
  ],
  buffs: [
    {
      id: "slingshot-na-dmg",
      label: "Normal Attack DMG Bonus (Slingshot)",
      stat: "normalDmgBonus",
      refinementValues: [36, 42, 48, 54, 60],
      isTeamBuff: false,
      compute: (r,ctx)=>{const on=(ctx.inputs?.["slingshot-close-range"]??"1")==="1"||Number(ctx.inputs?.["slingshot-close-range"]??1)>0;return on?[36,42,48,54,60][r-1]:-10},
    },
    {
      id: "slingshot-ca-dmg",
      label: "Charged Attack DMG Bonus (Slingshot)",
      stat: "chargedDmgBonus",
      refinementValues: [36, 42, 48, 54, 60],
      isTeamBuff: false,
      compute: (r,ctx)=>{const on=(ctx.inputs?.["slingshot-close-range"]??"1")==="1"||Number(ctx.inputs?.["slingshot-close-range"]??1)>0;return on?[36,42,48,54,60][r-1]:-10},
    }
  ],
  
};
