import type { WeaponConfig } from "../types";

export const goldenFrostboundOath: WeaponConfig = {
  id: "golden-frostbound-oath",
  name: "Golden Frostbound Oath",
  type: "Polearm",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Frostbound Oath",
  passiveDesc:
    "ATK is increased by 20~40%. When an Elemental Burst is used, increases Cryo DMG Bonus by 20~40% for 12s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "frostbound-oath-atk",
      label: "ATK%",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "frostbound-oath-cryo",
      label: "Cryo DMG Bonus",
      stat: "cryoDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
