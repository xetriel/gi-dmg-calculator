import type { WeaponConfig } from "../types";

export const skyriderGreatsword: WeaponConfig = {
  id: "skyrider-greatsword",
  name: "Skyrider Greatsword",
  type: "Claymore",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "physicalDmgBonus",
    label: "Physical DMG Bonus%",
    value: 43.9,
    baseValue: 9.6,
  },
  passiveName: "Courage",
  passiveDesc:
    "On hit, Normal or Charged Attacks increase ATK by 6~10% for 6s. Max 4 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "skyrider-stacks",
      label: "Courage Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "+6~10% ATK per hit stack",
    }
  ],
  buffs: [
    {
      id: "skyrider-claymore-atk",
      label: "ATK% (Skyrider Greatsword)",
      stat: "atk",
      refinementValues: [24, 28, 32, 36, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "skyrider-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["skyrider-stacks"]??4);return s*[6,7,8,9,10][r-1]/100*ctx.baseAtk},
    }
  ],
  
};
