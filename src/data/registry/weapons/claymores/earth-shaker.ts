import type { WeaponConfig } from "../types";

export const earthShaker: WeaponConfig = {
  id: "earth-shaker",
  name: "Earth Shaker",
  type: "Claymore",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 27.6,
    baseValue: 6,
  },
  passiveName: "Oath of the Earth-Ender",
  passiveDesc:
    "After a party member triggers a Pyro-related reaction, the equipping character's Elemental Skill DMG is increased by 16~32% for 8s. This effect can be triggered even when the character is off-field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "earth-shaker-reaction-active",
      label: "Pyro Reaction Triggered (+16~32% Skill DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+16~32% Elemental Skill DMG for 8s",
    }
  ],
  buffs: [
    {
      id: "earth-shaker-skill-dmg",
      label: "Elemental Skill DMG Bonus (Earth Shaker)",
      stat: "skillDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      conditionKey: "earth-shaker-reaction-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['earth-shaker-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['earth-shaker-reaction-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; },
    }
  ],
  
};
