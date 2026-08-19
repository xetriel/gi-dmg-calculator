import type { WeaponConfig } from "../types";

export const flowerWreathedFeathers: WeaponConfig = {
  id: "flower-wreathed-feathers",
  name: "Flower-Wreathed Feathers",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "A Plume of White Feathers",
  passiveDesc:
    "Aimed Shot charging time is reduced. Charged Attack DMG is increased by 20~40% (2x in Nightsoul's Blessing = +40~80%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "feather-nightsoul-active",
      label: "In Nightsoul's Blessing (2x CA DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Doubles Charged Attack DMG bonus (up to +40~80%)",
    }
  ],
  buffs: [
    {
      id: "feather-ca-dmg",
      label: "Charged Attack DMG Bonus (Flower-Wreathed Feathers)",
      stat: "chargedDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "feather-nightsoul-active",
      compute: (r, ctx) => { const nightsoul = (ctx.inputs?.['feather-nightsoul-active'] ?? '1') === '1' || Number(ctx.inputs?.['feather-nightsoul-active'] ?? 1) > 0; const mult = nightsoul ? 2 : 1; return [20, 25, 30, 35, 40][r - 1] * mult; },
    }
  ],
  
};
