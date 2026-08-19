import type { WeaponConfig } from "../types";

export const talkingStick: WeaponConfig = {
  id: "talking-stick",
  name: "Talking Stick",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 18.4,
    baseValue: 4,
  },
  passiveName: "\"The Five Sights\"",
  passiveDesc:
    "ATK will be increased by 16~32% for 15s after being affected by Pyro. All Elemental DMG Bonus will be increased by 12~24% for 15s after being affected by Hydro, Cryo, Electro, or Dendro.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "talking-stick-pyro-aura",
      label: "Affected by Pyro (+16~32% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% ATK for 15s",
    },
    {
      id: "talking-stick-elem-aura",
      label: "Affected by Hydro/Cryo/Electro/Dendro (+12~24% Elem DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% All Elemental DMG Bonus for 15s",
    }
  ],
  buffs: [
    {
      id: "talking-stick-atk",
      label: "ATK% from Pyro Aura (Talking Stick)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "talking-stick-pyro-aura",
      compute: (r, ctx) => { const on = (ctx.inputs?.['talking-stick-pyro-aura'] ?? '1') === '1' || Number(ctx.inputs?.['talking-stick-pyro-aura'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "talking-stick-elem-dmg",
      label: "All Elemental DMG Bonus (Talking Stick)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "talking-stick-elem-aura",
      compute: (r, ctx) => { const on = (ctx.inputs?.['talking-stick-elem-aura'] ?? '1') === '1' || Number(ctx.inputs?.['talking-stick-elem-aura'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  
};
