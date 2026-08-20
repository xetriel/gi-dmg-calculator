import type { WeaponConfig } from "../types";

export const mitternachtsWaltz: WeaponConfig = {
  id: "mitternachts-waltz",
  name: "Mitternachts Waltz",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "physicalDmgBonus",
    label: "Physical DMG Bonus%",
    value: 51.7,
    baseValue: 11.3,
  },
  passiveName: "Evernight Duet",
  passiveDesc:
    "Normal Attack hits increase Elemental Skill DMG by 20~40% for 5s. Elemental Skill hits increase Normal Attack DMG by 20~40% for 5s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "waltz-na-hit",
      label: "Normal Attack Hit (+20~40% Skill DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% Skill DMG for 5s",
    },
    {
      id: "waltz-skill-hit",
      label: "Elemental Skill Hit (+20~40% Normal Attack DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% Normal Attack DMG for 5s",
    }
  ],
  buffs: [
    {
      id: "waltz-skill-dmg",
      label: "Elemental Skill DMG Bonus (Mitternachts Waltz)",
      stat: "skillDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "waltz-na-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['waltz-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['waltz-na-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    },
    {
      id: "waltz-na-dmg",
      label: "Normal Attack DMG Bonus (Mitternachts Waltz)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      conditionKey: "waltz-skill-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['waltz-skill-hit'] ?? '1') === '1' || Number(ctx.inputs?.['waltz-skill-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    }
  ],
  signatureFor: ["fischl"],
};
