import type { WeaponConfig } from "../types";

export const theWidsith: WeaponConfig = {
  id: "the-widsith",
  name: "The Widsith",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 55.1,
    baseValue: 12,
  },
  passiveName: "Debut",
  passiveDesc:
    "When taking the field, gain a random theme song for 10s: Recitative (+60~120% ATK), Aria (+48~96% All Elemental DMG), Interlude (+240~480 EM).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "widsith-song",
      label: "Theme Song (1: Recitative, 2: Aria, 3: Interlude)",
      control: "stacks",
      defaultValue: 2,
      max: 3,
      hint: "1: +60~120% ATK, 2: +48~96% All Elem DMG, 3: +240~480 EM",
    }
  ],
  buffs: [
    {
      id: "widsith-atk",
      label: "ATK% (Recitative)",
      stat: "atk",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "widsith-song",
      compute: (r, ctx) => { const song = Number(ctx.inputs?.['widsith-song'] ?? 2); return song === 1 ? ([60, 75, 90, 105, 120][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "widsith-elem-dmg",
      label: "All Elemental DMG Bonus (Aria)",
      stat: "dmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "widsith-song",
      compute: (r, ctx) => { const song = Number(ctx.inputs?.['widsith-song'] ?? 2); return song === 2 ? [48, 60, 72, 84, 96][r - 1] : 0; },
    },
    {
      id: "widsith-em",
      label: "Elemental Mastery (Interlude)",
      stat: "em",
      refinementValues: [240, 300, 360, 420, 480],
      isTeamBuff: false,
      conditionKey: "widsith-song",
      compute: (r, ctx) => { const song = Number(ctx.inputs?.['widsith-song'] ?? 2); return song === 3 ? [240, 300, 360, 420, 480][r - 1] : 0; },
    }
  ],
  
};
