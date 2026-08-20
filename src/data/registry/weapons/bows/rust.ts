import type { WeaponConfig } from "../types";

export const rust: WeaponConfig = {
  id: "rust",
  name: "Rust",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Rapid Firing",
  passiveDesc:
    "Increases Normal Attack DMG by 40~80% but decreases Charged Attack DMG by 10%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "rust-na-dmg",
      label: "Normal Attack DMG Bonus (Rust)",
      stat: "normalDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      compute: (r) => [40, 50, 60, 70, 80][r - 1],
    },
    {
      id: "rust-ca-penalty",
      label: "Charged Attack DMG Penalty (Rust)",
      stat: "chargedDmgBonus",
      refinementValues: [-10, -10, -10, -10, -10],
      isTeamBuff: false,
      compute: () => -10,
    }
  ],
  signatureFor: ["yoimiya"],
};
