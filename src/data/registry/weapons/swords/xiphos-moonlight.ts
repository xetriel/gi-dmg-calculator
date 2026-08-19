import type { WeaponConfig } from "../types";

export const xiphosMoonlight: WeaponConfig = {
  id: "xiphos-moonlight",
  name: "Xiphos' Moonlight",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 165,
    baseValue: 36,
  },
  passiveName: "Jinni's Whispers",
  passiveDesc:
    "The following effect will trigger every 10s: The equipping character will gain 0.036~0.072% Energy Recharge for each point of Elemental Mastery they possess for 12s, with nearby party members gaining 30% of this buff for the same duration.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "xiphos-wielder-em",
      label: "Wielder's Elemental Mastery (e.g. 1000)",
      control: "stacks",
      defaultValue: 1000,
      max: 2000,
      hint: "Used to compute ER% gained by wielder and party",
    }
  ],
  buffs: [
    {
      id: "xiphos-self-er",
      label: "Self Energy Recharge% (Xiphos' Moonlight)",
      stat: "energyRecharge",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      compute: (r, ctx) => { const em = Number(ctx.inputs?.['xiphos-wielder-em'] ?? 1000); const perEm = [0.00036, 0.00045, 0.00054, 0.00063, 0.00072][r - 1]; return em * perEm * 100; },
    },
    {
      id: "xiphos-party-er",
      label: "Party Energy Recharge% (Xiphos' Moonlight)",
      description: "Nearby party members gain 30% of the wielder's Energy Recharge buff",
      stat: "energyRecharge",
      refinementValues: [10.8, 13.5, 16.2, 18.9, 21.6],
      isTeamBuff: true,
      compute: (r, ctx) => { const em = Number(ctx.inputs?.['xiphos-wielder-em'] ?? 1000); const perEm = [0.00036, 0.00045, 0.00054, 0.00063, 0.00072][r - 1]; return em * perEm * 0.3 * 100; },
    }
  ],
  
};
