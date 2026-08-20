import type { WeaponConfig } from "../types";

export const azurelight: WeaponConfig = {
  id: "azurelight",
  name: "Azurelight",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Azure Brilliance",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. Elemental Skill hits increase CRIT DMG by 20~40% for 8s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "azurelight-skill-hit",
      label: "Skill Hit Active (+20~40% CRIT DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% CRIT DMG for 8s",
    }
  ],
  buffs: [
    {
      id: "azurelight-elem-dmg",
      label: "All Elemental DMG Bonus (Azurelight)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "azurelight-crit-dmg",
      label: "CRIT DMG% (Azurelight)",
      stat: "critDmg",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "azurelight-skill-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['azurelight-skill-hit'] ?? '1') === '1' || Number(ctx.inputs?.['azurelight-skill-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    }
  ],
  
};
