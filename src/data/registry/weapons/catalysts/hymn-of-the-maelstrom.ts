import type { WeaponConfig } from "../types";

export const hymnOfTheMaelstrom: WeaponConfig = {
  id: "hymn-of-the-maelstrom",
  name: "Hymn of the Maelstrom",
  description:
    "An exquisite lamp crafted out of blue chalcedony which looks like a treasure right out of a fairy tale. It is said that a song of praise, forgotten by all, slumbers sealed inside this lamp.",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Rondo of Slumber",
  passiveDesc:
    'Increases Healing Bonus by 4%/5%/6%/7%/8%.\nWhen performing healing, the equipping character gains the "Vatsamonga\'s Vatic Vintage" effect, which increases Max HP by 4%/5%/6%/7%/8% as well as increases the currently active party member\'s ATK by 0.4%/0.5%/0.6%/0.7%/0.8% for every 1,000 Max HP the equipping character has over 40,000. A maximum of 8%/10%/12%/14%/16% ATK can be gained in this way. This effect lasts 10s, max 3 stacks.\nWhen a nearby party member triggers a Frozen or Stellar Swirl reaction, the aforementioned Max HP and ATK boosts will be further increased by 75% for the next 5s.\nThe aforementioned effects can still trigger even when the equipping character is not on the field.',
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "maelstrom-healing-stacks",
      label: "Vatsamonga's Vatic Vintage Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+4~8% HP per stack; grants ATK% to active party member based on HP over 40k",
    },
    {
      id: "maelstrom-reaction-boost",
      label: "Frozen / Stellar Swirl Triggered (+75% Boost)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases Max HP and active member ATK boosts by 75% for 5s",
    },
    {
      id: "wielder-max-hp",
      label: "Wielder's Max HP (e.g. 60000)",
      control: "stacks",
      defaultValue: 60000,
      max: 100000,
      hint: "Used to calculate active character ATK% bonus (counts HP above 40,000)",
    },
  ],
  buffs: [
    {
      id: "maelstrom-healing-bonus",
      label: "Healing Bonus% (Rondo of Slumber)",
      stat: "healingBonus",
      refinementValues: [4, 5, 6, 7, 8],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [4, 5, 6, 7, 8][r - 1],
    },
    {
      id: "maelstrom-self-hp",
      label: "Max HP% (Vatsamonga's Vatic Vintage)",
      stat: "hp",
      refinementValues: [4, 5, 6, 7, 8],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "maelstrom-healing-stacks",
      compute: (r, ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["maelstrom-healing-stacks"] ?? 3)));
        const boost =
          (ctx.inputs?.["maelstrom-reaction-boost"] ?? "1") === "1" ||
          Number(ctx.inputs?.["maelstrom-reaction-boost"] ?? 1) > 0
            ? 1.75
            : 1;
        const perStack = [4, 5, 6, 7, 8][r - 1];
        return stacks * perStack * boost;
      },
    },
    {
      id: "maelstrom-active-atk",
      label: "Active Character ATK% (Vatsamonga's Vatic Vintage)",
      description: "Active party member gains ATK% based on wielder Max HP over 40,000",
      stat: "atk",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "maelstrom-healing-stacks",
      compute: (r, ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["maelstrom-healing-stacks"] ?? 3)));
        if (stacks <= 0) return 0;
        const boost =
          (ctx.inputs?.["maelstrom-reaction-boost"] ?? "1") === "1" ||
          Number(ctx.inputs?.["maelstrom-reaction-boost"] ?? 1) > 0
            ? 1.75
            : 1;
        const hp = Number(ctx.inputs?.["wielder-max-hp"] ?? 60000);
        const extraThousands = Math.max(0, Math.floor((hp - 40000) / 1000));
        const perThousand = [0.4, 0.5, 0.6, 0.7, 0.8][r - 1];
        const maxPct = [8, 10, 12, 14, 16][r - 1];
        const rawPct = Math.min(maxPct, extraThousands * perThousand);
        return ((rawPct * boost) / 100) * ctx.baseAtk;
      },
    },
  ],
};
