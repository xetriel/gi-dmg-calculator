import type { WeaponConfig } from "../types";

export const compoundBow: WeaponConfig = {
  id: "compound-bow",
  name: "Compound Bow",
  type: "Bow",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "physicalDmgBonus",
    label: "Physical DMG Bonus%",
    value: 69,
    baseValue: 15,
  },
  passiveName: "Infusion Arrow",
  passiveDesc:
    "Normal Attack and Charged Attack hits increase ATK by 4~8% and Normal ATK SPD by 1.2~2.4% for 6s. Max 4 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "compound-stacks",
      label: "Infusion Arrow Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "+4~8% ATK per hit stack",
    }
  ],
  buffs: [
    {
      id: "compound-atk",
      label: "ATK% (Compound Bow)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "compound-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["compound-stacks"]??4);return s*[4,5,6,7,8][r-1]/100*ctx.baseAtk},
    }
  ],
  
};
