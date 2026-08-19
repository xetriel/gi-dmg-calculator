import type { WeaponConfig } from "../types";

export const hakushinRing: WeaponConfig = {
  id: "hakushin-ring",
  name: "Hakushin Ring",
  type: "Catalyst",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Sakura Saiguu",
  passiveDesc:
    "After the character equipping this weapon triggers an Electro reaction, nearby party members of an Elemental Type involved in the reaction gain a 10~20% Elemental DMG Bonus for their element for 6s.",
  isSupport: true,
  buffType: "team",
  mechanicDefs: [
    {
      id: "hakushin-reaction-active",
      label: "Electro Reaction Triggered Active (+10~20% Party Elem DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +10~20% Elemental DMG Bonus for 6s",
    }
  ],
  buffs: [
    {
      id: "hakushin-party-elem-dmg",
      label: "Party Elemental DMG Bonus (Hakushin Ring)",
      description: "Nearby party members involved in reaction gain +10~20% Elemental DMG Bonus",
      stat: "dmgBonus",
      refinementValues: [10, 12.5, 15, 17.5, 20],
      isTeamBuff: true,
      conditionKey: "hakushin-reaction-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['hakushin-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['hakushin-reaction-active'] ?? 1) > 0; return on ? [10, 12.5, 15, 17.5, 20][r - 1] : 0; },
    }
  ],
  
};
