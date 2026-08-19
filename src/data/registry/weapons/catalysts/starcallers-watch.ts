import type { WeaponConfig } from "../types";

export const starcallersWatch: WeaponConfig = {
  id: "starcallers-watch",
  name: "Starcaller's Watch",
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
  passiveName: "Starlight Navigation",
  passiveDesc:
    "Shield Strength is increased by 20~40%. When the wielder creates a shield or Geo Construct, All Elemental DMG Bonus is increased by 20~40% for 15s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "starcaller-elem-dmg",
      label: "All Elemental DMG Bonus (Starcaller's Watch)",
      stat: "dmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  signatureFor: ["kachina"],
};
