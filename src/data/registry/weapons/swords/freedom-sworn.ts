import type { WeaponConfig } from "../types";

export const freedomSworn: WeaponConfig = {
  id: "freedom-sworn",
  name: "Freedom-Sworn",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 198,
    baseValue: 43,
  },
  passiveName: "Revolutionary Chorale",
  passiveDesc:
    "Increases DMG by 10~20%. When triggering Elemental Reactions 2 times, all nearby party members gain +16~32% Normal/Charged/Plunging Attack DMG and +20~40% ATK for 12s.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "freedom-sigils-active",
      label: "Millennial Movement: Song of Resistance Active",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +16~32% NA/CA/Plunge DMG, +20~40% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "freedom-party-na-ca-plunge",
      label: "Party NA/CA/Plunge DMG Bonus (Freedom-Sworn)",
      description: "Nearby party members gain +16~32% Normal, Charged, and Plunging Attack DMG",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: true,
      conditionKey: "freedom-sigils-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['freedom-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['freedom-sigils-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    },
    {
      id: "freedom-party-charged",
      label: "Party Charged Attack DMG Bonus (Freedom-Sworn)",
      stat: "chargedDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: true,
      conditionKey: "freedom-sigils-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['freedom-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['freedom-sigils-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    },
    {
      id: "freedom-party-plunge",
      label: "Party Plunging Attack DMG Bonus (Freedom-Sworn)",
      stat: "plungeDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: true,
      conditionKey: "freedom-sigils-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['freedom-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['freedom-sigils-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    },
    {
      id: "freedom-party-atk",
      label: "Party ATK% (Freedom-Sworn)",
      description: "Nearby party members gain +20~40% ATK",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "freedom-sigils-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['freedom-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['freedom-sigils-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "freedom-self-dmg",
      label: "Self All DMG Bonus (Freedom-Sworn Base)",
      stat: "dmgBonus",
      refinementValues: [10, 12.5, 15, 17.5, 20],
      isTeamBuff: false,
      compute: (r) => [10, 12.5, 15, 17.5, 20][r - 1],
    }
  ],
  signatureFor: ["kaedehara-kazuha"],
};
