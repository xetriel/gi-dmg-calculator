import type { WeaponConfig } from "../types";

export const hereticsMoltenBlade: WeaponConfig = {
  id: "heretics-molten-blade",
  name: "Heretic's Molten Blade",
  description:
    "He drew this weapon once more when he first met that God of Flame, revered by all, but it had been too long since he had last used it.",
  type: "Sword",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Lone Light's Blessing",
  passiveDesc:
    'After the equipping character uses their Elemental Skill, they gain "Gleam of First Light." While active, Gleam of First Light tracks their distance traveled. Each second, the equipping character gains an ATK Bonus ranging from 18%/22.5%/27%/31.5%/36% to 36%/45%/54%/63%/72% based on the distance traveled during the previous second. Gleam of First Light lasts 14s, can be triggered once every 14s, and is removed when the equipping character leaves the field.',
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "heretics-gleam-active",
      label: "Gleam of First Light Active",
      control: "toggle",
      defaultValue: 1,
      hint: "+18~36% min to +36~72% max ATK for 14s based on distance traveled after Skill",
    },
    {
      id: "heretics-gleam-max",
      label: "Max Distance Traveled (Full +36~72% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "Toggle between Min distance (+18~36% ATK) and Max distance (+36~72% ATK)",
    },
  ],
  buffs: [
    {
      id: "heretics-gleam-atk",
      label: "ATK% (Lone Light's Blessing)",
      stat: "atk",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "heretics-gleam-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["heretics-gleam-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["heretics-gleam-active"] ?? 1) > 0;
        if (!on) return 0;
        const isMax =
          (ctx.inputs?.["heretics-gleam-max"] ?? "1") === "1" ||
          Number(ctx.inputs?.["heretics-gleam-max"] ?? 1) > 0;
        const maxPct = [36, 45, 54, 63, 72][r - 1];
        const pct = isMax ? maxPct : maxPct / 2;
        return (pct / 100) * ctx.baseAtk;
      },
    },
  ],
};
