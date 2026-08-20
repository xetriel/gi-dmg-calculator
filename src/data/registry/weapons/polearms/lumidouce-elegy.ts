import type { WeaponConfig } from "../types";

export const lumidouceElegy: WeaponConfig = {
  id: "lumidouce-elegy",
  name: "Lumidouce Elegy",
  type: "Polearm",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Bright Dawn Song",
  passiveDesc:
    "ATK is increased by 15~31%. After the equipping character triggers Burning on opponents or deals Dendro DMG to Burning opponents, the DMG dealt is increased by 18~36%. Max 2 stacks (up to +36~72% DMG).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "lumidouce-scents-stacks",
      label: "Scents Stacks (0-2)",
      control: "stacks",
      defaultValue: 2,
      max: 2,
      hint: "+18~36% All DMG bonus per stack (up to +36~72%)",
    }
  ],
  buffs: [
    {
      id: "lumidouce-atk",
      label: "ATK% (Lumidouce Elegy)",
      stat: "atk",
      refinementValues: [15, 19, 23, 27, 31],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([15, 19, 23, 27, 31][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "lumidouce-dmg",
      label: "All DMG Bonus from Scents (Lumidouce Elegy)",
      stat: "dmgBonus",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      conditionKey: "lumidouce-scents-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['lumidouce-scents-stacks'] ?? 2); return s * [18, 22.5, 27, 31.5, 36][r - 1]; },
    }
  ],
  signatureFor: ["emilie"],
};
