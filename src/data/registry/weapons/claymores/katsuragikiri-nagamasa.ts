import type { WeaponConfig } from "../types";

export const katsuragikiriNagamasa: WeaponConfig = {
  id: "katsuragikiri-nagamasa",
  name: "Katsuragikiri Nagamasa",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Samurai Conduct",
  passiveDesc:
    "Increases Elemental Skill DMG by 6~12%. After Elemental Skill hits, loses 3 Energy but restores 3~5 Energy every 2s for 6s.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "nagamasa-skill-dmg",
      label: "Elemental Skill DMG Bonus (Katsuragikiri Nagamasa)",
      stat: "skillDmgBonus",
      refinementValues: [6, 7.5, 9, 10.5, 12],
      isTeamBuff: false,
      compute: (r) => [6, 7.5, 9, 10.5, 12][r - 1],
    }
  ],
  
};
