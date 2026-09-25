import type { WeaponConfig } from "../types";

export const wintersHeavyHeart: WeaponConfig = {
  id: "winters-heavy-heart",
  name: "Winter's Heavy Heart",
  description:
    "A ceremonial artifact formed from the purest ice and snow. Legend has it that generations of Snegovik lords used it in coronation ceremonies until five hundred years ago.",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 55.1,
    baseValue: 12.0,
  },
  passiveName: "Secrets of Frost",
  passiveDesc:
    'The equipping character gains "Silver-Tinged Blood Pact": The equipping character\'s Elemental Mastery is increased by 24/30/36/42/48 for every Cryo character present in the party. For every Electro character present in the party, the equipping character\'s ATK is increased by 4.8%/6%/7.2%/8.4%/9.6%. Up to 4 Cryo or Electro characters can provide the above buffs.\nRadiance: Stellar Glimmer: The effect of Silver-Tinged Blood Pact is changed to: For every Cryo or Electro character present in the party, the equipping character gains a 20/25/30/35/40-point Elemental Mastery boost and deals 6%/7.5%/9%/10.5%/12% increased Stellar Glimmer reaction DMG.',
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "winters-heart-cryo-count",
      label: "Cryo Party Members (0-4)",
      control: "stacks",
      defaultValue: 2,
      max: 4,
      hint: "+24/30/36/42/48 EM per Cryo member (or +20~40 EM under Radiance)",
    },
    {
      id: "winters-heart-electro-count",
      label: "Electro Party Members (0-4)",
      control: "stacks",
      defaultValue: 1,
      max: 4,
      hint: "+4.8/6/7.2/8.4/9.6% ATK per Electro member (or +6~12% Stellar Glimmer DMG under Radiance)",
    },
    {
      id: "winters-heart-radiance-glimmer",
      label: "Radiance: Stellar Glimmer Active",
      control: "toggle",
      defaultValue: 0,
      hint: "Changes Blood Pact to EM (+20~40) and Stellar Glimmer DMG (+6~12%) per Cryo/Electro member",
    },
  ],
  buffs: [
    {
      id: "winters-heart-em",
      label: "Elemental Mastery (Secrets of Frost)",
      stat: "em",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      compute: (r, ctx) => {
        const cryo = Math.min(4, Math.max(0, Number(ctx.inputs?.["winters-heart-cryo-count"] ?? 2)));
        const electro = Math.min(4, Math.max(0, Number(ctx.inputs?.["winters-heart-electro-count"] ?? 1)));
        const total = Math.min(4, cryo + electro);
        const isGlimmer =
          (ctx.inputs?.["winters-heart-radiance-glimmer"] ?? "0") === "1" ||
          Number(ctx.inputs?.["winters-heart-radiance-glimmer"] ?? 0) > 0;
        if (isGlimmer) {
          return total * [20, 25, 30, 35, 40][r - 1];
        }
        return cryo * [24, 30, 36, 42, 48][r - 1];
      },
    },
    {
      id: "winters-heart-atk",
      label: "ATK% (Secrets of Frost)",
      stat: "atk",
      refinementValues: [4.8, 6, 7.2, 8.4, 9.6],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => {
        const isGlimmer =
          (ctx.inputs?.["winters-heart-radiance-glimmer"] ?? "0") === "1" ||
          Number(ctx.inputs?.["winters-heart-radiance-glimmer"] ?? 0) > 0;
        if (isGlimmer) return 0;
        const electro = Math.min(4, Math.max(0, Number(ctx.inputs?.["winters-heart-electro-count"] ?? 1)));
        const perElectro = [4.8, 6, 7.2, 8.4, 9.6][r - 1];
        return ((electro * perElectro) / 100) * ctx.baseAtk;
      },
    },
    {
      id: "winters-heart-stellar-glimmer",
      label: "Stellar Glimmer DMG Bonus (Secrets of Frost)",
      stat: "stellarGlimmerDmgBonus",
      refinementValues: [6, 7.5, 9, 10.5, 12],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => {
        const isGlimmer =
          (ctx.inputs?.["winters-heart-radiance-glimmer"] ?? "0") === "1" ||
          Number(ctx.inputs?.["winters-heart-radiance-glimmer"] ?? 0) > 0;
        if (!isGlimmer) return 0;
        const cryo = Math.min(4, Math.max(0, Number(ctx.inputs?.["winters-heart-cryo-count"] ?? 2)));
        const electro = Math.min(4, Math.max(0, Number(ctx.inputs?.["winters-heart-electro-count"] ?? 1)));
        const total = Math.min(4, cryo + electro);
        return total * [6, 7.5, 9, 10.5, 12][r - 1];
      },
    },
  ],
};
