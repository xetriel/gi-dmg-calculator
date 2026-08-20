import type { WeaponConfig } from "../types";

export const symphonistOfScents: WeaponConfig = {
  id: "symphonist-of-scents",
  name: "Symphonist of Scents",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Fragrant Harmony",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. Normal and Charged Attacks dealing Elemental DMG increase ATK by 16~32% for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "symphonist-hit-active",
      label: "Elemental NA/CA Hit Active",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% ATK for 10s",
    }
  ],
  buffs: [
    {
      id: "symphonist-elem-dmg",
      label: "All Elemental DMG Bonus (Symphonist of Scents)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "symphonist-atk",
      label: "ATK% (Symphonist of Scents)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "symphonist-hit-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['symphonist-hit-active'] ?? '1') === '1' || Number(ctx.inputs?.['symphonist-hit-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
