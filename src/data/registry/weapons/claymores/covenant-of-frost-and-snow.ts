import type { WeaponConfig } from "../types";

export const covenantOfFrostAndSnow: WeaponConfig = {
  id: "covenant-of-frost-and-snow",
  name: "Covenant of Frost and Snow",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "physicalDmgBonus",
    label: "Physical DMG Bonus%",
    value: 34.5,
    baseValue: 7.5,
  },
  passiveName: "Frost Covenant",
  passiveDesc:
    "Physical DMG is increased by 16~32%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "covenant-phys-dmg",
      label: "Physical DMG Bonus (Covenant of Frost & Snow)",
      stat: "physicalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    }
  ],
  
};
