import type { WeaponConfig } from "../types";

export const theBell: WeaponConfig = {
  id: "the-bell",
  name: "The Bell",
  type: "Claymore",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "hpPct",
    label: "HP%",
    value: 41.3,
    baseValue: 9,
  },
  passiveName: "Rebellious Guardian",
  passiveDesc:
    "Taking DMG generates a shield which absorbs DMG up to 20~32% of Max HP. While protected by a shield, the character gains 12~24% increased DMG.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "bell-shielded",
      label: "Protected by Shield (+12~24% DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% All DMG bonus when shielded",
    }
  ],
  buffs: [
    {
      id: "bell-dmg",
      label: "All DMG Bonus when Shielded (The Bell)",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: false,
      conditionKey: "bell-shielded",
      compute: (r, ctx) => { const on = (ctx.inputs?.['bell-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['bell-shielded'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; },
    }
  ],
  
};
