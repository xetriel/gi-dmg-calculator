import type { WeaponConfig } from "../types";

export const songOfTheVigil: WeaponConfig = {
  id: "song-of-the-vigil",
  name: "Song of the Vigil",
  description:
    "A long spear that once stood guard over all. Today, it has found a new purpose with children and their games of make-believe.",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 110,
    baseValue: 24,
  },
  passiveName: "Cadence of Days Gone By",
  passiveDesc:
    "Triggering an Elemental Reaction regenerates 4/5/6/7/8 Elemental Energy for the equipping character. This effect can trigger once every 9s. On the other hand, triggering a Stellar Glimmer reaction increases their ATK by 20%/25%/30%/35%/40% for 12s. The aforementioned effects can trigger even when the character is not on the field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "song-vigil-stellar-glimmer-active",
      label: "Stellar Glimmer Reaction Triggered (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20/25/30/35/40% ATK for 12s (triggers off-field)",
    },
  ],
  buffs: [
    {
      id: "song-vigil-stellar-atk",
      label: "ATK% (Cadence of Days Gone By)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "song-vigil-stellar-glimmer-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["song-vigil-stellar-glimmer-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["song-vigil-stellar-glimmer-active"] ?? 1) > 0;
        return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
  ],
};
