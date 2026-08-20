import type { WeaponConfig } from "../types";

export const goldenFrostboundOath: WeaponConfig = {
  id: "golden-frostbound-oath",
  name: "Golden Frostbound Oath",
  type: "Bow",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 88.2,
    baseValue: 19.2,
  },
  passiveName: "Dawn's Salutation Returned",
  passiveDesc:
    "Increases DEF by 16~32%. Hitting opponents with Elemental Skill or Lunar-Crystallize grants Frost Fae's Favor for 6s: increases Geo DMG and Lunar-Crystallize Reaction DMG by 40~80%. While active, if Moondrifts are nearby, all other party members gain +20~40% Geo DMG and Lunar-Crystallize Reaction DMG.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "frost-fae-favor-active",
      label: "Frost Fae's Favor Active (+40~80% Self Geo/Reaction DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+40~80% Geo and Lunar-Crystallize DMG for 6s",
    },
    {
      id: "frost-fae-moondrifts-active",
      label: "Moondrifts Nearby Active (+20~40% Party Geo/Reaction DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +20~40% Geo and Lunar-Crystallize DMG to party members",
    }
  ],
  buffs: [
    {
      id: "frostbound-def",
      label: "DEF% (Golden Frostbound Oath)",
      stat: "def",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "frostbound-self-geo-dmg",
      label: "Self Geo DMG Bonus (Frost Fae's Favor)",
      stat: "geoDmgBonus",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: false,
      conditionKey: "frost-fae-favor-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['frost-fae-favor-active'] ?? '1') === '1' || Number(ctx.inputs?.['frost-fae-favor-active'] ?? 1) > 0; return on ? [40, 50, 60, 70, 80][r - 1] : 0; },
    },
    {
      id: "frostbound-party-geo-dmg",
      label: "Party Geo DMG Bonus (Frost Fae's Mischief)",
      description: "All nearby party members gain +20~40% Geo DMG",
      stat: "geoDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: true,
      conditionKey: "frost-fae-moondrifts-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['frost-fae-moondrifts-active'] ?? '1') === '1' || Number(ctx.inputs?.['frost-fae-moondrifts-active'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; },
    }
  ],
  signatureFor: ["linnea"],
};
