import type { WeaponConfig } from "../types";

export const mountainBracingBolt: WeaponConfig = {
  id: "mountain-bracing-bolt",
  name: "Mountain-Bracing Bolt",
  type: "Polearm",
  rarity: 4,
  baseAtk: 565,
  lvl1BaseAtk: 44,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 30.6,
    baseValue: 6.7,
  },
  passiveName: "Peak-Ascending Strike",
  passiveDesc:
    "Decreases Climbing Stamina Consumption by 15%. Additionally, Elemental Skill DMG is increased by 12~24%. When other party members use Elemental Skills, the equipping character's Elemental Skill DMG is increased by an additional 12~24% for 8s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "mountain-bolt-party-skill",
      label: "Party Member Used Skill",
      control: "toggle",
      defaultValue: 1,
      hint: "+12~24% extra Skill DMG (Total +24~48% Skill DMG)",
    }
  ],
  buffs: [
    {
      id: "mountain-bolt-skill-dmg",
      label: "Elemental Skill DMG Bonus (Mountain-Bracing Bolt)",
      stat: "skillDmgBonus",
      refinementValues: [24, 30, 36, 42, 48],
      isTeamBuff: false,
      compute: (r,ctx)=>{const extra=(ctx.inputs?.["mountain-bolt-party-skill"]??"1")==="1"||Number(ctx.inputs?.["mountain-bolt-party-skill"]??1)>0;return[12,15,18,21,24][r-1]*(extra?2:1)},
    }
  ],
  
};
