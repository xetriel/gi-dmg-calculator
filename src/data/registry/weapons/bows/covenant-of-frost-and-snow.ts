import type { WeaponConfig } from "../types";

export const covenantOfFrostAndSnow: WeaponConfig = {
  id: "covenant-of-frost-and-snow",
  name: "Covenant of Frost and Snow",
  description:
    "A longbow crafted to preserve order. Its cold radiance perfectly emanates the ideals of absolute fairness and justice.",
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
    "For 12s after the equipping character uses an Elemental Skill, their Elemental Mastery is increased by 120/150/180/210/240.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "covenant-skill-active",
      label: "Elemental Skill Used (+120~240 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "+120/150/180/210/240 EM for 12s",
    },
  ],
  buffs: [
    {
      id: "covenant-em",
      label: "Elemental Mastery (The Law's Equilibrium)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "covenant-skill-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["covenant-skill-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["covenant-skill-active"] ?? 1) > 0;
        return on ? [120, 150, 180, 210, 240][r - 1] : 0;
      },
    },
  ],
};
