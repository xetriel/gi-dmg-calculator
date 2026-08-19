import type { WeaponConfig } from "../types";

export const dragonsBane: WeaponConfig = {
  id: "dragons-bane",
  name: "Dragon's Bane",
  type: "Polearm",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 221,
    baseValue: 48,
  },
  passiveName: "Bane of Flame and Water",
  passiveDesc:
    "Increases DMG against opponents affected by Hydro or Pyro by 20~36%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "dragons-bane-target",
      label: "Target Affected by Pyro/Hydro",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~36% DMG bonus vs Pyro/Hydro affected targets",
    }
  ],
  buffs: [
    {
      id: "dragons-bane-dmg",
      label: "All DMG Bonus (Dragon's Bane)",
      stat: "dmgBonus",
      refinementValues: [20, 24, 28, 32, 36],
      isTeamBuff: false,
      conditionKey: "dragons-bane-target",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["dragons-bane-target"]??"1")==="1"||Number(ctx.inputs?.["dragons-bane-target"]??1)>0;if(!on)return 0;return[20,24,28,32,36][r-1]},
    }
  ],
  
};
