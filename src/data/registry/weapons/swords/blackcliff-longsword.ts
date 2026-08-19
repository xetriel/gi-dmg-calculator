import type { WeaponConfig } from "../types";

export const blackcliffLongsword: WeaponConfig = {
  id: "blackcliff-longsword",
  name: "Blackcliff Longsword",
  type: "Sword",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 36.8,
    baseValue: 8,
  },
  passiveName: "Press the Advantage",
  passiveDesc:
    "After defeating an opponent, ATK is increased by 12~24% for 30s. This effect has a maximum of 3 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "blackcliff-stacks",
      label: "Press the Advantage Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+12~24% ATK per defeat stack",
    }
  ],
  buffs: [
    {
      id: "blackcliff-atk",
      label: "ATK% (Blackcliff Longsword)",
      stat: "atk",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "blackcliff-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["blackcliff-stacks"]??3);return s*[12,15,18,21,24][r-1]/100*ctx.baseAtk},
    }
  ],
  
};
