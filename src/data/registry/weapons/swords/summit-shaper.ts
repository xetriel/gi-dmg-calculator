import type { WeaponConfig } from "../types";

export const summitShaper: WeaponConfig = {
  id: "summit-shaper",
  name: "Summit Shaper",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 49.6,
    baseValue: 10.8,
  },
  passiveName: "Golden Majesty",
  passiveDesc:
    "Increases Shield Strength by 20~40%. Scoring hits on opponents increases ATK by 4~8% for 8s. Max 5 stacks. While protected by a shield, this ATK increase effect is increased by 100%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "summit-stacks",
      label: "Golden Majesty Stacks (0-5)",
      control: "stacks",
      defaultValue: 5,
      max: 5,
      hint: "+4~8% ATK per stack",
    },
    {
      id: "summit-shielded",
      label: "Protected by Shield (2x ATK Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "Doubles ATK bonus from stacks",
    }
  ],
  buffs: [
    {
      id: "summit-shield-strength",
      label: "Shield Strength (Summit Shaper)",
      stat: "shieldStrength",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "summit-atk",
      label: "ATK% (Summit Shaper Stacks)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "summit-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['summit-stacks'] ?? 5); const shielded = (ctx.inputs?.['summit-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['summit-shielded'] ?? 1) > 0; const mult = shielded ? 2 : 1; return ((s * [4, 5, 6, 7, 8][r - 1] * mult) / 100) * ctx.baseAtk; },
    }
  ],
  
};
