import type { WeaponConfig } from "../types";

export const blackcliffAgate: WeaponConfig = {
  id: "blackcliff-agate",
  name: "Blackcliff Agate",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Press the Advantage",
  passiveDesc:
    "After defeating an opponent, ATK is increased by 12~24% for 30s. Max 3 stacks (+36~72% ATK).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "agate-defeat-stacks",
      label: "Opponents Defeated Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+12~24% ATK per stack (up to +36~72%)",
    }
  ],
  buffs: [
    {
      id: "agate-atk",
      label: "ATK% (Blackcliff Agate Stacks)",
      stat: "atk",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "agate-defeat-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['agate-defeat-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; },
    }
  ],
  
};
