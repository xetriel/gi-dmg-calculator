import type { WeaponConfig } from "../types";

export const lightbearingMoonshard: WeaponConfig = {
  id: "lightbearing-moonshard",
  name: "Lightbearing Moonshard",
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
  passiveName: "Lunar Glow",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. When an Elemental Burst is used, increases ATK by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "moonshard-burst-active",
      label: "Elemental Burst Used (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "moonshard-elem-dmg",
      label: "All Elemental DMG Bonus (Lightbearing Moonshard)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "moonshard-atk",
      label: "ATK% (Lightbearing Moonshard)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "moonshard-burst-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['moonshard-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['moonshard-burst-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
