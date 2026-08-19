import type { WeaponConfig } from "../types";

export const urakuMisugiri: WeaponConfig = {
  id: "uraku-misugiri",
  name: "Uraku Misugiri",
  type: "Sword",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "Brocade Bloom, Shrine Sword",
  passiveDesc:
    "Normal Attack DMG is increased by 16~32% and Elemental Skill DMG is increased by 24~48%. After a nearby active character deals Geo DMG, the aforementioned effects increase by 100% for 15s. Additionally, DEF is increased by 20~40%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "uraku-geo-trigger",
      label: "Nearby Character Dealt Geo DMG (2x Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "Doubles NA and Skill DMG bonuses for 15s",
    }
  ],
  buffs: [
    {
      id: "uraku-na-dmg",
      label: "Normal Attack DMG Bonus (Uraku Misugiri)",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r, ctx) => { const geo = (ctx.inputs?.['uraku-geo-trigger'] ?? '1') === '1' || Number(ctx.inputs?.['uraku-geo-trigger'] ?? 1) > 0; return [16, 20, 24, 28, 32][r - 1] * (geo ? 2 : 1); },
    },
    {
      id: "uraku-skill-dmg",
      label: "Elemental Skill DMG Bonus (Uraku Misugiri)",
      stat: "skillDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      compute: (r, ctx) => { const geo = (ctx.inputs?.['uraku-geo-trigger'] ?? '1') === '1' || Number(ctx.inputs?.['uraku-geo-trigger'] ?? 1) > 0; return [24, 30, 36, 42, 48][r - 1] * (geo ? 2 : 1); },
    },
    {
      id: "uraku-def",
      label: "DEF% (Uraku Misugiri)",
      stat: "def",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  signatureFor: ["chiori"],
};
