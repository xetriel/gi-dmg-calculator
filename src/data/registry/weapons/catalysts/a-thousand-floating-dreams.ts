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
    "Party members other than the equipping character will provide buffs: same element grants 32~64 EM; different element grants 10~26% DMG Bonus. Nearby party members gain 40~48 EM.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "floating-same-elem-count",
      label: "Same-Element Teammates (0-3)",
      control: "stacks",
      defaultValue: 1,
      max: 3,
      hint: "+32~64 EM per same-element teammate to wielder",
    },
    {
      id: "floating-diff-elem-count",
      label: "Different-Element Teammates (0-3)",
      control: "stacks",
      defaultValue: 2,
      max: 3,
      hint: "+10~26% DMG Bonus per diff-element teammate to wielder",
    }
  ],
  buffs: [
    {
      id: "floating-dreams-party-em",
      label: "Party EM (A Thousand Floating Dreams)",
      description: "Nearby party members gain +40~48 Elemental Mastery",
      stat: "em",
      refinementValues: [40, 42, 44, 46, 48],
      isTeamBuff: true,
      compute: (r) => [40, 42, 44, 46, 48][r - 1],
    },
    {
      id: "floating-dreams-self-em",
      label: "Self EM from Same-Element Teammates",
      stat: "em",
      refinementValues: [32, 40, 48, 56, 64],
      isTeamBuff: false,
      conditionKey: "floating-same-elem-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['floating-same-elem-count'] ?? 1); const perStack = [32, 40, 48, 56, 64][r - 1]; return count * perStack; },
    },
    {
      id: "floating-dreams-self-dmg",
      label: "Self Elemental DMG Bonus from Diff-Element Teammates",
      stat: "dmgBonus",
      refinementValues: [10, 14, 18, 22, 26],
      isTeamBuff: false,
      conditionKey: "floating-diff-elem-count",
      compute: (r, ctx) => { const count = Number(ctx.inputs?.['floating-diff-elem-count'] ?? 2); const perStack = [10, 14, 18, 22, 26][r - 1]; return count * perStack; },
    }
  ],
  signatureFor: ["nahida"],
};
