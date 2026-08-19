import type { WeaponConfig } from "../types";

export const jadeVista: WeaponConfig = {
  id: "jade-vista",
  name: "Jade Vista",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "A Candle Woven From the Night",
  passiveDesc:
    "For other party members: increases wielder EM by 64~128 per member with same element, and increases wielder ATK by 12~24% per member with different element. Max 3 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "jade-vista-same-count",
      label: "Party Members with Same Element (0-3)",
      control: "stacks",
      defaultValue: 1,
      max: 3,
      hint: "+64~128 EM per member with matching element",
    },
    {
      id: "jade-vista-diff-count",
      label: "Party Members with Different Element (0-3)",
      control: "stacks",
      defaultValue: 2,
      max: 3,
      hint: "+12~24% ATK per member with different element",
    }
  ],
  buffs: [
    {
      id: "jade-vista-em",
      label: "Elemental Mastery (Jade Vista)",
      stat: "em",
      refinementValues: [64, 80, 96, 112, 128],
      isTeamBuff: false,
      conditionKey: "jade-vista-same-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['jade-vista-same-count'] ?? 1); const perStack = [64, 80, 96, 112, 128][r - 1]; return Math.min(count, 3) * perStack; },
    },
    {
      id: "jade-vista-atk",
      label: "ATK% (Jade Vista)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "jade-vista-diff-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['jade-vista-diff-count'] ?? 2); const perStack = [12, 15, 18, 21, 24][r - 1]; return ((Math.min(count, 3) * perStack) / 100) * ctx.baseAtk; },
    }
  ],
  
};
