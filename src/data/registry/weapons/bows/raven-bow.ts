import type { WeaponConfig } from "../types";

export const ravenBow: WeaponConfig = {
  id: "raven-bow",
  name: "Raven Bow",
  type: "Bow",
  rarity: 3,
  baseAtk: 448,
  lvl1BaseAtk: 40,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 94,
    baseValue: 20,
  },
  passiveName: "Bane of Flame and Water",
  passiveDesc:
    "Increases DMG against opponents affected by Hydro or Pyro by 12~24%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "raven-bow-target",
      label: "Target Affected by Hydro/Pyro",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% All DMG bonus",
    }
  ],
  buffs: [
    {
      id: "raven-bow-dmg",
      label: "All DMG Bonus (Raven Bow)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "raven-bow-target",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["raven-bow-target"]??"1")==="1"||Number(ctx.inputs?.["raven-bow-target"]??1)>0;return on?[12,15,18,21,24][r-1]:0},
    }
  ],
  
};
