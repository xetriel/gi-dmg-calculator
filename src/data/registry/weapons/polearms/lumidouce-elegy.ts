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
  passiveName: "Bright Dawn Overlay",
  passiveDesc:
    "ATK is increased by 15~30%. After the equipping character triggers Burning on an opponent or deals Dendro DMG to Burning opponents, the DMG dealt is increased by 18~36% for 8s. Max 2 stacks. At 2 stacks or when 2 stacks refresh, restore 12~16 Energy.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "lumidouce-stacks",
      label: "Burning Stacks (0-2)",
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
      refinementValues: [15, 18.75, 22.5, 26.25, 30],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([15, 18.75, 22.5, 26.25, 30][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "lumidouce-dmg",
      label: "All DMG Bonus (Lumidouce Elegy Stacks)",
      stat: "dmgBonus",
      refinementValues: [36, 45, 54, 63, 72],
      isTeamBuff: false,
      conditionKey: "lumidouce-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['lumidouce-stacks'] ?? 2); return s * [18, 22.5, 27, 31.5, 36][r - 1]; },
    }
  ],
  signatureFor: ["emilie"],
};
