import type { WeaponConfig } from "../types";

export const deathmatch: WeaponConfig = {
  id: "deathmatch",
  name: "Deathmatch",
  type: "Polearm",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 36.8,
    baseValue: 8,
  },
  passiveName: "Gladiator",
  passiveDesc:
    "If there are at least 2 opponents nearby, ATK is increased by 16~32% and DEF is increased by 16~32%. If there are fewer than 2 opponents nearby, ATK is increased by 24~48%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "deathmatch-enemy-count",
      label: "Opponents Nearby (1 = <2, 2 = >=2)",
      control: "stacks",
      defaultValue: 1,
      max: 2,
      hint: "1: <2 opponents (+24~48% ATK), 2: >=2 opponents (+16~32% ATK & DEF)",
    }
  ],
  buffs: [
    {
      id: "deathmatch-atk",
      label: "ATK% (Deathmatch)",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "deathmatch-enemy-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['deathmatch-enemy-count'] ?? 1); const pct = count >= 2 ? [16, 20, 24, 28, 32][r - 1] : [24, 30, 36, 42, 48][r - 1]; return (pct / 100) * ctx.baseAtk; },
    },
    {
      id: "deathmatch-def",
      label: "DEF% (Deathmatch >=2 opponents)",
      stat: "def",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "deathmatch-enemy-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['deathmatch-enemy-count'] ?? 1); return count >= 2 ? [16, 20, 24, 28, 32][r - 1] : 0; },
    }
  ],
  
};
