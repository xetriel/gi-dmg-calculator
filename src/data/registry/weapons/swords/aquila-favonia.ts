import type { WeaponConfig } from "../types";

export const aquilaFavonia: WeaponConfig = {
  id: "aquila-favonia",
  name: "Aquila Favonia",
  type: "Sword",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "physicalDmgBonus",
    label: "Physical DMG Bonus%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Falcon's Defiance",
  passiveDesc:
    "ATK is increased by 20~40%. Triggers on taking DMG: the soul of the Falcon of the West awakens, regenerating HP equal to 100~160% of ATK and dealing 200~320% of ATK as DMG to surrounding opponents.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "aquila-atk",
      label: "ATK% (Aquila Favonia)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    },
  ],
  damageInstances: [
    {
      id: "aquila-proc",
      name: "Soul of the Falcon DMG",
      scaling: "atk",
      element: "Physical",
      refinementMultipliers: [200, 230, 260, 290, 320],
      description: "Deals 200~320% ATK as AoE Physical DMG to surrounding opponents",
    },
  ],
  signatureFor: ["jean"],
};
