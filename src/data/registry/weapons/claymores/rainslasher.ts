import type { WeaponConfig } from "../types";

export const rainslasher: WeaponConfig = {
  id: "rainslasher",
  name: "Rainslasher",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Bane of Storm and Tide",
  passiveDesc:
    "Increases DMG against opponents affected by Hydro or Electro by 20~36%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "rainslasher-target",
      label: "Target Affected by Hydro/Electro",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~36% All DMG bonus vs Hydro/Electro targets",
    }
  ],
  buffs: [
    {
      id: "rainslasher-dmg",
      label: "All DMG Bonus (Rainslasher)",
      stat: "dmgBonus",
      refinementValues: [20, 24, 28, 32, 36],
      isTeamBuff: false,
      conditionKey: "rainslasher-target",
      compute: (r,ctx)=>{const on=(ctx.inputs?.["rainslasher-target"]??"1")==="1"||Number(ctx.inputs?.["rainslasher-target"]??1)>0;return on?[20,24,28,32,36][r-1]:0},
    }
  ],
  
};
