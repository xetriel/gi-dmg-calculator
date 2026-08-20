import fs from "fs";
import path from "path";

export interface BowDefinition {
  id: string;
  varName: string;
  name: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  baseAtk: number;
  lvl1BaseAtk: number;
  subStat?: {
    type: string;
    label: string;
    value: number;
    baseValue?: number;
  };
  passiveName: string;
  passiveDesc: string;
  isSupport: boolean;
  buffType: "team" | "self" | "both";
  mechanicDefs?: any[];
  buffs: any[];
  signatureFor?: string[];
}

export const COMPLETE_BOWS: BowDefinition[] = [
  // ==========================================
  // 5-STAR BOWS (12)
  // ==========================================
  {
    id: "elegy-for-the-end",
    varName: "elegyForTheEnd",
    name: "Elegy for the End",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 55.1, baseValue: 12.0 },
    passiveName: "The Parting Refrain",
    passiveDesc:
      "Increases Elemental Mastery by 60~120. When Elemental Skill/Burst hits opponents, gain Sigil of Remembrance (max 4). At 4 Sigils, all nearby party members gain Millennial Movement: Farewell Song (+100~200 EM and +20~40% ATK for 12s).",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "elegy-sigils-active",
        label: "Millennial Movement: Farewell Song Active (+100~200 EM, +20~40% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "Team buff: +100~200 EM and +20~40% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "elegy-base-em",
        label: "Elemental Mastery (Elegy Base)",
        stat: "em",
        refinementValues: [60, 75, 90, 105, 120],
        isTeamBuff: false,
        computeCode: "(r) => [60, 75, 90, 105, 120][r - 1]",
      },
      {
        id: "elegy-party-em",
        label: "Party Elemental Mastery (Millennial Movement)",
        description: "All nearby party members gain +100~200 Elemental Mastery",
        stat: "em",
        refinementValues: [100, 125, 150, 175, 200],
        isTeamBuff: true,
        conditionKey: "elegy-sigils-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['elegy-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['elegy-sigils-active'] ?? 1) > 0; return on ? [100, 125, 150, 175, 200][r - 1] : 0; }",
      },
      {
        id: "elegy-party-atk",
        label: "Party ATK% (Millennial Movement)",
        description: "All nearby party members gain +20~40% ATK",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "elegy-sigils-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['elegy-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['elegy-sigils-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
    signatureFor: ["venti"],
  },
  {
    id: "golden-frostbound-oath",
    varName: "goldenFrostboundOath",
    name: "Golden Frostbound Oath",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
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
      },
    ],
    buffs: [
      {
        id: "frostbound-def",
        label: "DEF% (Golden Frostbound Oath)",
        stat: "def",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "frostbound-self-geo-dmg",
        label: "Self Geo DMG Bonus (Frost Fae's Favor)",
        stat: "geoDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "frost-fae-favor-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['frost-fae-favor-active'] ?? '1') === '1' || Number(ctx.inputs?.['frost-fae-favor-active'] ?? 1) > 0; return on ? [40, 50, 60, 70, 80][r - 1] : 0; }",
      },
      {
        id: "frostbound-party-geo-dmg",
        label: "Party Geo DMG Bonus (Frost Fae's Mischief)",
        description: "All nearby party members gain +20~40% Geo DMG",
        stat: "geoDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: true,
        conditionKey: "frost-fae-moondrifts-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['frost-fae-moondrifts-active'] ?? '1') === '1' || Number(ctx.inputs?.['frost-fae-moondrifts-active'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
    ],
    signatureFor: ["linnea"],
  },
  {
    id: "the-daybreak-chronicles",
    varName: "theDaybreakChronicles",
    name: "The Daybreak Chronicles",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Ode Beyond Time",
    passiveDesc:
      "3s after leaving combat, increases Normal Attack, Elemental Skill, and Elemental Burst DMG by 60~120%. In combat, decreases by 10% per second. Hitting opponents increases the corresponding attack type's DMG by 10% per hit (20% if Hexerei: Secret Rite) up to +60~120%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "daybreak-na-buff",
        label: "Normal Attack DMG Bonus (+0~120%)",
        control: "stacks",
        max: 120,
        defaultValue: 60,
        hint: "Current NA DMG bonus maintained (+60~120%)",
      },
      {
        id: "daybreak-skill-buff",
        label: "Elemental Skill DMG Bonus (+0~120%)",
        control: "stacks",
        max: 120,
        defaultValue: 60,
        hint: "Current Skill DMG bonus maintained (+60~120%)",
      },
      {
        id: "daybreak-burst-buff",
        label: "Elemental Burst DMG Bonus (+0~120%)",
        control: "stacks",
        max: 120,
        defaultValue: 60,
        hint: "Current Burst DMG bonus maintained (+60~120%)",
      },
    ],
    buffs: [
      {
        id: "daybreak-na-dmg",
        label: "Normal Attack DMG Bonus (The Daybreak Chronicles)",
        stat: "normalDmgBonus",
        refinementValues: [60, 75, 90, 105, 120],
        isTeamBuff: false,
        conditionKey: "daybreak-na-buff",
        computeCode:
          "(r, ctx) => { const cap = [60, 75, 90, 105, 120][r - 1]; const val = Number(ctx.inputs?.['daybreak-na-buff'] ?? 60); return Math.min(val, cap); }",
      },
      {
        id: "daybreak-skill-dmg",
        label: "Elemental Skill DMG Bonus (The Daybreak Chronicles)",
        stat: "skillDmgBonus",
        refinementValues: [60, 75, 90, 105, 120],
        isTeamBuff: false,
        conditionKey: "daybreak-skill-buff",
        computeCode:
          "(r, ctx) => { const cap = [60, 75, 90, 105, 120][r - 1]; const val = Number(ctx.inputs?.['daybreak-skill-buff'] ?? 60); return Math.min(val, cap); }",
      },
      {
        id: "daybreak-burst-dmg",
        label: "Elemental Burst DMG Bonus (The Daybreak Chronicles)",
        stat: "burstDmgBonus",
        refinementValues: [60, 75, 90, 105, 120],
        isTeamBuff: false,
        conditionKey: "daybreak-burst-buff",
        computeCode:
          "(r, ctx) => { const cap = [60, 75, 90, 105, 120][r - 1]; const val = Number(ctx.inputs?.['daybreak-burst-buff'] ?? 60); return Math.min(val, cap); }",
      },
    ],
    signatureFor: ["venti"],
  },
  {
    id: "amos-bow",
    varName: "amosBow",
    name: "Amos' Bow",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Strong-Willed",
    passiveDesc:
      "Increases Normal Attack and Charged Attack DMG by 12~24%. Normal and Charged Attack DMG is increased by 8~16% for every 0.1s up to 5 times (+40~80% flight time DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "amos-flight-stacks",
        label: "Arrow Flight Time Stacks (0-5, 0.1s each)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+8~16% NA & CA DMG per 0.1s flight time (up to +40~80%)",
      },
    ],
    buffs: [
      {
        id: "amos-base-na",
        label: "Base Normal Attack DMG Bonus (Amos' Bow)",
        stat: "normalDmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "amos-base-ca",
        label: "Base Charged Attack DMG Bonus (Amos' Bow)",
        stat: "chargedDmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "amos-flight-ca",
        label: "Flight Time Charged Attack DMG Bonus (Amos' Bow)",
        stat: "chargedDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "amos-flight-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['amos-flight-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
    ],
    signatureFor: ["ganyu"],
  },
  {
    id: "aqua-simulacra",
    varName: "aquaSimulacra",
    name: "Aqua Simulacra",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "The Cleansing Form",
    passiveDesc:
      "HP is increased by 16~32%. When there are opponents nearby, the DMG dealt by the wielder is increased by 20~40% (whether on-field or off-field).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "aqua-opponents-nearby",
        label: "Opponents Nearby (+20~40% All DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% All DMG bonus when enemies are nearby",
      },
    ],
    buffs: [
      {
        id: "aqua-hp",
        label: "Max HP% (Aqua Simulacra)",
        stat: "hp",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "aqua-dmg",
        label: "All DMG Bonus (Aqua Simulacra)",
        stat: "dmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "aqua-opponents-nearby",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['aqua-opponents-nearby'] ?? '1') === '1' || Number(ctx.inputs?.['aqua-opponents-nearby'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
    ],
    signatureFor: ["yelan"],
  },
  {
    id: "astral-vultures-crimson-plumage",
    varName: "astralVulturesCrimsonPlumage",
    name: "Astral Vulture's Crimson Plumage",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 66.2, baseValue: 14.4 },
    passiveName: "A Golden-Eagle Stride",
    passiveDesc:
      "Triggering Swirl reaction increases ATK by 24~48% for 12s. Having 1/2 party members of different elemental types increases Charged Attack DMG by 20/48% ~ 40/96% and Elemental Burst DMG by 10/24% ~ 20/48%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "astral-swirl-active",
        label: "Swirl Triggered Active (+24~48% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+24~48% ATK for 12s",
      },
      {
        id: "astral-diff-elements-count",
        label: "Teammates of Different Elements (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "1 member: +20% CA / +10% Burst. 2 members: +48% CA / +24% Burst.",
      },
    ],
    buffs: [
      {
        id: "astral-atk",
        label: "ATK% (Astral Vulture Swirl)",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "astral-swirl-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['astral-swirl-active'] ?? '1') === '1' || Number(ctx.inputs?.['astral-swirl-active'] ?? 1) > 0; return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "astral-ca-dmg",
        label: "Charged Attack DMG Bonus (Astral Vulture)",
        stat: "chargedDmgBonus",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "astral-diff-elements-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['astral-diff-elements-count'] ?? 2); if (count >= 2) return [48, 60, 72, 84, 96][r - 1]; if (count === 1) return [20, 25, 30, 35, 40][r - 1]; return 0; }",
      },
      {
        id: "astral-burst-dmg",
        label: "Elemental Burst DMG Bonus (Astral Vulture)",
        stat: "burstDmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        conditionKey: "astral-diff-elements-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['astral-diff-elements-count'] ?? 2); if (count >= 2) return [24, 30, 36, 42, 48][r - 1]; if (count === 1) return [10, 12.5, 15, 17.5, 20][r - 1]; return 0; }",
      },
    ],
    signatureFor: ["chasca"],
  },
  {
    id: "hunters-path",
    varName: "huntersPath",
    name: "Hunter's Path",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 44.1, baseValue: 9.6 },
    passiveName: "At the End of the Beast-Paths",
    passiveDesc:
      "Gain 12~24% All Elemental DMG Bonus. Gain the Tireless Hunt effect after hitting an opponent with a Charged Attack, increasing Charged Attack DMG by 160~320% of Elemental Mastery.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "hunters-path-wielder-em",
        label: "Character Total Elemental Mastery (e.g. 300)",
        control: "stacks",
        max: 2000,
        defaultValue: 300,
        hint: "Total EM used to compute flat Charged Attack DMG bonus",
      },
      {
        id: "hunters-path-tireless-hunt",
        label: "Tireless Hunt Active (+160~320% EM as CA DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "Adds EM scaling to Charged Attack DMG",
      },
    ],
    buffs: [
      {
        id: "hunters-path-elem-dmg",
        label: "All Elemental DMG Bonus (Hunter's Path)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "hunters-path-flat-ca",
        label: "Flat Charged Attack DMG from EM (Hunter's Path)",
        stat: "chargedDmgBonus",
        refinementValues: [160, 200, 240, 280, 320],
        isTeamBuff: false,
        conditionKey: "hunters-path-tireless-hunt",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['hunters-path-tireless-hunt'] ?? '1') === '1' || Number(ctx.inputs?.['hunters-path-tireless-hunt'] ?? 1) > 0; if (!on) return 0; const em = Number(ctx.inputs?.['hunters-path-wielder-em'] ?? 300); const ratio = [1.6, 2.0, 2.4, 2.8, 3.2][r - 1]; return em * ratio; }",
      },
    ],
    signatureFor: ["tighnari"],
  },
  {
    id: "polar-star",
    varName: "polarStar",
    name: "Polar Star",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Daylight's Augury",
    passiveDesc:
      "Elemental Skill and Elemental Burst DMG increased by 12~24%. When Normal Attack, Charged Attack, Elemental Skill, or Elemental Burst hits an opponent, gain 1 stack of Ashen Nightstar (max 4 stacks = +48~96% ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "polar-nightstar-stacks",
        label: "Ashen Nightstar Stacks (0-4)",
        control: "stacks",
        max: 4,
        defaultValue: 4,
        hint: "1: +10/12.5%, 2: +20/25%, 3: +30/37.5%, 4: +48/96% ATK",
      },
    ],
    buffs: [
      {
        id: "polar-skill-dmg",
        label: "Elemental Skill DMG Bonus (Polar Star)",
        stat: "skillDmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "polar-burst-dmg",
        label: "Elemental Burst DMG Bonus (Polar Star)",
        stat: "burstDmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "polar-atk",
        label: "ATK% from Nightstar Stacks (Polar Star)",
        stat: "atk",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "polar-nightstar-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['polar-nightstar-stacks'] ?? 4); const rMap: Record<number, number[]> = { 1: [10, 12.5, 15, 17.5, 20], 2: [20, 25, 30, 35, 40], 3: [30, 37.5, 45, 52.5, 60], 4: [48, 60, 72, 84, 96] }; const pct = (rMap[s] || [0, 0, 0, 0, 0])[r - 1] || 0; return (pct / 100) * ctx.baseAtk; }",
      },
    ],
    signatureFor: ["tartaglia"],
  },
  {
    id: "silvershower-heartstrings",
    varName: "silvershowerHeartstrings",
    name: "Silvershower Heartstrings",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "hpPct", label: "HP%", value: 66.2, baseValue: 14.4 },
    passiveName: "Dry Spell",
    passiveDesc:
      "The wielder can gain the Remedy effect (max 3 stacks): increases Max HP by 12/24/40% ~ 24/48/80%. At 3 stacks, increases Elemental Burst CRIT Rate by 28~56%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "silvershower-remedy-stacks",
        label: "Remedy Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "1: +12~24% HP, 2: +24~48% HP, 3: +40~80% HP & +28~56% Burst CRIT Rate",
      },
    ],
    buffs: [
      {
        id: "silvershower-hp",
        label: "Max HP% (Silvershower Heartstrings)",
        stat: "hp",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "silvershower-remedy-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['silvershower-remedy-stacks'] ?? 3); if (s === 3) return [40, 50, 60, 70, 80][r - 1]; if (s === 2) return [24, 30, 36, 42, 48][r - 1]; if (s === 1) return [12, 15, 18, 21, 24][r - 1]; return 0; }",
      },
      {
        id: "silvershower-burst-crit",
        label: "Elemental Burst CRIT Rate% (Silvershower)",
        stat: "critRate",
        refinementValues: [28, 35, 42, 49, 56],
        isTeamBuff: false,
        conditionKey: "silvershower-remedy-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['silvershower-remedy-stacks'] ?? 3); return s >= 3 ? [28, 35, 42, 49, 56][r - 1] : 0; }",
      },
    ],
    signatureFor: ["sigewinne"],
  },
  {
    id: "skyward-harp",
    varName: "skywardHarp",
    name: "Skyward Harp",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 22.1, baseValue: 4.8 },
    passiveName: "Echoing Ballad",
    passiveDesc:
      "Increases CRIT DMG by 20~40%. Hits have a 60~100% chance to inflict a small AoE attack dealing 125% Physical ATK DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "skyward-harp-crit-dmg",
        label: "CRIT DMG% (Skyward Harp)",
        stat: "critDmg",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
    ],
  },
  {
    id: "the-first-great-magic",
    varName: "theFirstGreatMagic",
    name: "The First Great Magic",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 66.2, baseValue: 14.4 },
    passiveName: "Parsifal the Great",
    passiveDesc:
      "Charged Attack DMG increased by 16~32%. For every party member of the same Elemental Type (max 3), gain Gimmick stack (+16/32/48% ~ 32/64/96% ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "magic-same-element-count",
        label: "Party Members of Same Element (1-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "1 member: +16~32% ATK, 2 members: +32~64% ATK, 3 members: +48~96% ATK",
      },
    ],
    buffs: [
      {
        id: "magic-ca-dmg",
        label: "Charged Attack DMG Bonus (The First Great Magic)",
        stat: "chargedDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "magic-atk",
        label: "ATK% from Same Element Party Members (The First Great Magic)",
        stat: "atk",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "magic-same-element-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['magic-same-element-count'] ?? 3); const perMember = [16, 20, 24, 28, 32][r - 1]; return ((Math.min(count, 3) * perMember) / 100) * ctx.baseAtk; }",
      },
    ],
    signatureFor: ["lyney"],
  },
  {
    id: "thundering-pulse",
    varName: "thunderingPulse",
    name: "Thundering Pulse",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 66.2, baseValue: 14.4 },
    passiveName: "Rule By Thunder",
    passiveDesc:
      "Increases ATK by 20~40% and grants Thunder Emblem stacks (max 3): increases Normal Attack DMG by 12/24/40% ~ 24/48/80%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "pulse-emblem-stacks",
        label: "Thunder Emblem Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "1: +12~24%, 2: +24~48%, 3: +40~80% Normal Attack DMG",
      },
    ],
    buffs: [
      {
        id: "pulse-atk",
        label: "ATK% (Thundering Pulse)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk",
      },
      {
        id: "pulse-na-dmg",
        label: "Normal Attack DMG Bonus (Thundering Pulse)",
        stat: "normalDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "pulse-emblem-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['pulse-emblem-stacks'] ?? 3); if (s === 3) return [40, 50, 60, 70, 80][r - 1]; if (s === 2) return [24, 30, 36, 42, 48][r - 1]; if (s === 1) return [12, 15, 18, 21, 24][r - 1]; return 0; }",
      },
    ],
    signatureFor: ["yoimiya"],
  },

  // ==========================================
  // 4-STAR BOWS (29)
  // ==========================================
  {
    id: "covenant-of-frost-and-snow",
    varName: "covenantOfFrostAndSnow",
    name: "Covenant of Frost and Snow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "defPct", label: "DEF%", value: 51.7, baseValue: 11.3 },
    passiveName: "The Law's Equilibrium",
    passiveDesc: "Using an Elemental Skill increases Elemental Mastery by 120~240 for 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "covenant-skill-active",
        label: "Elemental Skill Used (+120~240 EM)",
        control: "toggle",
        defaultValue: 1,
        hint: "+120~240 EM for 12s",
      },
    ],
    buffs: [
      {
        id: "covenant-em",
        label: "Elemental Mastery (Covenant of Frost and Snow)",
        stat: "em",
        refinementValues: [120, 150, 180, 210, 240],
        isTeamBuff: false,
        conditionKey: "covenant-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['covenant-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['covenant-skill-active'] ?? 1) > 0; return on ? [120, 150, 180, 210, 240][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "favonius-warbow",
    varName: "favoniusWarbow",
    name: "Favonius Warbow",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 61.3, baseValue: 13.3 },
    passiveName: "Windfall",
    passiveDesc:
      "CRIT hits have a 60~100% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
    isSupport: true,
    buffType: "team",
    buffs: [],
  },
  {
    id: "jade-vista",
    varName: "jadeVista",
    name: "Jade Vista",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "A Candle Woven From the Night",
    passiveDesc:
      "For other party members: increases wielder EM by 64~128 per member with same element, and increases wielder ATK by 12~24% per member with different element. Max 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "jade-vista-same-count",
        label: "Party Members with Same Element (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 1,
        hint: "+64~128 EM per member with matching element",
      },
      {
        id: "jade-vista-diff-count",
        label: "Party Members with Different Element (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 2,
        hint: "+12~24% ATK per member with different element",
      },
    ],
    buffs: [
      {
        id: "jade-vista-em",
        label: "Elemental Mastery (Jade Vista)",
        stat: "em",
        refinementValues: [64, 80, 96, 112, 128],
        isTeamBuff: false,
        conditionKey: "jade-vista-same-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['jade-vista-same-count'] ?? 1); const perStack = [64, 80, 96, 112, 128][r - 1]; return Math.min(count, 3) * perStack; }",
      },
      {
        id: "jade-vista-atk",
        label: "ATK% (Jade Vista)",
        stat: "atk",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "jade-vista-diff-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['jade-vista-diff-count'] ?? 2); const perStack = [12, 15, 18, 21, 24][r - 1]; return ((Math.min(count, 3) * perStack) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "sacrificial-bow",
    varName: "sacrificialBow",
    name: "Sacrificial Bow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Composed",
    passiveDesc:
      "After dealing damage to an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
    isSupport: true,
    buffType: "self",
    buffs: [],
  },
  {
    id: "sequence-of-solitude",
    varName: "sequenceOfSolitude",
    name: "Sequence of Solitude",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Silent Trigger",
    passiveDesc: "Deals 40~80% Max HP as AoE DMG at the target location once every 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "snare-hook",
    varName: "snareHook",
    name: "Snare Hook",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Phantom Flash",
    passiveDesc:
      "Upon triggering an Elemental Reaction, Elemental Mastery increases by 60~120 for 12s. If Moonsign is active, increases EM by an additional 60~120 (up to +120~240 EM).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "snare-reaction-active",
        label: "Elemental Reaction Triggered (+60~120 EM)",
        control: "toggle",
        defaultValue: 1,
        hint: "+60~120 EM for 12s",
      },
      {
        id: "snare-moonsign-active",
        label: "Moonsign Active (2x EM Buff)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles EM bonus (up to +120~240 EM)",
      },
    ],
    buffs: [
      {
        id: "snare-em",
        label: "Elemental Mastery (Snare Hook)",
        stat: "em",
        refinementValues: [120, 150, 180, 210, 240],
        isTeamBuff: false,
        conditionKey: "snare-reaction-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['snare-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['snare-reaction-active'] ?? 1) > 0; if (!on) return 0; const moon = (ctx.inputs?.['snare-moonsign-active'] ?? '1') === '1' || Number(ctx.inputs?.['snare-moonsign-active'] ?? 1) > 0; const mult = moon ? 2 : 1; return [60, 75, 90, 105, 120][r - 1] * mult; }",
      },
    ],
  },
  {
    id: "alley-hunter",
    varName: "alleyHunter",
    name: "Alley Hunter",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Oppidan Ambush",
    passiveDesc:
      "While in the party not on the field, DMG increases by 2~4% every second (max 10 stacks = +20~40% DMG). When on field for more than 4s, DMG buff decreases by 4% per second.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "alley-hunter-stacks",
        label: "Oppidan Ambush Stacks (0-10)",
        control: "stacks",
        max: 10,
        defaultValue: 10,
        hint: "+2~4% All DMG per stack (up to +20~40%)",
      },
    ],
    buffs: [
      {
        id: "alley-hunter-dmg",
        label: "All DMG Bonus (Alley Hunter)",
        stat: "dmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "alley-hunter-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['alley-hunter-stacks'] ?? 10); return s * [2, 2.5, 3, 3.5, 4][r - 1]; }",
      },
    ],
  },
  {
    id: "blackcliff-warbow",
    varName: "blackcliffWarbow",
    name: "Blackcliff Warbow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 36.8, baseValue: 8.0 },
    passiveName: "Press the Advantage",
    passiveDesc:
      "After defeating an opponent, ATK is increased by 12~24% for 30s. Max 3 stacks (+36~72% ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "warbow-defeat-stacks",
        label: "Opponents Defeated Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+12~24% ATK per stack (up to +36~72%)",
      },
    ],
    buffs: [
      {
        id: "warbow-atk",
        label: "ATK% (Blackcliff Warbow Stacks)",
        stat: "atk",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "warbow-defeat-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['warbow-defeat-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "chain-breaker",
    varName: "chainBreaker",
    name: "Chain Breaker",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Flower-Feather Song",
    passiveDesc:
      "For every party member from Natlan or with a different Elemental Type than the wielder, gains +4.8~9.6% ATK (max 3 stacks = +14.4~28.8% ATK). If >= 3 stacks, gains +24~48 Elemental Mastery.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "chain-breaker-stacks",
        label: "Natlan/Different Element Teammates (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+4.8~9.6% ATK per stack. At 3 stacks, +24~48 EM.",
      },
    ],
    buffs: [
      {
        id: "chain-breaker-atk",
        label: "ATK% (Chain Breaker)",
        stat: "atk",
        refinementValues: [14.4, 18.0, 21.6, 25.2, 28.8],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "chain-breaker-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['chain-breaker-stacks'] ?? 3); const perStack = [4.8, 6.0, 7.2, 8.4, 9.6][r - 1]; return ((s * perStack) / 100) * ctx.baseAtk; }",
      },
      {
        id: "chain-breaker-em",
        label: "Elemental Mastery at 3 Stacks (Chain Breaker)",
        stat: "em",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        conditionKey: "chain-breaker-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['chain-breaker-stacks'] ?? 3); return s >= 3 ? [24, 30, 36, 42, 48][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "cloudforged",
    varName: "cloudforged",
    name: "Cloudforged",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Sundered Skies",
    passiveDesc:
      "After Elemental Energy is decreased, Elemental Mastery increases by 40~80 for 18s. Max 2 stacks (+80~160 EM).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "cloudforged-stacks",
        label: "Energy Decreased Stacks (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+40~80 EM per stack (up to +80~160 EM)",
      },
    ],
    buffs: [
      {
        id: "cloudforged-em",
        label: "Elemental Mastery (Cloudforged Stacks)",
        stat: "em",
        refinementValues: [80, 100, 120, 140, 160],
        isTeamBuff: false,
        conditionKey: "cloudforged-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['cloudforged-stacks'] ?? 2); return s * [40, 50, 60, 70, 80][r - 1]; }",
      },
    ],
  },
  {
    id: "compound-bow",
    varName: "compoundBow",
    name: "Compound Bow",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 69.0, baseValue: 15.0 },
    passiveName: "Infusion Arrow",
    passiveDesc:
      "Normal and Charged Attack hits increase ATK by 4~8% and Normal ATK SPD by 1.2~2.4% for 6s. Max 4 stacks (+16~32% ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "compound-stacks",
        label: "Infusion Arrow Stacks (0-4)",
        control: "stacks",
        max: 4,
        defaultValue: 4,
        hint: "+4~8% ATK per stack (up to +16~32%)",
      },
    ],
    buffs: [
      {
        id: "compound-atk",
        label: "ATK% (Compound Bow)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "compound-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['compound-stacks'] ?? 4); return ((s * [4, 5, 6, 7, 8][r - 1]) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "end-of-the-line",
    varName: "endOfTheLine",
    name: "End of the Line",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Net Snare",
    passiveDesc:
      "Using an Elemental Skill triggers Flowrider effect, dealing 80~160% ATK as AoE DMG on hit.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "fading-twilight",
    varName: "fadingTwilight",
    name: "Fading Twilight",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Radiance Infusion",
    passiveDesc:
      "Has 3 states: Evengleam (+6~12% DMG), Afterglow (+10~20% DMG), Dawnblaze (+14~28% DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "fading-twilight-state",
        label: "Radiance Infusion State (1: Evengleam, 2: Afterglow, 3: Dawnblaze)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "1: +6~12% DMG, 2: +10~20% DMG, 3: +14~28% DMG",
      },
    ],
    buffs: [
      {
        id: "twilight-dmg",
        label: "All DMG Bonus (Fading Twilight)",
        stat: "dmgBonus",
        refinementValues: [14, 17.5, 21, 24.5, 28],
        isTeamBuff: false,
        conditionKey: "fading-twilight-state",
        computeCode:
          "(r, ctx) => { const state = Number(ctx.inputs?.['fading-twilight-state'] ?? 3); const map: Record<number, number[]> = { 1: [6, 7.5, 9, 10.5, 12], 2: [10, 12.5, 15, 17.5, 20], 3: [14, 17.5, 21, 24.5, 28] }; return (map[state] || [0, 0, 0, 0, 0])[r - 1] || 0; }",
      },
    ],
  },
  {
    id: "flower-wreathed-feathers",
    varName: "flowerWreathedFeathers",
    name: "Flower-Wreathed Feathers",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "A Plume of White Feathers",
    passiveDesc:
      "Aimed Shot charging time is reduced. Charged Attack DMG is increased by 20~40% (2x in Nightsoul's Blessing = +40~80%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "feather-nightsoul-active",
        label: "In Nightsoul's Blessing (2x CA DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles Charged Attack DMG bonus (up to +40~80%)",
      },
    ],
    buffs: [
      {
        id: "feather-ca-dmg",
        label: "Charged Attack DMG Bonus (Flower-Wreathed Feathers)",
        stat: "chargedDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "feather-nightsoul-active",
        computeCode:
          "(r, ctx) => { const nightsoul = (ctx.inputs?.['feather-nightsoul-active'] ?? '1') === '1' || Number(ctx.inputs?.['feather-nightsoul-active'] ?? 1) > 0; const mult = nightsoul ? 2 : 1; return [20, 25, 30, 35, 40][r - 1] * mult; }",
      },
    ],
  },
  {
    id: "hamayumi",
    varName: "hamayumi",
    name: "Hamayumi",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Full Draw",
    passiveDesc:
      "Increases Normal Attack DMG by 16~32% and Charged Attack DMG by 12~24%. When 100% Energy, this effect is increased by 100% (+32~64% NA, +24~48% CA).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "hamayumi-full-energy",
        label: "Character Energy is 100% (2x Buff)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles NA and CA DMG bonuses",
      },
    ],
    buffs: [
      {
        id: "hamayumi-na-dmg",
        label: "Normal Attack DMG Bonus (Hamayumi)",
        stat: "normalDmgBonus",
        refinementValues: [32, 40, 48, 56, 64],
        isTeamBuff: false,
        conditionKey: "hamayumi-full-energy",
        computeCode:
          "(r, ctx) => { const full = (ctx.inputs?.['hamayumi-full-energy'] ?? '1') === '1' || Number(ctx.inputs?.['hamayumi-full-energy'] ?? 1) > 0; const mult = full ? 2 : 1; return [16, 20, 24, 28, 32][r - 1] * mult; }",
      },
      {
        id: "hamayumi-ca-dmg",
        label: "Charged Attack DMG Bonus (Hamayumi)",
        stat: "chargedDmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        conditionKey: "hamayumi-full-energy",
        computeCode:
          "(r, ctx) => { const full = (ctx.inputs?.['hamayumi-full-energy'] ?? '1') === '1' || Number(ctx.inputs?.['hamayumi-full-energy'] ?? 1) > 0; const mult = full ? 2 : 1; return [12, 15, 18, 21, 24][r - 1] * mult; }",
      },
    ],
  },
  {
    id: "ibis-piercer",
    varName: "ibisPiercer",
    name: "Ibis Piercer",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Crumbling Mast",
    passiveDesc:
      "Charged Attacks hitting opponents increase Elemental Mastery by 40~80 for 6s. Max 2 stacks (+80~160 EM).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "ibis-stacks",
        label: "Crumbling Mast Stacks (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+40~80 EM per stack (up to +80~160 EM)",
      },
    ],
    buffs: [
      {
        id: "ibis-em",
        label: "Elemental Mastery (Ibis Piercer)",
        stat: "em",
        refinementValues: [80, 100, 120, 140, 160],
        isTeamBuff: false,
        conditionKey: "ibis-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['ibis-stacks'] ?? 2); return s * [40, 50, 60, 70, 80][r - 1]; }",
      },
    ],
  },
  {
    id: "kings-squire",
    varName: "kingsSquire",
    name: "King's Squire",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Labyrinth Lord's Whim",
    passiveDesc:
      "Obtain Teachings of the Forest effect when unleashing Elemental Skill/Burst, increasing Elemental Mastery by 60~140 for 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "kings-squire-active",
        label: "Teachings of the Forest Active (+60~140 EM)",
        control: "toggle",
        defaultValue: 1,
        hint: "+60~140 EM for 12s",
      },
    ],
    buffs: [
      {
        id: "kings-squire-em",
        label: "Elemental Mastery (King's Squire)",
        stat: "em",
        refinementValues: [60, 80, 100, 120, 140],
        isTeamBuff: false,
        conditionKey: "kings-squire-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['kings-squire-active'] ?? '1') === '1' || Number(ctx.inputs?.['kings-squire-active'] ?? 1) > 0; return on ? [60, 80, 100, 120, 140][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "mitternachts-waltz",
    varName: "mitternachtsWaltz",
    name: "Mitternachts Waltz",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 51.7, baseValue: 11.3 },
    passiveName: "Evernight Duet",
    passiveDesc:
      "Normal Attack hits increase Elemental Skill DMG by 20~40% for 5s. Elemental Skill hits increase Normal Attack DMG by 20~40% for 5s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "waltz-na-hit",
        label: "Normal Attack Hit (+20~40% Skill DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% Skill DMG for 5s",
      },
      {
        id: "waltz-skill-hit",
        label: "Elemental Skill Hit (+20~40% Normal Attack DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% Normal Attack DMG for 5s",
      },
    ],
    buffs: [
      {
        id: "waltz-skill-dmg",
        label: "Elemental Skill DMG Bonus (Mitternachts Waltz)",
        stat: "skillDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "waltz-na-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['waltz-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['waltz-na-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
      {
        id: "waltz-na-dmg",
        label: "Normal Attack DMG Bonus (Mitternachts Waltz)",
        stat: "normalDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "waltz-skill-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['waltz-skill-hit'] ?? '1') === '1' || Number(ctx.inputs?.['waltz-skill-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
    ],
    signatureFor: ["fischl"],
  },
  {
    id: "mouuns-moon",
    varName: "mouunsMoon",
    name: "Mouun's Moon",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Watatsumi Wavewalker",
    passiveDesc:
      "For every point of the entire party's combined maximum Energy capacity, Elemental Burst DMG is increased by 0.12~0.24% (up to 40~80%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "mouun-party-energy",
        label: "Party Total Energy Capacity (e.g. 300)",
        control: "stacks",
        max: 400,
        defaultValue: 300,
        hint: "+0.12~0.24% Burst DMG per total party energy capacity point",
      },
    ],
    buffs: [
      {
        id: "mouun-burst-dmg",
        label: "Elemental Burst DMG Bonus (Mouun's Moon)",
        stat: "burstDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "mouun-party-energy",
        computeCode:
          "(r, ctx) => { const energy = Number(ctx.inputs?.['mouun-party-energy'] ?? 300); const ratio = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; const cap = [40, 50, 60, 70, 80][r - 1]; return Math.min(energy * ratio * 100, cap); }",
      },
    ],
  },
  {
    id: "predator",
    varName: "predator",
    name: "Predator",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Strong Strike",
    passiveDesc:
      "Dealing Cryo DMG to opponents increases Normal and Charged Attack DMG by 10% for 6s (max 2 stacks = +20% NA/CA DMG). Equipping on Aloy increases ATK by 66.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "predator-stacks",
        label: "Cryo DMG Hits Stacks (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+10% NA and CA DMG per stack (up to +20%)",
      },
      {
        id: "predator-is-aloy",
        label: "Equipped on Aloy (+66 Flat ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+66 Flat ATK for Aloy",
      },
    ],
    buffs: [
      {
        id: "predator-na-dmg",
        label: "Normal Attack DMG Bonus (Predator)",
        stat: "normalDmgBonus",
        refinementValues: [20, 20, 20, 20, 20],
        isTeamBuff: false,
        conditionKey: "predator-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['predator-stacks'] ?? 2); return s * 10; }",
      },
      {
        id: "predator-ca-dmg",
        label: "Charged Attack DMG Bonus (Predator)",
        stat: "chargedDmgBonus",
        refinementValues: [20, 20, 20, 20, 20],
        isTeamBuff: false,
        conditionKey: "predator-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['predator-stacks'] ?? 2); return s * 10; }",
      },
      {
        id: "predator-aloy-atk",
        label: "Flat ATK for Aloy (Predator)",
        stat: "atk",
        refinementValues: [66, 66, 66, 66, 66],
        isTeamBuff: false,
        conditionKey: "predator-is-aloy",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['predator-is-aloy'] ?? '1') === '1' || Number(ctx.inputs?.['predator-is-aloy'] ?? 1) > 0; return on ? 66 : 0; }",
      },
    ],
    signatureFor: ["aloy"],
  },
  {
    id: "prototype-crescent",
    varName: "prototypeCrescent",
    name: "Prototype Crescent",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Unreturning",
    passiveDesc:
      "Charged Attack hits on weak points increase Movement SPD by 10% and ATK by 36~72% for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "crescent-weakpoint-hit",
        label: "Charged Attack Hit on Weak Point (+36~72% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+36~72% ATK for 10s",
      },
    ],
    buffs: [
      {
        id: "crescent-atk",
        label: "ATK% (Prototype Crescent)",
        stat: "atk",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "crescent-weakpoint-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['crescent-weakpoint-hit'] ?? '1') === '1' || Number(ctx.inputs?.['crescent-weakpoint-hit'] ?? 1) > 0; return on ? ([36, 45, 54, 63, 72][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "rainbow-serpents-rain-bow",
    varName: "rainbowSerpentsRainBow",
    name: "Rainbow Serpent's Rain Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Astral Whispers Beyond the Sacred Throne",
    passiveDesc:
      "ATK is increased by 28~56% for 8s after the equipping character's attacks hit an opponent while they are off-field.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "rainbow-serpent-offfield-hit",
        label: "Off-Field Attack Hit Active (+28~56% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+28~56% ATK for 8s",
      },
    ],
    buffs: [
      {
        id: "rainbow-serpent-atk",
        label: "ATK% (Rainbow Serpent's Rain Bow)",
        stat: "atk",
        refinementValues: [28, 35, 42, 49, 56],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "rainbow-serpent-offfield-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['rainbow-serpent-offfield-hit'] ?? '1') === '1' || Number(ctx.inputs?.['rainbow-serpent-offfield-hit'] ?? 1) > 0; return on ? ([28, 35, 42, 49, 56][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "range-gauge",
    varName: "rangeGauge",
    name: "Range Gauge",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Masons' Ditty",
    passiveDesc:
      "When healed or healing, gain a Stoic's Symbol for 30s (max 3). Using Skill or Burst consumes symbols to grant 16~32% ATK and 12~24% All Elemental DMG Bonus for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "range-symbols-consumed",
        label: "Stoic Symbols Consumed (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+16~32% ATK and +12~24% All Elem DMG for 15s",
      },
    ],
    buffs: [
      {
        id: "range-gauge-atk",
        label: "ATK% (Range Gauge)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "range-symbols-consumed",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['range-symbols-consumed'] ?? 3); return s > 0 ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "range-gauge-elem-dmg",
        label: "All Elemental DMG Bonus (Range Gauge)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "range-symbols-consumed",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['range-symbols-consumed'] ?? 3); return s > 0 ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "royal-bow",
    varName: "royalBow",
    name: "Royal Bow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Focus",
    passiveDesc:
      "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks (+40~80%). A CRIT hit removes all stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "royal-bow-stacks",
        label: "Focus Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+8~16% CRIT Rate per stack (up to +40~80%)",
      },
    ],
    buffs: [
      {
        id: "royal-bow-crit",
        label: "CRIT Rate% (Royal Bow Focus)",
        stat: "critRate",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "royal-bow-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['royal-bow-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
    ],
  },
  {
    id: "rust",
    varName: "rust",
    name: "Rust",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Rapid Firing",
    passiveDesc: "Increases Normal Attack DMG by 40~80% but decreases Charged Attack DMG by 10%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "rust-na-dmg",
        label: "Normal Attack DMG Bonus (Rust)",
        stat: "normalDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        computeCode: "(r) => [40, 50, 60, 70, 80][r - 1]",
      },
      {
        id: "rust-ca-penalty",
        label: "Charged Attack DMG Penalty (Rust)",
        stat: "chargedDmgBonus",
        refinementValues: [-10, -10, -10, -10, -10],
        isTeamBuff: false,
        computeCode: "() => -10",
      },
    ],
    signatureFor: ["yoimiya"],
  },
  {
    id: "scion-of-the-blazing-sun",
    varName: "scionOfTheBlazingSun",
    name: "Scion of the Blazing Sun",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 18.4, baseValue: 4.0 },
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
      },
    ],
    buffs: [
      {
        id: "scion-ca-dmg",
        label: "Charged Attack DMG Bonus (Scion Blazing Sun)",
        stat: "chargedDmgBonus",
        refinementValues: [28, 35, 42, 49, 56],
        isTeamBuff: false,
        conditionKey: "scion-heartsearer-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['scion-heartsearer-active'] ?? '1') === '1' || Number(ctx.inputs?.['scion-heartsearer-active'] ?? 1) > 0; return on ? [28, 35, 42, 49, 56][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "song-of-stillness",
    varName: "songOfStillness",
    name: "Song of Stillness",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "White Noise",
    passiveDesc:
      "After the wielder is healed, they will deal 16~32% more DMG for 8s. Can trigger even when off-field.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "stillness-healed-active",
        label: "Character Healed Active (+16~32% DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% All DMG for 8s after receiving healing",
      },
    ],
    buffs: [
      {
        id: "stillness-dmg",
        label: "All DMG Bonus (Song of Stillness)",
        stat: "dmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "stillness-healed-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['stillness-healed-active'] ?? '1') === '1' || Number(ctx.inputs?.['stillness-healed-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "the-stringless",
    varName: "theStringless",
    name: "The Stringless",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Song of Bygone Days",
    passiveDesc: "Increases Elemental Skill and Elemental Burst DMG by 24~48%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "stringless-skill-dmg",
        label: "Elemental Skill DMG Bonus (The Stringless)",
        stat: "skillDmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        computeCode: "(r) => [24, 30, 36, 42, 48][r - 1]",
      },
      {
        id: "stringless-burst-dmg",
        label: "Elemental Burst DMG Bonus (The Stringless)",
        stat: "burstDmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        computeCode: "(r) => [24, 30, 36, 42, 48][r - 1]",
      },
    ],
  },
  {
    id: "the-viridescent-hunt",
    varName: "theViridescentHunt",
    name: "The Viridescent Hunt",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Verdant Wind",
    passiveDesc:
      "Normal and Aimed Shot hits have a 50% chance to generate a Cyclone, dealing 40~80% ATK as DMG and pulling enemies.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "windblume-ode",
    varName: "windblumeOde",
    name: "Windblume Ode",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Windblume Wish",
    passiveDesc:
      "After using an Elemental Skill, receives a blessing of the Windblume that increases ATK by 16~32% for 6s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "windblume-skill-active",
        label: "Elemental Skill Used (+16~32% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% ATK for 6s",
      },
    ],
    buffs: [
      {
        id: "windblume-atk",
        label: "ATK% (Windblume Ode)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "windblume-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['windblume-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['windblume-skill-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },

  // ==========================================
  // 3-STAR BOWS (5)
  // ==========================================
  {
    id: "slingshot",
    varName: "slingshot",
    name: "Slingshot",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 31.2, baseValue: 6.8 },
    passiveName: "Slingshot",
    passiveDesc:
      "If a Normal or Charged Attack hits a target within 0.3s of being fired, increases DMG by 36~60%. Otherwise, decreases DMG by 10%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "slingshot-pointblank",
        label: "Hit within 0.3s (+36~60% DMG vs -10%)",
        control: "toggle",
        defaultValue: 1,
        hint: "Toggle on for +36~60% DMG, off for -10% DMG penalty",
      },
    ],
    buffs: [
      {
        id: "slingshot-na-ca-dmg",
        label: "Normal & Charged Attack DMG Bonus (Slingshot)",
        stat: "normalDmgBonus",
        refinementValues: [36, 42, 48, 54, 60],
        isTeamBuff: false,
        conditionKey: "slingshot-pointblank",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['slingshot-pointblank'] ?? '1') === '1' || Number(ctx.inputs?.['slingshot-pointblank'] ?? 1) > 0; return on ? [36, 42, 48, 54, 60][r - 1] : -10; }",
      },
    ],
  },
  {
    id: "sharpshooters-oath",
    varName: "sharpshootersOath",
    name: "Sharpshooter's Oath",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 46.9, baseValue: 10.2 },
    passiveName: "Precise",
    passiveDesc: "Increases DMG against weak spots by 24~48%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "sharpshooter-weakspot",
        label: "Target is Weak Spot (+24~48% DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+24~48% DMG on weak spot hit",
      },
    ],
    buffs: [
      {
        id: "sharpshooter-dmg",
        label: "All DMG Bonus on Weak Spots (Sharpshooter's Oath)",
        stat: "dmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        conditionKey: "sharpshooter-weakspot",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['sharpshooter-weakspot'] ?? '1') === '1' || Number(ctx.inputs?.['sharpshooter-weakspot'] ?? 1) > 0; return on ? [24, 30, 36, 42, 48][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "raven-bow",
    varName: "ravenBow",
    name: "Raven Bow",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "em", label: "Elemental Mastery", value: 94, baseValue: 20 },
    passiveName: "Bane of Flame and Water",
    passiveDesc: "Increases DMG against opponents affected by Hydro or Pyro by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "raven-bow-affected",
        label: "Opponent Affected by Hydro/Pyro (+12~24% DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% All DMG bonus vs Hydro/Pyro affected enemies",
      },
    ],
    buffs: [
      {
        id: "raven-bow-dmg",
        label: "All DMG Bonus vs Hydro/Pyro (Raven Bow)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "raven-bow-affected",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['raven-bow-affected'] ?? '1') === '1' || Number(ctx.inputs?.['raven-bow-affected'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "recurve-bow",
    varName: "recurveBow",
    name: "Recurve Bow",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "hpPct", label: "HP%", value: 46.9, baseValue: 10.2 },
    passiveName: "Cull the Weak",
    passiveDesc: "Defeating an opponent restores 8~16% HP.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "messenger",
    varName: "messenger",
    name: "Messenger",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 31.2, baseValue: 6.8 },
    passiveName: "Flying Messenger",
    passiveDesc: "Charged Attack hits on weak spots deal an additional 100~200% ATK DMG as CRIT hit.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },

  // ==========================================
  // 2-STAR & 1-STAR BOWS (2)
  // ==========================================
  {
    id: "seasoned-hunters-bow",
    varName: "seasonedHuntersBow",
    name: "Seasoned Hunter's Bow",
    rarity: 2,
    baseAtk: 243,
    lvl1BaseAtk: 33,
    passiveName: "",
    passiveDesc: "",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "hunters-bow",
    varName: "huntersBow",
    name: "Hunter's Bow",
    rarity: 1,
    baseAtk: 185,
    lvl1BaseAtk: 23,
    passiveName: "",
    passiveDesc: "",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
];

