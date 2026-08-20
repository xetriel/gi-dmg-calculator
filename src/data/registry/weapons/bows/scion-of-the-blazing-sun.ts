import type { WeaponConfig } from "../types";

export const scionOfTheBlazingSun: WeaponConfig = {
  id: "scion-of-the-blazing-sun",
  name: "Scion of the Blazing Sun",
  type: "Bow",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 18.4,
    baseValue: 4,
  },
  passiveName: "The Way of Sunfire",
  passiveDesc:
    "After Charged Attack hits an opponent, applies Heartsearer effect: opponent takes 28~56% increased Charged Attack DMG from wielder for 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "scion-heartsearer-active",
      label: "Heartsearer Active (+28~56% Charged Attack DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+28~56% Charged Attack DMG against affected target",
    }
  ],
  buffs: [
    {
      id: "scion-ca-dmg",
      label: "Charged Attack DMG Bonus (Scion Blazing Sun)",
      stat: "chargedDmgBonus",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      conditionKey: "scion-heartsearer-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['scion-heartsearer-active'] ?? '1') === '1' || Number(ctx.inputs?.['scion-heartsearer-active'] ?? 1) > 0; return on ? [28, 35, 42, 49, 56][r - 1] : 0; },
    }
  ],
  
};
