import type { WeaponConfig } from "../types";

export const tamayurateiNoOhanashi: WeaponConfig = {
  id: "tamayuratei-no-ohanashi",
  name: "Tamayuratei no Ohanashi",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10.0,
  },
  passiveName: "Busybody's Running Light",
  passiveDesc:
    "Using an Elemental Skill increases the wielder's ATK by 20%~40% and Movement SPD by 10% for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "tamayuratei-skill-active",
      label: "Skill Used (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK for 10s",
    },
  ],
  buffs: [
    {
      id: "tamayuratei-atk",
      label: "ATK% (Tamayuratei no Ohanashi)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "tamayuratei-skill-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["tamayuratei-skill-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["tamayuratei-skill-active"] ?? 1) > 0;
        return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
  ],
};
