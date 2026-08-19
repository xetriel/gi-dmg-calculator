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
  passiveName: "Daylight's Augur",
  passiveDesc:
    "Elemental Skill and Elemental Burst DMG increased by 12~24%. Normal Attack, Charged Attack, Elemental Skill, and Elemental Burst each grant 1 stack of Ashen Nightstar on hit for 12s. At 1/2/3/4 stacks, ATK is increased by 10/20/30/48% ~ 20/40/60/96%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "polar-star-stacks",
      label: "Ashen Nightstar Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "Tiered ATK% bonus (10/20/30/48% at R1, up to 20/40/60/96% at R5)",
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
      label: "ATK% (Polar Star Nightstar Stacks)",
      stat: "atk",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "polar-star-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['polar-star-stacks'] ?? 4); const tiers: Record<number, [number, number, number, number, number]> = { 0: [0, 0, 0, 0, 0], 1: [10, 12.5, 15, 17.5, 20], 2: [20, 25, 30, 35, 40], 3: [30, 37.5, 45, 52.5, 60], 4: [48, 60, 72, 84, 96] }; const pct = (tiers[s] ?? tiers[4])[r - 1]; return (pct / 100) * ctx.baseAtk; },
    }
  ],
  signatureFor: ["tartaglia"],
};
