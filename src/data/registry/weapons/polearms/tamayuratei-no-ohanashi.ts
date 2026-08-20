import type { WeaponConfig } from "../types";

export const tamayurateiNoOhanashi: WeaponConfig = {
  id: "tamayuratei-no-ohanashi",
  name: "Tamayuratei no Ohanashi",
  type: "Polearm",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Ephemera",
  passiveDesc:
    "Using an Elemental Skill increases ATK by 16~32% and Movement SPD by 10% for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "tamayura-skill-used",
      label: "Elemental Skill Used (+16~32% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% ATK for 10s",
    }
  ],
  buffs: [
    {
      id: "tamayura-atk",
      label: "ATK% (Tamayuratei no Ohanashi)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "tamayura-skill-used",
      compute: (r, ctx) => { const on = (ctx.inputs?.['tamayura-skill-used'] ?? '1') === '1' || Number(ctx.inputs?.['tamayura-skill-used'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
