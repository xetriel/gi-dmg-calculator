import type { WeaponConfig } from "../types";

export const tamayurateiNoOhanashi: WeaponConfig = {
  id: "tamayuratei-no-ohanashi",
  name: "Tamayuratei no Ohanashi",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Busybody's Running Light",
  passiveDesc:
    "Increase ATK by 20~40% and Movement SPD by 10% for 10s when using an Elemental Skill.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "tamayura-skill-active",
      label: "Skill Used Active (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK for 10s",
    },
  ],
  buffs: [
    {
      id: "tamayura-atk",
      label: "ATK% (Tamayuratei no Ohanashi)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "tamayura-skill-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["tamayura-skill-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["tamayura-skill-active"] ?? 1) > 0;
        return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
  ],
};
