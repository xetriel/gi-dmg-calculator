import type { WeaponConfig } from "../types";

export const akuoumaru: WeaponConfig = {
  id: "akuoumaru",
  name: "Akuoumaru",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Watatsumi Wavewalker",
  passiveDesc:
    "For every point of the entire party's combined maximum Energy capacity, Elemental Burst DMG is increased by 0.12~0.24% (up to 40~80%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "akuoumaru-party-energy",
      label: "Party Total Energy Capacity (e.g. 300)",
      control: "stacks",
      defaultValue: 300,
      max: 400,
      hint: "+0.12~0.24% Burst DMG per total party energy capacity point",
    }
  ],
  buffs: [
    {
      id: "akuoumaru-burst-dmg",
      label: "Elemental Burst DMG Bonus (Akuoumaru)",
      stat: "burstDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "akuoumaru-party-energy",
      compute: (r, ctx) => { const energy = Number(ctx.inputs?.['akuoumaru-party-energy'] ?? 300); const ratio = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; const cap = [40, 50, 60, 70, 80][r - 1]; return Math.min(energy * ratio * 100, cap); },
    }
  ],
  
};
