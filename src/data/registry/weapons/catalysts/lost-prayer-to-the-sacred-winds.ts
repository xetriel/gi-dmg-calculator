import type { WeaponConfig } from "../types";

export const lostPrayerToTheSacredWinds: WeaponConfig = {
  id: "lost-prayer-to-the-sacred-winds",
  name: "Lost Prayer to the Sacred Winds",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Boundless Blessing",
  passiveDesc:
    "Increases Movement SPD by 10%. When in battle, gain an 8~16% Elemental DMG Bonus every 4s. Max 4 stacks (+32~64% Elemental DMG).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "lost-prayer-stacks",
      label: "In-Battle Blessing Stacks (0-4)",
      control: "stacks",
      defaultValue: 4,
      max: 4,
      hint: "+8~16% All Elemental DMG Bonus per 4s (up to +32~64%)",
    }
  ],
  buffs: [
    {
      id: "lost-prayer-elem-dmg",
      label: "All Elemental DMG Bonus (Lost Prayer)",
      stat: "dmgBonus",
      refinementValues: [32, 40, 48, 56, 64],
      isTeamBuff: false,
      conditionKey: "lost-prayer-stacks",
      compute: (r, ctx) => { const s = Number(ctx.inputs?.['lost-prayer-stacks'] ?? 4); return s * [8, 10, 12, 14, 16][r - 1]; },
    }
  ],
  
};
