import type { WeaponConfig } from "../types";

export const surfsUp: WeaponConfig = {
  id: "surfs-up",
  name: "Surf's Up",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "Aqua-Bound Wave",
  passiveDesc:
    "Max HP is increased by 20~40%. Using an Elemental Skill grants 4 stacks of Scorching Summer: increases Normal Attack DMG by 12~24% per stack. Every 1.5s after Normal Attack hits, 1 stack is lost; after triggering Vaporize on an opponent, 1 stack is added. Max 4 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "surfs-up-stacks",
      label: "Scorching Summer Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "+12~24% Normal Attack DMG per stack (up to +48~96%)",
    }
  ],
  buffs: [
    {
      id: "surfs-up-hp",
      label: "Max HP% (Surf's Up)",
      stat: "hp",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    },
    {
      id: "surfs-up-na-dmg",
      label: "Normal Attack DMG Bonus (Surf's Up)",
      stat: "normalDmgBonus",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      conditionKey: "surfs-up-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['surfs-up-stacks'] ?? 4); return s * [12, 15, 18, 21, 24][r - 1]; },
    }
  ],
  signatureFor: ["mualani"],
};
