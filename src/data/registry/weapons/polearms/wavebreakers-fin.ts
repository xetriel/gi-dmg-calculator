import type { WeaponConfig } from "../types";

export const wavebreakersFin: WeaponConfig = {
  id: "wavebreakers-fin",
  name: "Wavebreaker's Fin",
  type: "Polearm",
  rarity: 4,
  baseAtk: 620,
  lvl1BaseAtk: 45,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 13.8,
    baseValue: 3,
  },
  passiveName: "Watatsumi Wavewalker",
  passiveDesc:
    "For every point of the entire party's combined maximum Energy capacity, Elemental Burst DMG is increased by 0.12~0.24% (up to 40~80%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "wavebreaker-party-energy",
      label: "Party Total Energy Capacity (e.g. 300)",
      control: "stacks",
      defaultValue: 300,
      max: 400,
      hint: "+0.12~0.24% Burst DMG per total party energy capacity point",
    }
  ],
  buffs: [
    {
      id: "wavebreaker-burst-dmg",
      label: "Elemental Burst DMG Bonus (Wavebreaker's Fin)",
      stat: "burstDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "wavebreaker-party-energy",
      compute: (r, ctx) => { const energy = Number(ctx.inputs?.['wavebreaker-party-energy'] ?? 300); const ratio = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; const cap = [40, 50, 60, 70, 80][r - 1]; return Math.min(energy * ratio * 100, cap); },
    }
  ],
  
};