// Helper to write a weapon file
function generateWeaponFile(w: BowDefinition): string {
  const buffCode = (w.buffs || [])
    .map(
      (b: any) => `    {
      id: "${b.id}",
      label: "${b.label.replace(/"/g, '\\"')}",
      ${b.description ? `description: "${b.description.replace(/"/g, '\\"')}",\n      ` : ""}stat: "${b.stat}",
      refinementValues: [${b.refinementValues.join(", ")}],
      isTeamBuff: ${b.isTeamBuff},
      ${b.isPercent ? "isPercent: true,\n      " : ""}${b.conditionKey ? `conditionKey: "${b.conditionKey}",\n      ` : ""}${b.computeCode ? `compute: ${b.computeCode},` : ""}
    }`
    )
    .join(",\n");

  const mechanicCode = w.mechanicDefs?.length
    ? `  mechanicDefs: [\n` +
      w.mechanicDefs
        .map(
          (m: any) => `    {
      id: "${m.id}",
      label: "${m.label.replace(/"/g, '\\"')}",
      control: "${m.control}",
      ${m.defaultValue !== undefined ? `defaultValue: ${typeof m.defaultValue === "string" ? `"${m.defaultValue}"` : m.defaultValue},\n      ` : ""}${m.max !== undefined ? `max: ${m.max},\n      ` : ""}${m.min !== undefined ? `min: ${m.min},\n      ` : ""}${m.hint ? `hint: "${m.hint.replace(/"/g, '\\"')}",\n    ` : ""}}`
        )
        .join(",\n") +
      `\n  ],`
    : "";

  return `import type { WeaponConfig } from "../types";

