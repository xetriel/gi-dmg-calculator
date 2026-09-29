import type { WeaponConfig } from "../types";

export const jadeVista: WeaponConfig = {
  id: "jade-vista",
  name: "Jade Vista",
  description:
    "A longbow of immense strength. It shines with the radiance of dreams even in the darkest of nights.",
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
    "For every party member other than the equipping character: · Who is of the same Elemental Type as the equipper: The equipping character's Elemental Mastery is increased by 64/80/96/112/128; · Who is not of the same Elemental Type as the equipper: The equipping character's ATK increases by 12%/15%/18%/21%/24%. The two effects described above can stack up to 3 times in total, with Elemental Mastery buffs applied first.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "jade-vista-same-count",
      label: "Party Members with Same Element (0-3)",
      control: "stacks",
      defaultValue: 1,
      max: 3,
      hint: "+64/80/96/112/128 EM per member with matching element (takes priority in 3-stack max)",
    },
    {
      id: "jade-vista-diff-count",
      label: "Party Members with Different Element (0-3)",
      control: "stacks",
      defaultValue: 2,
      max: 3,
      hint: "+12/15/18/21/24% ATK per member with different element (up to 3 total stacks combined)",
    },
  ],
  buffs: [
    {
      id: "jade-vista-em",
      label: "Elemental Mastery (A Candle Woven From the Night)",
      stat: "em",
      refinementValues: [64, 80, 96, 112, 128],
      isTeamBuff: false,
      conditionKey: "jade-vista-same-count",
      compute: (r, ctx) => {
        const same = Math.min(3, Math.max(0, Number(ctx.inputs?.["jade-vista-same-count"] ?? 1)));
        const perStack = [64, 80, 96, 112, 128][r - 1];
        return same * perStack;
      },
    },
    {
      id: "jade-vista-atk",
      label: "ATK% (A Candle Woven From the Night)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "jade-vista-diff-count",
      compute: (r, ctx) => {
        const same = Math.min(3, Math.max(0, Number(ctx.inputs?.["jade-vista-same-count"] ?? 1)));
        const diffRaw = Math.min(3, Math.max(0, Number(ctx.inputs?.["jade-vista-diff-count"] ?? 2)));
        const diff = Math.min(3 - same, diffRaw);
        const perStack = [12, 15, 18, 21, 24][r - 1];
        return ((diff * perStack) / 100) * ctx.baseAtk;
      },
    },
  ],
};
