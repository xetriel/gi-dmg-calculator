import type { WeaponConfig } from "../types";

export const alleyHunter: WeaponConfig = {
  id: "alley-hunter",
  name: "Alley Hunter",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Oppidan Ambush",
  passiveDesc:
    "While the character equipped with this weapon is in the party but not on the field, their DMG increases by 2~4% every second up to a max of 20~40%. When on the field for more than 4s, the DMG buff decreases by 4~8% per second.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "alley-hunter-stacks",
      label: "Off-Field DMG Stacks (0-10)",
      control: "stacks",
      defaultValue: 10,
      max: 10,
      hint: "+2~4% DMG per second (up to +20~40%)",
    }
  ],
  buffs: [
    {
      id: "alley-hunter-dmg",
      label: "All DMG Bonus (Alley Hunter)",
      stat: "dmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "alley-hunter-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["alley-hunter-stacks"]??10);return s*[2,2.5,3,3.5,4][r-1]},
    }
  ],
  
};
