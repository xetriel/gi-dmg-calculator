import type { WeaponConfig } from "../types";

export const darkIronSword: WeaponConfig = {
  id: "dark-iron-sword",
  name: "Dark Iron Sword",
  type: "Sword",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 141,
    baseValue: 31,
  },
  passiveName: "Overloaded",
  passiveDesc:
    "Upon causing an Overloaded, Superconduct, Electro-Charged, Quicken, Aggravate, Hyperbloom, or Electro-infused Swirl reaction, ATK is increased by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "dark-iron-reaction-active",
      label: "Electro Reaction Triggered Active",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "dark-iron-atk",
      label: "ATK% (Dark Iron Sword)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "dark-iron-reaction-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['dark-iron-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['dark-iron-reaction-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
