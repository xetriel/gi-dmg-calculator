import type { WeaponConfig } from "../types";

export const frostbreath: WeaponConfig = {
  id: "frostbreath",
  name: "Frostbreath",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Frost Breath",
  passiveDesc:
    "Increases Cryo DMG Bonus by 12~24%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "frostbreath-cryo",
      label: "Cryo DMG Bonus",
      stat: "cryoDmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      compute: (r) => [12, 15, 18, 21, 24][r - 1],
    }
  ],
  
};
