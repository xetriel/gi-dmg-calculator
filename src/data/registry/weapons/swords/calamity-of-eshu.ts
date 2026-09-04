import type { WeaponConfig } from "../types";

export const calamityOfEshu: WeaponConfig = {
  id: "calamity-of-eshu",
  name: "Calamity of Eshu",
  type: "Sword",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Diffusing Boundary",
  passiveDesc:
    "When the equipping character has >= 70% HP, increases Normal and Charged Attack DMG by 20~40% and Normal and Charged Attack CRIT Rate by 8~16%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "calamity-eshu-hp-ge-70",
      label: "HP >= 70% (+20~40% NA/CA DMG, +8~16% CRIT)",
      control: "toggle",
      defaultValue: 1,
      hint: "Active when current HP is at or above 70%",
    }
  ],
  buffs: [
    {
      id: "eshu-na-dmg",
      label: "Normal Attack DMG Bonus (Calamity of Eshu)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "calamity-eshu-hp-ge-70",
      compute: (r, ctx) => { const on = (ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? '1') === '1' || Number(ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    },
    {
      id: "eshu-ca-dmg",
      label: "Charged Attack DMG Bonus (Calamity of Eshu)",
      stat: "chargedDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "calamity-eshu-hp-ge-70",
      compute: (r, ctx) => { const on = (ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? '1') === '1' || Number(ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    },
    {
      id: "eshu-crit-rate",
      label: "NA & CA CRIT Rate% (Calamity of Eshu)",
      stat: "critRate",
      refinementValues: [8, 10, 12, 14, 16],
      isTeamBuff: false,
      conditionKey: "calamity-eshu-hp-ge-70",
      compute: (r, ctx) => { const on = (ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? '1') === '1' || Number(ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? 1) > 0; return on ? [8, 10, 12, 14, 16][r - 1] : 0; },
    }
  ],
  
};
