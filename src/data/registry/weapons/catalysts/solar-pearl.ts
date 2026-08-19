import type { WeaponConfig } from "../types";

export const solarPearl: WeaponConfig = {
  id: "solar-pearl",
  name: "Solar Pearl",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Solar Shine",
  passiveDesc:
    "Normal Attack hits increase Elemental Skill and Elemental Burst DMG by 20~40% for 6s. Elemental Skill or Burst hits increase Normal Attack DMG by 20~40% for 6s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "solar-na-hit",
      label: "Normal Attack Hit (+20~40% Skill/Burst DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% Skill and Burst DMG for 6s",
    },
    {
      id: "solar-skill-burst-hit",
      label: "Skill/Burst Hit (+20~40% Normal Attack DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% Normal Attack DMG for 6s",
    }
  ],
  buffs: [
    {
      id: "solar-skill-dmg",
      label: "Elemental Skill DMG Bonus (Solar Pearl)",
      stat: "skillDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "solar-na-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['solar-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['solar-na-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    },
    {
      id: "solar-burst-dmg",
      label: "Elemental Burst DMG Bonus (Solar Pearl)",
      stat: "burstDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "solar-na-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['solar-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['solar-na-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    },
    {
      id: "solar-na-dmg",
      label: "Normal Attack DMG Bonus (Solar Pearl)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "solar-skill-burst-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['solar-skill-burst-hit'] ?? '1') === '1' || Number(ctx.inputs?.['solar-skill-burst-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    }
  ],
  
};
