import type { WeaponConfig } from "../types";

export const fruitfulHook: WeaponConfig = {
  id: "fruitful-hook",
  name: "Fruitful Hook",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "The Weight of the Falling Branch",
  passiveDesc:
    "Increases Plunging Attack CRIT Rate by 16~32%. After hitting an opponent with a Plunging Attack, Normal, Charged, and Plunging Attack DMG is increased by 16~32% for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "fruitful-hook-plunge-hit",
      label: "Plunging Attack Hit Active (+16~32% NA/CA/Plunge DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% Normal, Charged, and Plunging Attack DMG for 10s",
    }
  ],
  buffs: [
    {
      id: "fruitful-hook-plunge-crit",
      label: "Plunging Attack CRIT Rate% (Fruitful Hook)",
      stat: "critRate",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "fruitful-hook-plunge-dmg",
      label: "Plunging Attack DMG Bonus (Fruitful Hook)",
      stat: "plungeDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "fruitful-hook-plunge-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['fruitful-hook-plunge-hit'] ?? '1') === '1' || Number(ctx.inputs?.['fruitful-hook-plunge-hit'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    },
    {
      id: "fruitful-hook-na-dmg",
      label: "Normal Attack DMG Bonus (Fruitful Hook)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "fruitful-hook-plunge-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['fruitful-hook-plunge-hit'] ?? '1') === '1' || Number(ctx.inputs?.['fruitful-hook-plunge-hit'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    },
    {
      id: "fruitful-hook-ca-dmg",
      label: "Charged Attack DMG Bonus (Fruitful Hook)",
      stat: "chargedDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "fruitful-hook-plunge-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['fruitful-hook-plunge-hit'] ?? '1') === '1' || Number(ctx.inputs?.['fruitful-hook-plunge-hit'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    }
  ],
  
};
