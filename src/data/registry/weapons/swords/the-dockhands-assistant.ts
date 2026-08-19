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
    "When the wielder is healed or heals all party members, gain a Stoic's Symbol for 30s. Max 3 symbols. Using an Elemental Skill or Burst consumes all symbols and increases Elemental Mastery by 40~80 and regenerates 2~4 Energy per symbol for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "dockhand-symbols",
      label: "Stoic Symbols Consumed (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+40~80 EM per symbol (Total +120~240 EM)",
    }
  ],
  buffs: [
    {
      id: "dockhand-em",
      label: "EM (The Dockhand's Assistant)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "dockhand-symbols",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["dockhand-symbols"]??3);return s*[40,50,60,70,80][r-1]},
    }
  ],
  
};
