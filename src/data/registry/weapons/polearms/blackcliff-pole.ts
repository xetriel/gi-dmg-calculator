import type { WeaponConfig } from "../types";

export const blackcliffPole: WeaponConfig = {
  id: "blackcliff-pole",
  name: "Blackcliff Pole",
  type: "Polearm",
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
    "After defeating an opponent, ATK is increased by 12~24% for 30s. Max 3 stacks (up to +36~72% ATK).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "blackcliff-pole-stacks",
      label: "Opponents Defeated Stacks (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+12~24% ATK per stack (up to +36~72%)",
    }
  ],
  buffs: [
    {
      id: "blackcliff-pole-atk",
      label: "ATK% (Blackcliff Pole Stacks)",
      stat: "atk",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "blackcliff-pole-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['blackcliff-pole-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; },
    }
  ],
  
};
