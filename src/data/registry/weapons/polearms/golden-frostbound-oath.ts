import type { WeaponConfig } from "../types";

export const goldenFrostboundOath: WeaponConfig = {
  id: "golden-frostbound-oath",
  name: "Golden Frostbound Oath",
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
  passiveName: "Frostbound Oath",
  passiveDesc:
    "All Elemental DMG Bonus is increased by 12~24%. CRIT DMG is increased by 20~40%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "frostbound-elem-dmg",
      label: "All Elemental DMG Bonus (Golden Frostbound Oath)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    },
    {
      id: "frostbound-crit-dmg",
      label: "CRIT DMG% (Golden Frostbound Oath)",
      stat: "critDmg",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};
