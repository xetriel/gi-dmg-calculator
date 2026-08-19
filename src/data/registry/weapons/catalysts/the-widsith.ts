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
    "When a character takes the field, one of three random theme songs is gained for 10s: Recitative (+60~120% ATK), Aria (+48~96% All Elemental DMG), or Intermezzo (+240~480 Elemental Mastery). Can only occur once every 30s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "widsith-song",
      label: "Active Theme Song (0=None, 1=Recitative ATK, 2=Aria Elem, 3=Intermezzo EM)",
      control: "stacks",
      defaultValue: 2,
      max: 3,
      hint: "Select active random song buff",
    }
  ],
  buffs: [
    {
      id: "widsith-atk",
      label: "ATK% (The Widsith Recitative)",
      stat: "atk",
      refinementValues: [60, 75, 90, 105, 120],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "widsith-song",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["widsith-song"]??2);return s===1?[60,75,90,105,120][r-1]/100*ctx.baseAtk:0},
    },
    {
      id: "widsith-elem-dmg",
      label: "All Elemental DMG Bonus (The Widsith Aria)",
      stat: "dmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "widsith-song",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["widsith-song"]??2);return s===2?[48,60,72,84,96][r-1]:0},
    },
    {
      id: "widsith-em",
      label: "Elemental Mastery (The Widsith Intermezzo)",
      stat: "em",
      refinementValues: [240, 300, 360, 420, 480],
      isTeamBuff: false,
      conditionKey: "widsith-song",
      compute: (r,ctx)=>{const s=Number(ctx.inputs?.["widsith-song"]??2);return s===3?[240,300,360,420,480][r-1]:0},
    }
  ],
  
};
