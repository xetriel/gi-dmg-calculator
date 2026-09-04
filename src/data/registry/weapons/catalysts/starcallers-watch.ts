import type { WeaponConfig } from "../types";

export const starcallersWatch: WeaponConfig = {
  id: "starcallers-watch",
  name: "Starcaller's Watch",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 265,
    baseValue: 58,
  },
  passiveName: "Star Caller",
  passiveDesc:
    "After using an Elemental Skill, gain +24~48% DEF for 15s. If triggering an Elemental Reaction, gain +120~240 Elemental Mastery for 15s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "starcaller-skill-active",
      label: "Elemental Skill Used (+24~48% DEF)",
      control: "toggle",
      defaultValue: 1,
      hint: "+24~48% DEF for 15s",
    },
    {
      id: "starcaller-reaction-active",
      label: "Reaction Triggered (+120~240 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "+120~240 EM for 15s",
    }
  ],
  buffs: [
    {
      id: "starcaller-def",
      label: "DEF% (Starcaller's Watch)",
      stat: "def",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "starcaller-skill-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['starcaller-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['starcaller-skill-active'] ?? 1) > 0; return on ? [24, 30, 36, 42, 48][r - 1] : 0; },
    },
    {
      id: "starcaller-em",
      label: "Elemental Mastery (Starcaller's Watch)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "starcaller-reaction-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['starcaller-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['starcaller-reaction-active'] ?? 1) > 0; return on ? [120, 150, 180, 210, 240][r - 1] : 0; },
    }
  ],
  signatureFor: ["citlali"],
};
