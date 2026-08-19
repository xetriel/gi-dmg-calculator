import type { WeaponConfig } from "../types";

export const lionsRoar: WeaponConfig = {
  id: "lions-roar",
  name: "Lion's Roar",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Bane of Fire and Thunder",
  passiveDesc:
    "Increases DMG against opponents affected by Pyro or Electro by 20~36%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "lions-roar-target-affected",
      label: "Target Affected by Pyro or Electro",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~36% All DMG bonus against affected enemies",
    }
  ],
  buffs: [
    {
      id: "lions-roar-dmg",
      label: "All DMG Bonus vs Pyro/Electro (Lion's Roar)",
      stat: "dmgBonus",
      refinementValues: [20, 24, 28, 32, 36],
      isTeamBuff: false,
      conditionKey: "lions-roar-target-affected",
      compute: (r, ctx) => { const on = (ctx.inputs?.['lions-roar-target-affected'] ?? '1') === '1' || Number(ctx.inputs?.['lions-roar-target-affected'] ?? 1) > 0; return on ? [20, 24, 28, 32, 36][r - 1] : 0; },
    }
  ],
  
};
