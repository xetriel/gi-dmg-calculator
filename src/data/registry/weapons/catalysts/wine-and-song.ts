import type { WeaponConfig } from "../types";

export const wineAndSong: WeaponConfig = {
  id: "wine-and-song",
  name: "Wine and Song",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Ever-Changing",
  passiveDesc:
    "Hitting an opponent with a Normal Attack decreases Sprinting Stamina consumption by 14~22% for 5s. Sprinting increases ATK by 20~40% for 5s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "wine-sprint-active",
      label: "Sprinted Active (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK for 5s",
    }
  ],
  buffs: [
    {
      id: "wine-atk",
      label: "ATK% (Wine and Song)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "wine-sprint-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['wine-sprint-active'] ?? '1') === '1' || Number(ctx.inputs?.['wine-sprint-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
