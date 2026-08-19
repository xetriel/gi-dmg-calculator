import type { WeaponConfig } from "../types";

export const covenantOfFrostAndSnow: WeaponConfig = {
  id: "covenant-of-frost-and-snow",
  name: "Covenant of Frost and Snow",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 51.7,
    baseValue: 11.3,
  },
  passiveName: "The Law's Equilibrium",
  passiveDesc:
    "Using an Elemental Skill increases Elemental Mastery by 120~240 for 12s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "covenant-skill-active",
      label: "Elemental Skill Used (+120~240 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "+120~240 EM for 12s",
    }
  ],
  buffs: [
    {
      id: "covenant-em",
      label: "Elemental Mastery (Covenant of Frost and Snow)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "covenant-skill-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['covenant-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['covenant-skill-active'] ?? 1) > 0; return on ? [120, 150, 180, 210, 240][r - 1] : 0; },
    }
  ],
  
};
