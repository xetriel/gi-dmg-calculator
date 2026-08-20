import type { WeaponConfig } from "../types";

export const exaiphanesBlade: WeaponConfig = {
  id: "exaiphanes-blade",
  name: "Exaiphanes Blade",
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
  passiveName: "Sudden Manifestation",
  passiveDesc:
    "Increases All Elemental DMG Bonus by 12~24%. After using an Elemental Skill, increases Normal and Charged Attack DMG by 20~40% for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "exaiphanes-skill-active",
      label: "Skill Used (+20~40% NA/CA DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% Normal & Charged Attack DMG for 10s",
    }
  ],
  buffs: [
    {
      id: "exaiphanes-elem-dmg",
      label: "All Elemental DMG Bonus (Exaiphanes Blade)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "exaiphanes-na-dmg",
      label: "Normal Attack DMG Bonus (Exaiphanes)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "exaiphanes-skill-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['exaiphanes-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['exaiphanes-skill-active'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    },
    {
      id: "exaiphanes-ca-dmg",
      label: "Charged Attack DMG Bonus (Exaiphanes)",
      stat: "chargedDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "exaiphanes-skill-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['exaiphanes-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['exaiphanes-skill-active'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    }
  ],
  
};
