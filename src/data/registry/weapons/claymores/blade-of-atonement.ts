import type { WeaponConfig } from "../types";

export const bladeOfAtonement: WeaponConfig = {
  id: "blade-of-atonement",
  name: "Blade of Atonement",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Repentance and Redemption",
  passiveDesc:
    "Triggering an Elemental Reaction increases the equipping character's Elemental Mastery by 64/80/96/112/128 for 12s, while triggering a Stellar Glimmer reaction increases their ATK by 16%/20%/24%/28%/32% for 12s. The aforementioned effects can trigger even when the character is not on the field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "atonement-reaction-active",
      label: "Elemental Reaction Triggered (+64~128 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "+64/80/96/112/128 Elemental Mastery for 12s (triggers off-field)",
    },
    {
      id: "atonement-stellar-glimmer-active",
      label: "Stellar Glimmer Reaction Triggered (+16~32% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16/20/24/28/32% ATK for 12s (triggers off-field)",
    },
  ],
  buffs: [
    {
      id: "atonement-reaction-em",
      label: "Elemental Mastery (Elemental Reaction)",
      stat: "em",
      refinementValues: [64, 80, 96, 112, 128],
      isTeamBuff: false,
      conditionKey: "atonement-reaction-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["atonement-reaction-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["atonement-reaction-active"] ?? 1) > 0;
        return on ? [64, 80, 96, 112, 128][r - 1] : 0;
      },
    },
    {
      id: "atonement-stellar-atk",
      label: "ATK% (Stellar Glimmer Reaction)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "atonement-stellar-glimmer-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["atonement-stellar-glimmer-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["atonement-stellar-glimmer-active"] ?? 1) > 0;
        return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
  ],
};
