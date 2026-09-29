import type { WeaponConfig } from "../types";

export const emberwell: WeaponConfig = {
  id: "emberwell",
  name: "Emberwell",
  description:
    "A longsword that is entirely gemstone, said to be crafted for the path of righteousness. When unsheathed, it glows with the luster of blue flame.",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Starfire Upon the Snowplains",
  passiveDesc:
    "Triggering an Elemental Reaction increases the equipping character's ATK by 16%/20%/24%/28%/32% for 12s. Triggering a Stellar Glimmer reaction increases their Stellar Glimmer reaction DMG dealt by 16%/20%/24%/28%/32% for 12s. The aforementioned effects can trigger even when the character is not on the field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "emberwell-reaction-active",
      label: "Elemental Reaction Triggered (+16~32% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16/20/24/28/32% ATK for 12s (triggers off-field)",
    },
    {
      id: "emberwell-stellar-glimmer-active",
      label: "Stellar Glimmer Reaction Triggered (+16~32% Stellar Glimmer DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16/20/24/28/32% Stellar Glimmer reaction DMG for 12s (triggers off-field)",
    },
  ],
  buffs: [
    {
      id: "emberwell-reaction-atk",
      label: "ATK% (Starfire Upon the Snowplains)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "emberwell-reaction-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["emberwell-reaction-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["emberwell-reaction-active"] ?? 1) > 0;
        return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
    {
      id: "emberwell-stellar-glimmer-dmg",
      label: "Stellar Glimmer DMG Bonus (Starfire Upon the Snowplains)",
      stat: "stellarGlimmerDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "emberwell-stellar-glimmer-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["emberwell-stellar-glimmer-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["emberwell-stellar-glimmer-active"] ?? 1) > 0;
        return on ? [16, 20, 24, 28, 32][r - 1] : 0;
      },
    },
  ],
};
