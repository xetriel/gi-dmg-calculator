import type { WeaponConfig } from "../types";

export const aThousandFloatingDreams: WeaponConfig = {
  id: "a-thousand-floating-dreams",
  name: "A Thousand Floating Dreams",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 542,
  lvl1BaseAtk: 44,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 265,
    baseValue: 58,
  },
  passiveName: "A Thousand Nights' Dawnsong",
  passiveDesc:
    "Party members other than the equipping character will provide the equipping character with buffs based on whether their Elemental Type is the same as the equipping character (+32~64 EM per same element, +10~26% Elemental DMG per different element). All nearby party members other than the equipping character gain 40~48 Elemental Mastery.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "dreams-same-element-count",
      label: "Teammates with Same Element (0-3)",
      control: "stacks",
      defaultValue: 0,
      max: 3,
      hint: "+32~64 EM to wielder per teammate with matching element",
    },
    {
      id: "dreams-diff-element-count",
      label: "Teammates with Different Element (0-3)",
      control: "stacks",
      defaultValue: 3,
      max: 3,
      hint: "+10~26% Elemental DMG to wielder per teammate with different element",
    }
  ],
  buffs: [
    {
      id: "dreams-party-em",
      label: "Party EM (A Thousand Floating Dreams)",
      description: "Nearby party members gain +40~48 Elemental Mastery",
      stat: "em",
      refinementValues: [40, 42, 44, 46, 48],
      isTeamBuff: true,
      compute: (r) => [40, 42, 44, 46, 48][r - 1],
    },
    {
      id: "dreams-self-em",
      label: "Self EM from Same Element Allies (Dreams)",
      stat: "em",
      refinementValues: [32, 40, 48, 56, 64],
      isTeamBuff: false,
      conditionKey: "dreams-same-element-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['dreams-same-element-count'] ?? 0); const perStack = [32, 40, 48, 56, 64][r - 1]; return Math.min(count, 3) * perStack; },
    },
    {
      id: "dreams-self-dmg",
      label: "Self Elemental DMG Bonus from Different Element Allies (Dreams)",
      stat: "dmgBonus",
      refinementValues: [10, 14, 18, 22, 26],
      isTeamBuff: false,
      conditionKey: "dreams-diff-element-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['dreams-diff-element-count'] ?? 3); const perStack = [10, 14, 18, 22, 26][r - 1]; return Math.min(count, 3) * perStack; },
    }
  ],
  signatureFor: ["nahida"],
};
