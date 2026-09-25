import type { WeaponConfig } from "../types";

export const echoesOfTheHeart: WeaponConfig = {
  id: "echoes-of-the-heart",
  name: "Echoes of the Heart",
  description:
    "A Catalyst said to crystallize voice. Within it lies a sealed oath of loyalty, as well as a heart long since forgotten by mankind.",
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
  passiveName: "Echo of a Vow",
  passiveDesc:
    "Triggering an Elemental Reaction increases the equipping character's Elemental Mastery by 60/75/90/105/120 for 12s, while triggering a Stellar Glimmer reaction increases their Stellar Glimmer reaction DMG dealt by 16%/20%/24%/28%/32% for 12s. The aforementioned effects can trigger even when the character is not on the field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "echoes-heart-reaction-active",
      label: "Elemental Reaction Triggered (+60~120 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "+60/75/90/105/120 EM for 12s (triggers off-field)",
    },
    {
      id: "echoes-heart-stellar-glimmer-active",
      label: "Stellar Glimmer Reaction Triggered (+16~32% Stellar Glimmer DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16/20/24/28/32% Stellar Glimmer reaction DMG for 12s (triggers off-field)",
    },
  ],
  buffs: [
    {
      id: "echoes-heart-reaction-em",
      label: "Elemental Mastery (Echo of a Vow)",
      stat: "em",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      conditionKey: "echoes-heart-reaction-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["echoes-heart-reaction-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["echoes-heart-reaction-active"] ?? 1) > 0;
        return on ? [60, 75, 90, 105, 120][r - 1] : 0;
      },
    },
    {
      id: "echoes-heart-stellar-glimmer-dmg",
      label: "Stellar Glimmer DMG Bonus (Echo of a Vow)",
      stat: "stellarGlimmerDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "echoes-heart-stellar-glimmer-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["echoes-heart-stellar-glimmer-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["echoes-heart-stellar-glimmer-active"] ?? 1) > 0;
        return on ? [16, 20, 24, 28, 32][r - 1] : 0;
      },
    },
  ],
};
