import type { WeaponConfig } from "../types";

export const kingsSquire: WeaponConfig = {
  id: "kings-squire",
  name: "King's Squire",
  type: "Bow",
  rarity: 4,
  baseAtk: 454,
  lvl1BaseAtk: 41,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Labyrinth Lord's Whim",
  passiveDesc:
    "Obtain Teachings of the Forest effect when unleashing Elemental Skill/Burst, increasing Elemental Mastery by 60~140 for 12s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "kings-squire-active",
      label: "Teachings of the Forest Active (+60~140 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "+60~140 EM for 12s",
    }
  ],
  buffs: [
    {
      id: "kings-squire-em",
      label: "Elemental Mastery (King's Squire)",
      stat: "em",
      refinementValues: [60, 80, 100, 120, 140],
      isTeamBuff: false,
      conditionKey: "kings-squire-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['kings-squire-active'] ?? '1') === '1' || Number(ctx.inputs?.['kings-squire-active'] ?? 1) > 0; return on ? [60, 80, 100, 120, 140][r - 1] : 0; },
    }
  ],
  
};