export const ${w.varName}: WeaponConfig = {
  id: "${w.id}",
  name: "${w.name.replace(/"/g, '\\"')}",
  type: "Bow",
  rarity: ${w.rarity},
  baseAtk: ${w.baseAtk},
  lvl1BaseAtk: ${w.lvl1BaseAtk},
  ${
    w.subStat
      ? `subStat: {
    type: "${w.subStat.type}",
    label: "${w.subStat.label}",
    value: ${w.subStat.value},
    ${w.subStat.baseValue !== undefined ? `baseValue: ${w.subStat.baseValue},` : ""}
  },`
      : ""
  }
  passiveName: "${w.passiveName.replace(/"/g, '\\"')}",
  passiveDesc:
    "${w.passiveDesc.replace(/"/g, '\\"')}",
  isSupport: ${w.isSupport},
  buffType: "${w.buffType}",
${mechanicCode ? mechanicCode + "\n" : ""}  buffs: [
${buffCode}
  ],
  ${w.signatureFor ? `signatureFor: [${w.signatureFor.map((s: string) => `"${s}"`).join(", ")}],` : ""}
};
`;
}

// Generate all bow files
const bowsDir = path.resolve("src/data/registry/weapons/bows");

// Remove anomalies if they exist in bowsDir
const anomaliesToRemove = ["frostbreath.ts", "whitelake-frostfeather.ts"];
for (const file of anomaliesToRemove) {
  const fullPath = path.join(bowsDir, file);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Removed anomaly file: ${file}`);
  }
}

for (const w of COMPLETE_BOWS) {
  const filePath = path.join(bowsDir, `${w.id}.ts`);
  const content = generateWeaponFile(w);
  fs.writeFileSync(filePath, content, "utf-8");
}

// Update bows/index.ts
const imports = COMPLETE_BOWS.map((w) => `import { ${w.varName} } from "./${w.id}";`).join("\n");
const names = COMPLETE_BOWS.map((w) => w.varName).join(",\n  ");

const indexContent = `${imports}
import type { WeaponConfig } from "../types";

export {
  ${names},
};

export const BOWS: WeaponConfig[] = [
  ${names},
];
`;

fs.writeFileSync(path.join(bowsDir, "index.ts"), indexContent, "utf-8");

console.log(`Successfully generated ${COMPLETE_BOWS.length} bow files and updated bows/index.ts.`);
