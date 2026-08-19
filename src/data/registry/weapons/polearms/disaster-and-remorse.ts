import type { WeaponConfig } from "../types";

export const disasterAndRemorse: WeaponConfig = {
  id: "disaster-and-remorse",
  name: "Disaster and Remorse",
  type: "Polearm",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Remorseful Cry",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. Using an Elemental Skill or Elemental Burst increases ATK by 16~32% for 12s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "disaster-skill-burst-active",
      label: "Skill/Burst Used (+16~32% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "disaster-elem-dmg",
      label: "All Elemental DMG Bonus (Disaster and Remorse)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "disaster-atk",
      label: "ATK% (Disaster and Remorse)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "disaster-skill-burst-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['disaster-skill-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['disaster-skill-burst-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
