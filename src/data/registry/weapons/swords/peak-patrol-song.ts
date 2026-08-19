import type { WeaponConfig } from "../types";

export const peakPatrolSong: WeaponConfig = {
  id: "peak-patrol-song",
  name: "Peak Patrol Song",
  type: "Sword",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 82.7,
    baseValue: 18,
  },
  passiveName: "High-Altitude Patrol",
  passiveDesc:
    "After Normal or Plunging Attacks hit opponents, gain the Ode to Flowers effect: DEF is increased by 8~16% and All Elemental DMG Bonus by 10~20% for 6s (max 2 stacks). At 2 stacks, every 1,000 DEF increases nearby party members' All Elemental DMG Bonus by 8~16% for 15s (max 25.6~51.2%).",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "patrol-wielder-def",
      label: "Wielder's DEF (e.g. 3200)",
      control: "stacks",
      defaultValue: 3200,
      max: 6000,
      hint: "DEF used for party Elemental DMG Bonus conversion (cap reached at 3200 DEF)",
    },
    {
      id: "patrol-ode-stacks",
      label: "Ode to Flowers Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "2 stacks trigger party Elemental DMG buff",
    }
  ],
  buffs: [
    {
      id: "patrol-party-elem-dmg",
      label: "Party All Elemental DMG Bonus (Peak Patrol Song)",
      description: "Nearby party members gain All Elemental DMG Bonus based on wielder's DEF",
      stat: "dmgBonus",
      refinementValues: [25.6, 32, 38.4, 44.8, 51.2],
      isTeamBuff: true,
      conditionKey: "patrol-ode-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['patrol-ode-stacks'] ?? 2); if (s < 2) return 0; const def = Number(ctx.inputs?.['patrol-wielder-def'] ?? 3200); const per1k = [8, 10, 12, 14, 16][r - 1]; const cap = [25.6, 32.0, 38.4, 44.8, 51.2][r - 1]; return Math.min((def / 1000) * per1k, cap); },
    },
    {
      id: "patrol-self-def",
      label: "Self DEF% (Peak Patrol Song)",
      stat: "def",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "patrol-ode-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['patrol-ode-stacks'] ?? 2); return s * [8, 10, 12, 14, 16][r - 1]; },
    },
    {
      id: "patrol-self-dmg",
      label: "Self All Elemental DMG Bonus (Peak Patrol Song)",
      stat: "dmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "patrol-ode-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['patrol-ode-stacks'] ?? 2); return s * [10, 12.5, 15, 17.5, 20][r - 1]; },
    }
  ],
  signatureFor: ["xilonen"],
};
