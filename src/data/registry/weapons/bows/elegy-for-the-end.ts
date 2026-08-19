import type { WeaponConfig } from "../types";

export const elegyForTheEnd: WeaponConfig = {
  id: "elegy-for-the-end",
  name: "Elegy for the End",
  type: "Bow",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "The Parting Refrain",
  passiveDesc:
    "Increases Elemental Mastery by 60~120. When Elemental Skill/Burst hits opponents, gain Sigil of Remembrance (max 4). At 4 Sigils, all nearby party members gain Millennial Movement: Farewell Song (+100~200 EM and +20~40% ATK for 12s).",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "elegy-sigils-active",
      label: "Millennial Movement: Farewell Song Active (+100~200 EM, +20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +100~200 EM and +20~40% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "elegy-base-em",
      label: "Elemental Mastery (Elegy Base)",
      stat: "em",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      compute: (r) => [60, 75, 90, 105, 120][r - 1],
    },
    {
      id: "elegy-party-em",
      label: "Party Elemental Mastery (Millennial Movement)",
      description: "All nearby party members gain +100~200 Elemental Mastery",
      stat: "em",
      refinementValues: [100, 125, 150, 175, 200],
      isTeamBuff: true,
      conditionKey: "elegy-sigils-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['elegy-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['elegy-sigils-active'] ?? 1) > 0; return on ? [100, 125, 150, 175, 200][r - 1] : 0; },
    },
    {
      id: "elegy-party-atk",
      label: "Party ATK% (Millennial Movement)",
      description: "All nearby party members gain +20~40% ATK",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "elegy-sigils-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['elegy-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['elegy-sigils-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  signatureFor: ["venti"],
};
