import type { WeaponConfig } from "../types";

export const blackTassel: WeaponConfig = {
  id: "black-tassel",
  name: "Black Tassel",
  type: "Polearm",
  rarity: 3,
  baseAtk: 354,
  lvl1BaseAtk: 38,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 46.9,
    baseValue: 10.2,
  },
  passiveName: "Bane of the Soft",
  passiveDesc:
    "Increases DMG against slimes by 40~80%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "black-tassel-slimes",
      label: "Target is a Slime (+40~80% DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "+40~80% All DMG bonus vs slimes",
    }
  ],
  buffs: [
    {
      id: "black-tassel-dmg",
      label: "All DMG Bonus vs Slimes (Black Tassel)",
      stat: "dmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "black-tassel-slimes",
      compute: (r, ctx) => { const on = (ctx.inputs?.['black-tassel-slimes'] ?? '0') === '1' || Number(ctx.inputs?.['black-tassel-slimes'] ?? 0) > 0; return on ? [40, 50, 60, 70, 80][r - 1] : 0; },
    }
  ],
  
};
