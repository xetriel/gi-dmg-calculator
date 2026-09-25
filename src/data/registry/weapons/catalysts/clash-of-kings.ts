import type { WeaponConfig } from "../types";

export const clashOfKings: WeaponConfig = {
  id: "clash-of-kings",
  name: "Clash of Kings",
  description:
    "A golden box lavishly inlaid with precious jewels. It houses a game much beloved by the kings of the sands.",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Without Heed for Day nor Night",
  passiveDesc:
    'Using an Elemental Skill grants the equipping character "Laws of the Board," which increases their ATK by 20%/25%/30%/35%/40% and their Elemental Mastery by 100/125/150/175/200. This effect lasts 6s and can trigger once every 12s. Does not stack. The duration of this effect will also be extended by 6s if the equipping character hits an opponent with a Charged Attack while it is active. The effect can be extended for max 6s in this way.',
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "clash-laws-active",
      label: "Laws of the Board Active (+20~40% ATK, +100~200 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "Triggered on Elemental Skill for 6s (extended by 6s on Charged Attack hit)",
    },
  ],
  buffs: [
    {
      id: "clash-laws-atk",
      label: "ATK% (Without Heed for Day nor Night)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "clash-laws-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["clash-laws-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["clash-laws-active"] ?? 1) > 0;
        return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
    {
      id: "clash-laws-em",
      label: "Elemental Mastery (Without Heed for Day nor Night)",
      stat: "em",
      refinementValues: [100, 125, 150, 175, 200],
      isTeamBuff: false,
      conditionKey: "clash-laws-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["clash-laws-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["clash-laws-active"] ?? 1) > 0;
        return on ? [100, 125, 150, 175, 200][r - 1] : 0;
      },
    },
  ],
};
