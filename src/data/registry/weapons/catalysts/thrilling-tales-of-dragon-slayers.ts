import type { WeaponConfig } from "../types";

export const thrillingTalesOfDragonSlayers: WeaponConfig = {
  id: "thrilling-tales-of-dragon-slayers",
  name: "Thrilling Tales of Dragon Slayers",
  type: "Catalyst",
  rarity: 3,
  baseAtk: 401,
  lvl1BaseAtk: 39,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 35.2,
    baseValue: 7.7,
  },
  passiveName: "Heritage",
  passiveDesc:
    "When switching characters, the new character taking the field has their ATK increased by 24~48% for 10s. This effect can only occur once every 20s.",
  isSupport: true,
  buffType: "team",
  mechanicDefs: [
    {
      id: "ttds-buff-active",
      label: "Switched to Character Active (+24~48% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +24~48% ATK for 10s upon switching",
    }
  ],
  buffs: [
    {
      id: "ttds-party-atk",
      label: "Party ATK% (Thrilling Tales of Dragon Slayers)",
      description: "New active character taking the field gains +24~48% ATK for 10s",
      stat: "atk",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "ttds-buff-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['ttds-buff-active'] ?? '1') === '1' || Number(ctx.inputs?.['ttds-buff-active'] ?? 1) > 0; return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};
