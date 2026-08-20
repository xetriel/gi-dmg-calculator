import type { WeaponConfig } from "../types";

export const mouunsMoon: WeaponConfig = {
  id: "mouuns-moon",
  name: "Mouun's Moon",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Watatsumi Wavewalker",
  passiveDesc:
    "For every point of the entire party's combined maximum Energy capacity, Elemental Burst DMG is increased by 0.12~0.24% (up to 40~80%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mouun-party-energy",
      label: "Party Total Energy Capacity (e.g. 300)",
      control: "stacks",
      defaultValue: 300,
      max: 400,
      hint: "+0.12~0.24% Burst DMG per total party energy capacity point",
    }
  ],
  buffs: [
    {
      id: "mouun-burst-dmg",
      label: "Elemental Burst DMG Bonus (Mouun's Moon)",
      stat: "burstDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "mouun-party-energy",
      compute: (r, ctx) => { const energy = Number(ctx.inputs?.['mouun-party-energy'] ?? 300); const ratio = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; const cap = [40, 50, 60, 70, 80][r - 1]; return Math.min(energy * ratio * 100, cap); },
    }
  ],
  
};
