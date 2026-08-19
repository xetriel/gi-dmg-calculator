import type { WeaponConfig } from "../types";

export const ultimateOverlordsMegaMagicSword: WeaponConfig = {
  id: "ultimate-overlords-mega-magic-sword",
  name: "Ultimate Overlord's Mega Magic Sword",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Melusine's Blessing",
  passiveDesc:
    "ATK is increased by 12~24%. The Melusines you have helped in Merusea Village further increase your ATK by up to an additional 12~24%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "overlord-melusines-helped",
      label: "Melusines Helped (0-24)",
      control: "stacks",
      defaultValue: 24,
      max: 24,
      hint: "+0.5~1.0% additional ATK per Melusine helped (up to +12~24%)",
    }
  ],
  buffs: [
    {
      id: "overlord-base-atk",
      label: "ATK% (Mega Magic Sword Base)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk,
    },
    {
      id: "overlord-melusine-atk",
      label: "ATK% (Melusines Helped)",
      stat: "atk",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "overlord-melusines-helped",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['overlord-melusines-helped'] ?? 24); const cap = [12, 15, 18, 21, 24][r - 1]; const perMelusine = cap / 24; return ((Math.min(count, 24) * perMelusine) / 100) * ctx.baseAtk; },
    }
  ],
  
};
