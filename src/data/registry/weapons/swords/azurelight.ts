import type { WeaponConfig } from "../types";

export const azurelight: WeaponConfig = {
  id: "azurelight",
  name: "Azurelight",
  type: "Sword",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 22.1,
    baseValue: 4.8,
  },
  passiveName: "Whitehill's Bestowal",
  passiveDesc:
    "Within 12s after an Elemental Skill is used, ATK is increased by 24~48%. During this time, when the equipping character has 0 Energy, ATK will be further increased by 24~48%, and CRIT DMG will be increased by 40~80%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "azurelight-skill-active",
      label: "Skill Used Active (+24~48% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+24~48% ATK for 12s",
    },
    {
      id: "azurelight-zero-energy",
      label: "At 0 Energy (+24~48% ATK & +40~80% CRIT DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Further +24~48% ATK and +40~80% CRIT DMG when at 0 Energy",
    },
  ],
  buffs: [
    {
      id: "azurelight-base-atk",
      label: "ATK% (Whitehill's Bestowal Base)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "azurelight-skill-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["azurelight-skill-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["azurelight-skill-active"] ?? 1) > 0;
        return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
    {
      id: "azurelight-zero-energy-atk",
      label: "ATK% (0 Energy Bonus)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "azurelight-zero-energy",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["azurelight-skill-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["azurelight-skill-active"] ?? 1) > 0;
        const zeroE =
          (ctx.inputs?.["azurelight-zero-energy"] ?? "0") === "1" ||
          Number(ctx.inputs?.["azurelight-zero-energy"] ?? 0) > 0;
        return on && zeroE ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
    {
      id: "azurelight-crit-dmg",
      label: "CRIT DMG% (0 Energy Bonus)",
      stat: "critDmg",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "azurelight-zero-energy",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["azurelight-skill-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["azurelight-skill-active"] ?? 1) > 0;
        const zeroE =
          (ctx.inputs?.["azurelight-zero-energy"] ?? "0") === "1" ||
          Number(ctx.inputs?.["azurelight-zero-energy"] ?? 0) > 0;
        return on && zeroE ? [40, 50, 60, 70, 80][r - 1] : 0;
      },
    },
  ],
};
