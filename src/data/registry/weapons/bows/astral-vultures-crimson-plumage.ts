import type { WeaponConfig } from "../types";

export const astralVulturesCrimsonPlumage: WeaponConfig = {
  id: "astral-vultures-crimson-plumage",
  name: "Astral Vulture's Crimson Plumage",
  type: "Bow",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Soaring Eagle's Cry",
  passiveDesc:
    "Triggering a Swirl reaction grants 1 stack of Unity, increasing Aimed Shot and Plunging Attack DMG by 20~40% for 12s. Max 2 stacks. When in Nightsoul's Blessing, the wielder deals an additional 20~40% DMG.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "astral-unity-stacks",
      label: "Swirl Unity Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+20~40% Aimed/Plunging DMG per stack",
    },
    {
      id: "astral-nightsoul-active",
      label: "In Nightsoul's Blessing",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% All DMG bonus",
    }
  ],
  buffs: [
    {
      id: "astral-ca-dmg",
      label: "Charged Attack DMG Bonus (Astral Vulture)",
      stat: "chargedDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "astral-unity-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['astral-unity-stacks'] ?? 2); return s * [20, 25, 30, 35, 40][r - 1]; },
    },
    {
      id: "astral-nightsoul-dmg",
      label: "All DMG Bonus (Astral Nightsoul)",
      stat: "dmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "astral-nightsoul-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['astral-nightsoul-active'] ?? '1') === '1' || Number(ctx.inputs?.['astral-nightsoul-active'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    }
  ],
  signatureFor: ["chasca"],
};
