import type { WeaponConfig } from "../types";

export const primordialJadeCutter: WeaponConfig = {
  id: "primordial-jade-cutter",
  name: "Primordial Jade Cutter",
  type: "Sword",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Protector's Virtue",
  passiveDesc:
    "HP is increased by 20~40%. Additionally, provides an ATK Bonus based on 1.2~2.4% of the wielder's Max HP.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "jade-cutter-max-hp",
      label: "Character Max HP",
      control: "stacks",
      defaultValue: 25000,
      max: 100000,
      hint: "Max HP used for flat ATK conversion",
    }
  ],
  buffs: [
    {
      id: "jade-cutter-hp",
      label: "HP% (Primordial Jade Cutter)",
      stat: "hp",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "jade-cutter-atk-from-hp",
      label: "Flat ATK from Max HP (Primordial Jade Cutter)",
      stat: "atk",
      refinementValues: [1.2, 1.5, 1.8, 2.1, 2.4],
      isTeamBuff: false,
      compute: (r, ctx) => { const hp = Number(ctx.inputs?.['jade-cutter-max-hp'] ?? 25000); const ratio = [0.012, 0.015, 0.018, 0.021, 0.024][r - 1]; return hp * ratio; },
    }
  ],
  
};
