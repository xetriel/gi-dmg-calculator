import type { WeaponConfig } from "../types";

export const magicGuide: WeaponConfig = {
  id: "magic-guide",
  name: "Magic Guide",
  type: "Catalyst",
  rarity: 3,
  baseAtk: 354,
  lvl1BaseAtk: 38,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 187,
    baseValue: 41,
  },
  passiveName: "Bane of Storm and Tide",
  passiveDesc:
    "Increases DMG against opponents affected by Hydro or Electro by 12~24%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "magic-guide-target-affected",
      label: "Target Affected by Hydro or Electro (+12~24% DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% All DMG bonus against affected enemies",
    }
  ],
  buffs: [
    {
      id: "magic-guide-dmg",
      label: "All DMG Bonus vs Hydro/Electro (Magic Guide)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "magic-guide-target-affected",
      compute: (r, ctx) => { const on = (ctx.inputs?.['magic-guide-target-affected'] ?? '1') === '1' || Number(ctx.inputs?.['magic-guide-target-affected'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  
};
