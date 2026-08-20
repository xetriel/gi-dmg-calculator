import type { WeaponConfig } from "../types";

export const mountainBracingBolt: WeaponConfig = {
  id: "mountain-bracing-bolt",
  name: "Mountain-Bracing Bolt",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "A Lingering Echo",
  passiveDesc:
    "Decreases climbing Stamina Consumption by 15%. After using an Elemental Skill, Elemental Skill DMG is increased by 12~24% for 15s. If in Nightsoul's Blessing, this DMG increase is increased by 100% (up to +24~48%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mountain-bolt-skill-active",
      label: "Elemental Skill Used (+12~24% Skill DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% Skill DMG for 15s",
    },
    {
      id: "mountain-bolt-nightsoul",
      label: "In Nightsoul's Blessing (2x Skill DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Doubles Skill DMG bonus (up to +24~48%)",
    }
  ],
  buffs: [
    {
      id: "mountain-bolt-skill-dmg",
      label: "Elemental Skill DMG Bonus (Mountain-Bracing Bolt)",
      stat: "skillDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "mountain-bolt-skill-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['mountain-bolt-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['mountain-bolt-skill-active'] ?? 1) > 0; if (!on) return 0; const nightsoul = (ctx.inputs?.['mountain-bolt-nightsoul'] ?? '1') === '1' || Number(ctx.inputs?.['mountain-bolt-nightsoul'] ?? 1) > 0; const mult = nightsoul ? 2 : 1; return [12, 15, 18, 21, 24][r - 1] * mult; },
    }
  ],
  
};
