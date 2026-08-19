import type { WeaponConfig } from "../types";

export const blackcliffWarbow: WeaponConfig = {
  id: "blackcliff-warbow",
  name: "Blackcliff Warbow",
  type: "Bow",
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
    "After defeating an opponent, ATK is increased by 12~24% for 30s. Max 3 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "blackcliff-warbow-stacks",
      label: "Defeat Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+12~24% ATK per defeat",
    }
  ],
  buffs: [
    {
      id: "blackcliff-warbow-atk",
      label: "ATK% (Blackcliff Warbow)",
      stat: "atk",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "blackcliff-warbow-stacks",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["blackcliff-warbow-stacks"]??3);return s*[12,15,18,21,24][r-1]/100*ctx.baseAtk},
    }
  ],
  
};
