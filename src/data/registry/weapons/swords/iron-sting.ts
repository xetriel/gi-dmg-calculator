import type { WeaponConfig } from "../types";

export const ironSting: WeaponConfig = {
  id: "iron-sting",
  name: "Iron Sting",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Infusion Stinger",
  passiveDesc:
    "Dealing Elemental DMG increases all DMG by 6~12% for 6s. Max 2 stacks. Can occur once every 1s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "iron-sting-stacks",
      label: "Infusion Stinger Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+6~12% All DMG bonus per stack",
    }
  ],
  buffs: [
    {
      id: "iron-sting-dmg",
      label: "All DMG Bonus (Iron Sting)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "iron-sting-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["iron-sting-stacks"]??2);return s*[6,7.5,9,10.5,12][r-1]},
    }
  ],
  
};
