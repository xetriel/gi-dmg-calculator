import type { WeaponConfig } from "../types";

export const wolfsGravestone: WeaponConfig = {
  id: "wolfs-gravestone",
  name: "Wolf's Gravestone",
  type: "Claymore",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 49.6,
    baseValue: 10.8,
  },
  passiveName: "Wolfish Tracker",
  passiveDesc:
    "Increases ATK by 20~40%. On hit, attacks against opponents with less than 30% HP increase all party members' ATK by 40~80% for 12s. Can only occur once every 30s.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "wgs-party-buff-active",
      label: "Target HP < 30% (+40~80% Party ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +40~80% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "wgs-party-atk",
      label: "Party ATK% (Wolf's Gravestone)",
      description: "Attacks against enemies with <30% HP grant +40~80% ATK to all party members",
      stat: "atk",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "wgs-party-buff-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['wgs-party-buff-active'] ?? '1') === '1' || Number(ctx.inputs?.['wgs-party-buff-active'] ?? 1) > 0; return on ? ([40, 50, 60, 70, 80][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "wgs-self-atk",
      label: "Self ATK% (Wolf's Gravestone Base)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  
};
