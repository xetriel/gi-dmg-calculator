import type { WeaponConfig } from "../types";

export const theFirstGreatMagic: WeaponConfig = {
  id: "the-first-great-magic",
  name: "The First Great Magic",
  type: "Bow",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 66.2,
    baseValue: 14.4,
  },
  passiveName: "Parsifal the Great",
  passiveDesc:
    "Charged Attack DMG increased by 16~32%. For every party member of the same Elemental Type (max 3), gain Gimmick stack (+16/32/48% ~ 32/64/96% ATK).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "magic-same-element-count",
      label: "Party Members of Same Element (1-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "1 member: +16~32% ATK, 2 members: +32~64% ATK, 3 members: +48~96% ATK",
    }
  ],
  buffs: [
    {
      id: "magic-ca-dmg",
      label: "Charged Attack DMG Bonus (The First Great Magic)",
      stat: "chargedDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "magic-atk",
      label: "ATK% from Same Element Party Members (The First Great Magic)",
      stat: "atk",
      refinementValues: [48, 60, 72, 84, 96],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "magic-same-element-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['magic-same-element-count'] ?? 3); const perMember = [16, 20, 24, 28, 32][r - 1]; return ((Math.min(count, 3) * perMember) / 100) * ctx.baseAtk; },
    }
  ],
  signatureFor: ["lyney"],
};
