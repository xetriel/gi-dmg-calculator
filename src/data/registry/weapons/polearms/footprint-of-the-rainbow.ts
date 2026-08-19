import type { WeaponConfig } from "../types";

export const footprintOfTheRainbow: WeaponConfig = {
  id: "footprint-of-the-rainbow",
  name: "Footprint of the Rainbow",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 51.7,
    baseValue: 11.3,
  },
  passiveName: "The Song of the Earth",
  passiveDesc:
    "Using an Elemental Skill increases DEF by 16~32% for 15s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "rainbow-skill-used",
      label: "Elemental Skill Used (+16~32% DEF)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% DEF for 15s",
    }
  ],
  buffs: [
    {
      id: "rainbow-def",
      label: "DEF% (Footprint of the Rainbow)",
      stat: "def",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "rainbow-skill-used",
      compute: (r, ctx) => { const on = (ctx.inputs?.['rainbow-skill-used'] ?? '1') === '1' || Number(ctx.inputs?.['rainbow-skill-used'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    }
  ],
  
};
