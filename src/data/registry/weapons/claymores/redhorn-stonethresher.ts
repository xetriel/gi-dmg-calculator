import type { WeaponConfig } from "../types";

export const redhornStonethresher: WeaponConfig = {
  id: "redhorn-stonethresher",
  name: "Redhorn Stonethresher",
  type: "Claymore",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "Gokadaiou Otogibanashi",
  passiveDesc:
    "DEF is increased by 28~56%. Normal and Charged Attack DMG is increased by 40~80% of DEF.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "redhorn-wielder-def",
      label: "Character Total DEF",
      control: "stacks",
      defaultValue: 2500,
      max: 6000,
      hint: "Total DEF used for flat NA/CA DMG bonus",
    }
  ],
  buffs: [
    {
      id: "redhorn-def",
      label: "DEF% (Redhorn Stonethresher)",
      stat: "def",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [28, 35, 42, 49, 56][r - 1],
    },
    {
      id: "redhorn-na-dmg",
      label: "Flat Normal Attack DMG from DEF (Redhorn)",
      stat: "normalDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      compute: (r, ctx) => { const def = Number(ctx.inputs?.['redhorn-wielder-def'] ?? 2500); const ratio = [0.4, 0.5, 0.6, 0.7, 0.8][r - 1]; return def * ratio; },
    },
    {
      id: "redhorn-ca-dmg",
      label: "Flat Charged Attack DMG from DEF (Redhorn)",
      stat: "chargedDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      compute: (r, ctx) => { const def = Number(ctx.inputs?.['redhorn-wielder-def'] ?? 2500); const ratio = [0.4, 0.5, 0.6, 0.7, 0.8][r - 1]; return def * ratio; },
    }
  ],
  signatureFor: ["arataki-itto"],
};
