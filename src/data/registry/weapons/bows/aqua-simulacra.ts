import type { WeaponConfig } from "../types";

export const aquaSimulacra: WeaponConfig = {
  id: "aqua-simulacra",
  name: "Aqua Simulacra",
  type: "Bow",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "The Cleansing Form",
  passiveDesc:
    "HP is increased by 16~32%. When there are opponents nearby, the DMG dealt by the wielder is increased by 20~40%. This takes effect whether the character is on-field or off-field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "aqua-nearby-opponents",
      label: "Opponents Nearby (Active DMG Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% All DMG bonus",
    }
  ],
  buffs: [
    {
      id: "aqua-hp",
      label: "HP% (Aqua Simulacra)",
      stat: "hp",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "aqua-dmg",
      label: "All DMG Bonus (Aqua Simulacra Nearby)",
      stat: "dmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "aqua-nearby-opponents",
      compute: (r, ctx) => { const on = (ctx.inputs?.['aqua-nearby-opponents'] ?? '1') === '1' || Number(ctx.inputs?.['aqua-nearby-opponents'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    }
  ],
  signatureFor: ["yelan"],
};
