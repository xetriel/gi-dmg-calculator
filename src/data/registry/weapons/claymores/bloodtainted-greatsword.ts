import type { WeaponConfig } from "../types";

export const bloodtaintedGreatsword: WeaponConfig = {
  id: "bloodtainted-greatsword",
  name: "Bloodtainted Greatsword",
  type: "Claymore",
  rarity: 3,
  baseAtk: 354,
  lvl1BaseAtk: 38,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 187,
    baseValue: 41,
  },
  passiveName: "Bane of Fire and Thunder",
  passiveDesc:
    "Increases DMG against opponents affected by Pyro or Electro by 12~24%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "bloodtainted-target-affected",
      label: "Target Affected by Pyro or Electro",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% All DMG bonus against affected enemies",
    }
  ],
  buffs: [
    {
      id: "bloodtainted-dmg",
      label: "All DMG Bonus vs Pyro/Electro (Bloodtainted Greatsword)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "bloodtainted-target-affected",
      compute: (r, ctx) => { const on = (ctx.inputs?.['bloodtainted-target-affected'] ?? '1') === '1' || Number(ctx.inputs?.['bloodtainted-target-affected'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  
};
