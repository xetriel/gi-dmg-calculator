import type { WeaponConfig } from "../types";

export const alleyHunter: WeaponConfig = {
  id: "alley-hunter",
  name: "Alley Hunter",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Oppidan Ambush",
  passiveDesc:
    "While in the party not on the field, DMG increases by 2~4% every second (max 10 stacks = +20~40% DMG). When on field for more than 4s, DMG buff decreases by 4% per second.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "alley-hunter-stacks",
      label: "Oppidan Ambush Stacks (0-10)",
      control: "stacks",
      defaultValue: 10,
      max: 10,
      hint: "+2~4% All DMG per stack (up to +20~40%)",
    }
  ],
  buffs: [
    {
      id: "alley-hunter-dmg",
      label: "All DMG Bonus (Alley Hunter)",
      stat: "dmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "alley-hunter-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['alley-hunter-stacks'] ?? 10); return s * [2, 2.5, 3, 3.5, 4][r - 1]; },
    }
  ],
  
};
