import type { WeaponConfig } from "../types";

export const fluteOfEzpitzal: WeaponConfig = {
  id: "flute-of-ezpitzal",
  name: "Flute of Ezpitzal",
  type: "Sword",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "defPct",
    label: "DEF%",
    value: 69,
    baseValue: 15,
  },
  passiveName: "Smoke and Mirrors",
  passiveDesc:
    "Using an Elemental Skill increases DEF by 16~32% for 15s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "ezpitzal-skill-def",
      label: "Skill Used (+16~32% DEF)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% DEF for 15s",
    }
  ],
  buffs: [
    {
      id: "ezpitzal-def",
      label: "DEF% (Flute of Ezpitzal)",
      stat: "def",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "ezpitzal-skill-def",
      compute: (r, ctx) => { const on = (ctx.inputs?.['ezpitzal-skill-def'] ?? '1') === '1' || Number(ctx.inputs?.['ezpitzal-skill-def'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    }
  ],
  
};
