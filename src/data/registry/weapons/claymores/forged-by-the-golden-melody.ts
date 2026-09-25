import type { WeaponConfig } from "../types";

export const forgedByTheGoldenMelody: WeaponConfig = {
  id: "forged-by-the-golden-melody",
  name: "Forged by the Golden Melody",
  description:
    "A greatsword decorated in gold. Legend has it that it was the favored weapon of a certain exalted Harmost back in the distant past.",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Day and Night in Counterpoint",
  passiveDesc:
    'Every 10s, the equipping character plays a "Harmonic Movement" of the corresponding type for a boost in the following order: +18%/22.5%/27%/31.5%/36% ATK > +120/150/180/210/240 Elemental Mastery > +28%/35%/42%/49%/56% Stellar Glimmer reaction DMG. Each instance of Harmonic Movement lasts 10s. This effect can trigger even when the equipping character is not on the field. Triggering a Stellar Glimmer reaction will also grant an additional 12-second instance of "Harmonic Movement: Contrapuntal" with the same effects as the Harmonic Movement active when Stellar Glimmer is triggered. This effect stacks with the original Harmonic Movement effect, and can trigger once every 12s.',
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "golden-melody-atk-movement",
      label: "Harmonic Movement: ATK (+18~36% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "First 10s movement in rotation (triggers off-field)",
    },
    {
      id: "golden-melody-em-movement",
      label: "Harmonic Movement: EM (+120~240 EM)",
      control: "toggle",
      defaultValue: 0,
      hint: "Second 10s movement in rotation (triggers off-field)",
    },
    {
      id: "golden-melody-glimmer-movement",
      label: "Harmonic Movement: Stellar Glimmer (+28~56% DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Third 10s movement in rotation (triggers off-field)",
    },
    {
      id: "golden-melody-contrapuntal",
      label: "Harmonic Movement: Contrapuntal (2x Active Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "Triggering Stellar Glimmer stacks a duplicate instance for 12s",
    },
  ],
  buffs: [
    {
      id: "golden-melody-atk",
      label: "ATK% (Day and Night in Counterpoint)",
      stat: "atk",
      refinementValues: [18, 22.5, 27, 31.5, 36],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "golden-melody-atk-movement",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["golden-melody-atk-movement"] ?? "1") === "1" ||
          Number(ctx.inputs?.["golden-melody-atk-movement"] ?? 1) > 0;
        if (!on) return 0;
        const contrapuntal =
          (ctx.inputs?.["golden-melody-contrapuntal"] ?? "1") === "1" ||
          Number(ctx.inputs?.["golden-melody-contrapuntal"] ?? 1) > 0;
        const mult = contrapuntal ? 2 : 1;
        return (([18, 22.5, 27, 31.5, 36][r - 1] * mult) / 100) * ctx.baseAtk;
      },
    },
    {
      id: "golden-melody-em",
      label: "Elemental Mastery (Day and Night in Counterpoint)",
      stat: "em",
      refinementValues: [120, 150, 180, 210, 240],
      isTeamBuff: false,
      conditionKey: "golden-melody-em-movement",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["golden-melody-em-movement"] ?? "0") === "1" ||
          Number(ctx.inputs?.["golden-melody-em-movement"] ?? 0) > 0;
        if (!on) return 0;
        const contrapuntal =
          (ctx.inputs?.["golden-melody-contrapuntal"] ?? "1") === "1" ||
          Number(ctx.inputs?.["golden-melody-contrapuntal"] ?? 1) > 0;
        const mult = contrapuntal ? 2 : 1;
        return [120, 150, 180, 210, 240][r - 1] * mult;
      },
    },
    {
      id: "golden-melody-glimmer",
      label: "Stellar Glimmer DMG Bonus (Day and Night in Counterpoint)",
      stat: "stellarGlimmerDmgBonus",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "golden-melody-glimmer-movement",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["golden-melody-glimmer-movement"] ?? "0") === "1" ||
          Number(ctx.inputs?.["golden-melody-glimmer-movement"] ?? 0) > 0;
        if (!on) return 0;
        const contrapuntal =
          (ctx.inputs?.["golden-melody-contrapuntal"] ?? "1") === "1" ||
          Number(ctx.inputs?.["golden-melody-contrapuntal"] ?? 1) > 0;
        const mult = contrapuntal ? 2 : 1;
        return [28, 35, 42, 49, 56][r - 1] * mult;
      },
    },
  ],
};
