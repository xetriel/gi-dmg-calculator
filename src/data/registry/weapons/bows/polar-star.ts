import type { WeaponConfig } from "../types";

export const polarStar: WeaponConfig = {
  id: "polar-star",
  name: "Polar Star",
  type: "Bow",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Daylight's Augury",
  passiveDesc:
    "Elemental Skill and Elemental Burst DMG increased by 12~24%. When Normal Attack, Charged Attack, Elemental Skill, or Elemental Burst hits an opponent, gain 1 stack of Ashen Nightstar (max 4 stacks = +48~96% ATK).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "polar-nightstar-stacks",
      label: "Ashen Nightstar Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "1: +10/12.5%, 2: +20/25%, 3: +30/37.5%, 4: +48/96% ATK",
    }
  ],
  buffs: [
    {
      id: "polar-skill-dmg",
      label: "Elemental Skill DMG Bonus (Polar Star)",
      stat: "skillDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "polar-burst-dmg",
      label: "Elemental Burst DMG Bonus (Polar Star)",
      stat: "burstDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "polar-atk",
      label: "ATK% from Nightstar Stacks (Polar Star)",
      stat: "atk",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "polar-nightstar-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['polar-nightstar-stacks'] ?? 4); const rMap: Record<number, number[]> = { 1: [10, 12.5, 15, 17.5, 20], 2: [20, 25, 30, 35, 40], 3: [30, 37.5, 45, 52.5, 60], 4: [48, 60, 72, 84, 96] }; const pct = (rMap[s] || [0, 0, 0, 0, 0])[r - 1] || 0; return (pct / 100) * ctx.baseAtk; },
    }
  ],
  signatureFor: ["tartaglia"],
};
