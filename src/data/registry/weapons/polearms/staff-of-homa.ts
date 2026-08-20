import type { WeaponConfig } from "../types";

export const staffOfHoma: WeaponConfig = {
  id: "staff-of-homa",
  name: "Staff of Homa",
  type: "Polearm",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Reckless Cinnabar",
  passiveDesc:
    "HP increased by 20~40%. Additionally, provides an ATK Bonus based on 0.8~1.6% of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional 1~1.8% of Max HP (total 1.8~3.4%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "homa-wielder-hp",
      label: "Character Total Max HP (e.g. 35000)",
      control: "stacks",
      defaultValue: 35000,
      max: 80000,
      hint: "Max HP used for flat ATK conversion",
    },
    {
      id: "homa-low-hp",
      label: "Current HP < 50% (+1.0~1.8% Max HP as ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "Adds extra 1.0~1.8% Max HP to ATK when under 50% HP",
    }
  ],
  buffs: [
    {
      id: "homa-hp-pct",
      label: "HP% (Staff of Homa)",
      stat: "hp",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "homa-flat-atk",
      label: "Flat ATK from Max HP (Staff of Homa)",
      stat: "atk",
      refinementValues: [1.8, 2.2, 2.6, 3, 3.4],
      isTeamBuff: false,
      conditionKey: "homa-wielder-hp",
      compute: (r, ctx) => { const hp = Number(ctx.inputs?.['homa-wielder-hp'] ?? 35000); const lowHp = (ctx.inputs?.['homa-low-hp'] ?? '1') === '1' || Number(ctx.inputs?.['homa-low-hp'] ?? 1) > 0; const baseRatio = [0.008, 0.010, 0.012, 0.014, 0.016][r - 1]; const lowHpRatio = [0.010, 0.012, 0.014, 0.016, 0.018][r - 1]; const ratio = baseRatio + (lowHp ? lowHpRatio : 0); return hp * ratio; },
    }
  ],
  signatureFor: ["hu-tao"],
};
