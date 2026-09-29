import type { WeaponConfig } from "../types";

export const silverLight: WeaponConfig = {
  id: "silver-light",
  name: "Silver Light",
  description:
    "A longsword left behind by Wind Reader, one of the Three Hermits of Guizang in Liyue. Legend has it that it was forged out of sacred silver descended from the heavens, and that it once cleaved flowing sea water into two.",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.4,
    baseValue: 9.0,
  },
  passiveName: "Radiance on the Water",
  passiveDesc:
    "Increases Elemental Mastery by 52/65/78/91/104 for 12s after Elemental Skill use. Max 2 stacks, and each stack's duration is independent of the others.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "silver-light-stacks",
      label: "Radiance on the Water Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+52/65/78/91/104 EM per stack for 12s after Elemental Skill",
    },
  ],
  buffs: [
    {
      id: "silver-light-em",
      label: "Elemental Mastery (Radiance on the Water)",
      stat: "em",
      refinementValues: [52, 65, 78, 91, 104],
      isTeamBuff: false,
      conditionKey: "silver-light-stacks",
      compute: (r, ctx) => {
        const s = Math.min(2, Math.max(0, Number(ctx.inputs?.["silver-light-stacks"] ?? 2)));
        return s * [52, 65, 78, 91, 104][r - 1];
      },
    },
  ],
};
