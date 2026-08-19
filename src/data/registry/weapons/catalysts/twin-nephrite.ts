import type { WeaponConfig } from "../types";

export const twinNephrite: WeaponConfig = {
  id: "twin-nephrite",
  name: "Twin Nephrite",
  type: "Catalyst",
  rarity: 3,
  baseAtk: 448,
  lvl1BaseAtk: 40,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 15.6,
    baseValue: 3.4,
  },
  passiveName: "Guerilla Tactics",
  passiveDesc:
    "Defeating an opponent increases Movement SPD and ATK by 12~20% for 15s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "nephrite-defeat-active",
      label: "Opponent Defeated (+12~20% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~20% ATK for 15s",
    }
  ],
  buffs: [
    {
      id: "nephrite-atk",
      label: "ATK% (Twin Nephrite)",
      stat: "atk",
      refinementValues: [12, 14, 16, 18, 20],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "nephrite-defeat-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['nephrite-defeat-active'] ?? '1') === '1' || Number(ctx.inputs?.['nephrite-defeat-active'] ?? 1) > 0; return on ? ([12, 14, 16, 18, 20][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
