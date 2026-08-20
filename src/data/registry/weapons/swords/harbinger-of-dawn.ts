import type { WeaponConfig } from "../types";

export const harbingerOfDawn: WeaponConfig = {
  id: "harbinger-of-dawn",
  name: "Harbinger of Dawn",
  type: "Sword",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 46.9,
    baseValue: 10.2,
  },
  passiveName: "Skypiercing",
  passiveDesc:
    "When HP is above 90%, increases CRIT Rate by 14~28%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "harbinger-hp-gt-90",
      label: "HP > 90% (+14~28% CRIT Rate)",
      control: "toggle",
      defaultValue: 1,
      hint: "Active when current HP is above 90%",
    }
  ],
  buffs: [
    {
      id: "harbinger-crit-rate",
      label: "CRIT Rate% (Harbinger of Dawn)",
      stat: "critRate",
      refinementValues: [14, 17.5, 21, 24.5, 28],
      isTeamBuff: false,
      conditionKey: "harbinger-hp-gt-90",
      compute: (r, ctx) => { const on = (ctx.inputs?.['harbinger-hp-gt-90'] ?? '1') === '1' || Number(ctx.inputs?.['harbinger-hp-gt-90'] ?? 1) > 0; return on ? [14, 17.5, 21, 24.5, 28][r - 1] : 0; },
    }
  ],
  
};
