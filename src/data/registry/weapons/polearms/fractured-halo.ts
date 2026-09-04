import type { WeaponConfig } from "../types";

export const fracturedHalo: WeaponConfig = {
  id: "fractured-halo",
  name: "Fractured Halo",
  type: "Polearm",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Purifying Crown",
  passiveDesc:
    "After an Elemental Skill or Elemental Burst is used, ATK is increased by 24~48% for 20s. If the equipping character creates a Shield while this effect is active, they will gain the Electrifying Edict effect for 20s: All nearby party members deal 40~80% more Lunar-Charged DMG.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "halo-skill-burst-active",
      label: "Purifying Crown Active (+24~48% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+24~48% ATK for 20s after Skill or Burst",
    },
    {
      id: "halo-shield-active",
      label: "Electrifying Edict (Shield created active)",
      control: "toggle",
      defaultValue: 1,
      hint: "+40~80% party Lunar-Charged DMG for 20s",
    },
  ],
  buffs: [
    {
      id: "halo-atk",
      label: "ATK% (Purifying Crown)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "halo-skill-burst-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["halo-skill-burst-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["halo-skill-burst-active"] ?? 1) > 0;
        return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
  ],
};
