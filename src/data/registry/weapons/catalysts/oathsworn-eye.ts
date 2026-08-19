import type { WeaponConfig } from "../types";

export const oathswornEye: WeaponConfig = {
  id: "oathsworn-eye",
  name: "Oathsworn Eye",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "People of the Faltering Light",
  passiveDesc:
    "Increases Energy Recharge by 24~48% for 10s after using an Elemental Skill.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "oathsworn-skill-active",
      label: "Elemental Skill Used (+24~48% Energy Recharge)",
      control: "toggle",
      defaultValue: 1,
      hint: "+24~48% ER for 10s",
    }
  ],
  buffs: [
    {
      id: "oathsworn-er",
      label: "Energy Recharge% (Oathsworn Eye)",
      stat: "energyRecharge",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "oathsworn-skill-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['oathsworn-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['oathsworn-skill-active'] ?? 1) > 0; return on ? [24, 30, 36, 42, 48][r - 1] : 0; },
    }
  ],
  
};
