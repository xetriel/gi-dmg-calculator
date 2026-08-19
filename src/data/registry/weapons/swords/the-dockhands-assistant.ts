import type { WeaponConfig } from "../types";

export const theDockhandsAssistant: WeaponConfig = {
  id: "the-dockhands-assistant",
  name: "The Dockhand's Assistant",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Sea Shanty",
  passiveDesc:
    "When the equipping character is healed or heals others, gain a Stoic's Symbol for 30s (max 3). Using an Elemental Skill or Burst consumes all symbols to grant 40~80 EM per symbol for 10s and restore 2~4 Energy per symbol.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "dockhand-symbols",
      label: "Stoic Symbols Consumed (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+40~80 EM per symbol (up to +120~240 EM)",
    }
  ],
  buffs: [
    {
      id: "dockhand-em",
      label: "Elemental Mastery (The Dockhand's Assistant)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "dockhand-symbols",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['dockhand-symbols'] ?? 3); return s * [40, 50, 60, 70, 80][r - 1]; },
    }
  ],
  
};
