import type { WeaponConfig } from "../types";

export const aThousandBlazingSuns: WeaponConfig = {
  id: "a-thousand-blazing-suns",
  name: "A Thousand Blazing Suns",
  type: "Claymore",
  rarity: 5,
  baseAtk: 741,
  lvl1BaseAtk: 49,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 11,
    baseValue: 2.4,
  },
  passiveName: "Sunset Reignites the Dawn",
  passiveDesc:
    "Gain the \"Scorching Brilliance\" effect when using an Elemental Skill or Burst: CRIT DMG increased by 20%/25%/30%/35%/40% and ATK increased by 28%/35%/42%/49%/56% for 6s. This effect can trigger once every 10s. While a \"Scorching Brilliance\" instance is active, its duration is increased by 2s after Normal or Charged attacks deal Elemental DMG. This effect can trigger once every second, and the max duration increase is 6s. Additionally, when the equipping character is in the Nightsoul's Blessing state, \"Scorching Brilliance\" effects are increased by 75%, and its duration will not count down when the equipping character is off-field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "blazing-suns-scorching-brilliance",
      label: "Scorching Brilliance Active (Skill/Burst used)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% CRIT DMG & +28~56% ATK for 6s (extended by Normal/Charged Elemental hits)",
    },
    {
      id: "blazing-suns-nightsoul",
      label: "In Nightsoul's Blessing State (+75% effect)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases Scorching Brilliance bonuses by 75% (+35~70% CRIT DMG & +49~98% ATK)",
    },
  ],
  buffs: [
    {
      id: "blazing-suns-crit-dmg",
      label: "CRIT DMG% (Scorching Brilliance)",
      stat: "critDmg",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "blazing-suns-scorching-brilliance",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["blazing-suns-scorching-brilliance"] ?? "1") === "1" ||
          Number(ctx.inputs?.["blazing-suns-scorching-brilliance"] ?? 1) > 0;
        if (!on) return 0;
        const nightsoul =
          (ctx.inputs?.["blazing-suns-nightsoul"] ?? "1") === "1" ||
          Number(ctx.inputs?.["blazing-suns-nightsoul"] ?? 1) > 0;
        const mult = nightsoul ? 1.75 : 1.0;
        return [20, 25, 30, 35, 40][r - 1] * mult;
      },
    },
    {
      id: "blazing-suns-atk",
      label: "ATK% (Scorching Brilliance)",
      stat: "atk",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "blazing-suns-scorching-brilliance",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["blazing-suns-scorching-brilliance"] ?? "1") === "1" ||
          Number(ctx.inputs?.["blazing-suns-scorching-brilliance"] ?? 1) > 0;
        if (!on) return 0;
        const nightsoul =
          (ctx.inputs?.["blazing-suns-nightsoul"] ?? "1") === "1" ||
          Number(ctx.inputs?.["blazing-suns-nightsoul"] ?? 1) > 0;
        const mult = nightsoul ? 1.75 : 1.0;
        return (([28, 35, 42, 49, 56][r - 1] * mult) / 100) * ctx.baseAtk;
      },
    },
  ],
  signatureFor: ["mavuika"],
};
