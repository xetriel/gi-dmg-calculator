import type { WeaponConfig } from "../types";

export const portablePowerSaw: WeaponConfig = {
  id: "portable-power-saw",
  name: "Portable Power Saw",
  type: "Claymore",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Sea Shanty",
  passiveDesc:
    "When the wielder is healed or heals all party members, gain a Stoic's Symbol for 30s (max 3). Using an Elemental Skill or Burst consumes all symbols to grant 40~80 EM per symbol for 10s and restore 2~4 Energy per symbol.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "saw-symbols",
      label: "Stoic Symbols Consumed (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+40~80 EM per symbol (up to +120~240 EM)",
    }
  ],
  buffs: [
    {
      id: "saw-em",
      label: "Elemental Mastery (Portable Power Saw)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "saw-symbols",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['saw-symbols'] ?? 3); return s * [40, 50, 60, 70, 80][r - 1]; },
    }
  ],
  
};
