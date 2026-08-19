import type { WeaponConfig } from "../types";

export const chainBreaker: WeaponConfig = {
  id: "chain-breaker",
  name: "Chain Breaker",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Flowers on the Iron Anchor",
  passiveDesc:
    "For every party member from Natlan or who has a different Elemental Type from the wielder, the wielder gains 4.8~9.6% increased ATK. When there are at least 3 such characters, Elemental Mastery is increased by 24~48.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "chain-breaker-members",
      label: "Eligible Members (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+4.8~9.6% ATK per member; +24~48 EM at 3 members",
    }
  ],
  buffs: [
    {
      id: "chain-breaker-atk",
      label: "ATK% (Chain Breaker)",
      stat: "atk",
      refinementValues: [14.4, 18, 21.6, 25.2, 28.8],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "chain-breaker-members",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["chain-breaker-members"]??3);return s*[4.8,6,7.2,8.4,9.6][r-1]/100*ctx.baseAtk},
    },
    {
      id: "chain-breaker-em",
      label: "Elemental Mastery (Chain Breaker 3 Members)",
      stat: "em",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      conditionKey: "chain-breaker-members",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["chain-breaker-members"]??3);return s>=3?[24,30,36,42,48][r-1]:0},
    }
  ],
  
};
