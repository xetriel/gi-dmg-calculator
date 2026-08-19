import fs from "fs";
import path from "path";

export interface CatalystDefinition {
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

export const COMPLETE_CATALYSTS: CatalystDefinition[] = [
  // ==========================================
  // 5-STAR CATALYSTS (20)
  // ==========================================
  {
    id: "a-thousand-floating-dreams",
    varName: "aThousandFloatingDreams",
    name: "A Thousand Floating Dreams",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 265, baseValue: 58 },
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
        max: 3,
        defaultValue: 0,
        hint: "+32~64 EM to wielder per teammate with matching element",
      },
      {
        id: "dreams-diff-element-count",
        label: "Teammates with Different Element (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+10~26% Elemental DMG to wielder per teammate with different element",
      },
    ],
    buffs: [
      {
        id: "dreams-party-em",
        label: "Party EM (A Thousand Floating Dreams)",
        description: "Nearby party members gain +40~48 Elemental Mastery",
        stat: "em",
        refinementValues: [40, 42, 44, 46, 48],
        isTeamBuff: true,
        computeCode: "(r) => [40, 42, 44, 46, 48][r - 1]",
      },
      {
        id: "dreams-self-em",
        label: "Self EM from Same Element Allies (Dreams)",
        stat: "em",
        refinementValues: [32, 40, 48, 56, 64],
        isTeamBuff: false,
        conditionKey: "dreams-same-element-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['dreams-same-element-count'] ?? 0); const perStack = [32, 40, 48, 56, 64][r - 1]; return Math.min(count, 3) * perStack; }",
      },
      {
        id: "dreams-self-dmg",
        label: "Self Elemental DMG Bonus from Different Element Allies (Dreams)",
        stat: "dmgBonus",
        refinementValues: [10, 14, 18, 22, 26],
        isTeamBuff: false,
        conditionKey: "dreams-diff-element-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['dreams-diff-element-count'] ?? 3); const perStack = [10, 14, 18, 22, 26][r - 1]; return Math.min(count, 3) * perStack; }",
      },
    ],
    signatureFor: ["nahida"],
  },
  {
    id: "cranes-echoing-call",
    varName: "cranesEchoingCall",
    name: "Crane's Echoing Call",
    rarity: 5,
    baseAtk: 741,
    lvl1BaseAtk: 49,
    subStat: { type: "atkPct", label: "ATK%", value: 16.5, baseValue: 3.6 },
    passiveName: "Pavilion of the Sun",
    passiveDesc:
      "After the equipping character hits an opponent with a Plunging Attack, all nearby party members' Plunging Attacks deal 28~56% increased DMG for 20s. When nearby party members hit opponents with Plunging Attacks, they will restore 2.5~3.5 Energy to the equipping character.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "cranes-plunge-hit",
        label: "Wielder Plunging Attack Hit Active (+28~56% Party Plunge DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "Team buff: +28~56% Plunging Attack DMG for 20s",
      },
    ],
    buffs: [
      {
        id: "cranes-party-plunge-dmg",
        label: "Party Plunging Attack DMG Bonus (Crane's Echoing Call)",
        description: "All nearby party members gain +28~56% Plunging Attack DMG for 20s",
        stat: "plungeDmgBonus",
        refinementValues: [28, 35, 42, 49, 56],
        isTeamBuff: true,
        conditionKey: "cranes-plunge-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['cranes-plunge-hit'] ?? '1') === '1' || Number(ctx.inputs?.['cranes-plunge-hit'] ?? 1) > 0; return on ? [28, 35, 42, 49, 56][r - 1] : 0; }",
      },
    ],
    signatureFor: ["xianyun"],
  },
  {
    id: "cashflow-supervision",
    varName: "cashflowSupervision",
    name: "Cashflow Supervision",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 22.1, baseValue: 4.8 },
    passiveName: "Golden Blood-Tide",
    passiveDesc:
      "ATK is increased by 14~28%. When current HP increases or decreases, Normal Attack DMG is increased by 16~32% and Charged Attack DMG is increased by 14~28% for 4s. Max 3 stacks (up to +48~96% NA, +42~84% CA).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "cashflow-hp-stacks",
        label: "Blood-Tide Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+16~32% NA and +14~28% CA DMG per stack (up to +48~96% NA, +42~84% CA)",
      },
    ],
    buffs: [
      {
        id: "cashflow-atk",
        label: "ATK% (Cashflow Supervision)",
        stat: "atk",
        refinementValues: [14, 17.5, 21, 24.5, 28],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([14, 17.5, 21, 24.5, 28][r - 1] / 100) * ctx.baseAtk",
      },
      {
        id: "cashflow-na-dmg",
        label: "Normal Attack DMG Bonus (Cashflow Supervision)",
        stat: "normalDmgBonus",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "cashflow-hp-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['cashflow-hp-stacks'] ?? 3); return s * [16, 20, 24, 28, 32][r - 1]; }",
      },
      {
        id: "cashflow-ca-dmg",
        label: "Charged Attack DMG Bonus (Cashflow Supervision)",
        stat: "chargedDmgBonus",
        refinementValues: [42, 52.5, 63, 73.5, 84],
        isTeamBuff: false,
        conditionKey: "cashflow-hp-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['cashflow-hp-stacks'] ?? 3); return s * [14, 17.5, 21, 24.5, 28][r - 1]; }",
      },
    ],
    signatureFor: ["wriothesley"],
  },
  {
    id: "everlasting-moonglow",
    varName: "everlastingMoonglow",
    name: "Everlasting Moonglow",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "hpPct", label: "HP%", value: 49.6, baseValue: 10.8 },
    passiveName: "Byakuya Koukoku",
    passiveDesc:
      "Healing Bonus is increased by 10~20%, Normal Attack DMG is increased by 1~3% of the Max HP of the character equipping this weapon.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "moonglow-wielder-hp",
        label: "Character Total Max HP (e.g. 40000)",
        control: "stacks",
        max: 80000,
        defaultValue: 40000,
        hint: "Max HP used for flat Normal Attack DMG bonus",
      },
    ],
    buffs: [
      {
        id: "moonglow-healing-bonus",
        label: "Healing Bonus% (Everlasting Moonglow)",
        stat: "healingBonus",
        refinementValues: [10, 12.5, 15, 17.5, 20],
        isTeamBuff: false,
        computeCode: "(r) => [10, 12.5, 15, 17.5, 20][r - 1]",
      },
      {
        id: "moonglow-na-flat",
        label: "Flat Normal Attack DMG from Max HP (Everlasting Moonglow)",
        stat: "normalDmgBonus",
        refinementValues: [1, 1.5, 2, 2.5, 3],
        isTeamBuff: false,
        conditionKey: "moonglow-wielder-hp",
        computeCode:
          "(r, ctx) => { const hp = Number(ctx.inputs?.['moonglow-wielder-hp'] ?? 40000); const ratio = [0.01, 0.015, 0.02, 0.025, 0.03][r - 1]; return hp * ratio; }",
      },
    ],
    signatureFor: ["sangonomiya-kokomi"],
  },
  {
    id: "jadefalls-splendor",
    varName: "jadefallsSplendor",
    name: "Jadefall's Splendor",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "hpPct", label: "HP%", value: 49.6, baseValue: 10.8 },
    passiveName: "Primordial Jade Regalia",
    passiveDesc:
      "For 3s after using an Elemental Burst or creating a shield, gain 0.3~1.1% corresponding Elemental DMG Bonus for every 1,000 Max HP (up to 12~44%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "jadefall-wielder-hp",
        label: "Character Total Max HP (e.g. 50000)",
        control: "stacks",
        max: 80000,
        defaultValue: 50000,
        hint: "Max HP used to compute Elemental DMG bonus",
      },
      {
        id: "jadefall-burst-shield-active",
        label: "Burst/Shield Trigger Active (3s)",
        control: "toggle",
        defaultValue: 1,
        hint: "Grants Elemental DMG Bonus based on Max HP",
      },
    ],
    buffs: [
      {
        id: "jadefall-elem-dmg",
        label: "Elemental DMG Bonus from Max HP (Jadefall's Splendor)",
        stat: "dmgBonus",
        refinementValues: [12, 20, 28, 36, 44],
        isTeamBuff: false,
        conditionKey: "jadefall-burst-shield-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['jadefall-burst-shield-active'] ?? '1') === '1' || Number(ctx.inputs?.['jadefall-burst-shield-active'] ?? 1) > 0; if (!on) return 0; const hp = Number(ctx.inputs?.['jadefall-wielder-hp'] ?? 50000); const ratio = [0.3, 0.5, 0.7, 0.9, 1.1][r - 1]; const cap = [12, 20, 28, 36, 44][r - 1]; return Math.min((hp / 1000) * ratio, cap); }",
      },
    ],
    signatureFor: ["baizhu"],
  },
  {
    id: "kaguras-verity",
    varName: "kagurasVerity",
    name: "Kagura's Verity",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 66.2, baseValue: 14.4 },
    passiveName: "Kagura Dance",
    passiveDesc:
      "Gains the Kagura Dance effect when using an Elemental Skill, causing the Elemental Skill DMG of the character wielding this weapon to increase by 12~24% for 16s. Max 3 stacks (+36~72% Skill DMG). At 3 stacks, gain 12~24% All Elemental DMG Bonus.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "kagura-dance-stacks",
        label: "Kagura Dance Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+12~24% Skill DMG per stack. At 3 stacks, +12~24% All Elemental DMG Bonus.",
      },
    ],
    buffs: [
      {
        id: "kagura-skill-dmg",
        label: "Elemental Skill DMG Bonus (Kagura's Verity)",
        stat: "skillDmgBonus",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        conditionKey: "kagura-dance-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['kagura-dance-stacks'] ?? 3); return s * [12, 15, 18, 21, 24][r - 1]; }",
      },
      {
        id: "kagura-all-elem-dmg",
        label: "All Elemental DMG Bonus at 3 Stacks (Kagura's Verity)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "kagura-dance-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['kagura-dance-stacks'] ?? 3); return s >= 3 ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
    signatureFor: ["yae-miko"],
  },
  {
    id: "lost-prayer-to-the-sacred-winds",
    varName: "lostPrayerToTheSacredWinds",
    name: "Lost Prayer to the Sacred Winds",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
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
        max: 4,
        defaultValue: 4,
        hint: "+8~16% All Elemental DMG Bonus per 4s (up to +32~64%)",
      },
    ],
    buffs: [
      {
        id: "lost-prayer-elem-dmg",
        label: "All Elemental DMG Bonus (Lost Prayer)",
        stat: "dmgBonus",
        refinementValues: [32, 40, 48, 56, 64],
        isTeamBuff: false,
        conditionKey: "lost-prayer-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['lost-prayer-stacks'] ?? 4); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
    ],
  },
  {
    id: "memory-of-dust",
    varName: "memoryOfDust",
    name: "Memory of Dust",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Golden Majesty",
    passiveDesc:
      "Increases Shield Strength by 20~40%. Scoring hits on opponents increases ATK by 4~8% for 8s. Max 5 stacks. While protected by a shield, this ATK increase effect is increased by 100% (+40~80% ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "memory-dust-stacks",
        label: "Golden Majesty Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+4~8% ATK per stack",
      },
      {
        id: "memory-dust-shielded",
        label: "Protected by Shield (2x ATK Buff)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles ATK bonus from stacks",
      },
    ],
    buffs: [
      {
        id: "memory-dust-atk",
        label: "ATK% (Memory of Dust Stacks)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "memory-dust-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['memory-dust-stacks'] ?? 5); const shielded = (ctx.inputs?.['memory-dust-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['memory-dust-shielded'] ?? 1) > 0; const mult = shielded ? 2 : 1; return ((s * [4, 5, 6, 7, 8][r - 1] * mult) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "nightweavers-looking-glass",
    varName: "nightweaversLookingGlass",
    name: "Nightweaver's Looking Glass",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Night Looking Glass",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. Normal and Charged Attack DMG is increased by 20~40%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "nightweaver-elem-dmg",
        label: "All Elemental DMG Bonus (Nightweaver's Looking Glass)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "nightweaver-na-dmg",
        label: "Normal Attack DMG Bonus (Nightweaver's Looking Glass)",
        stat: "normalDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "nightweaver-ca-dmg",
        label: "Charged Attack DMG Bonus (Nightweaver's Looking Glass)",
        stat: "chargedDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
    ],
  },
  {
    id: "nocturnes-curtain-call",
    varName: "nocturnesCurtainCall",
    name: "Nocturne's Curtain Call",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Curtain Call",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. Elemental Burst hits increase ATK by 20~40% for 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "nocturne-burst-hit",
        label: "Elemental Burst Hit (+20~40% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "nocturne-elem-dmg",
        label: "All Elemental DMG Bonus (Nocturne's Curtain Call)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "nocturne-atk",
        label: "ATK% (Nocturne's Curtain Call)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "nocturne-burst-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['nocturne-burst-hit'] ?? '1') === '1' || Number(ctx.inputs?.['nocturne-burst-hit'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "reliquary-of-truth",
    varName: "reliquaryOfTruth",
    name: "Reliquary of Truth",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Ancient Truth",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. Elemental Skill and Burst DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "reliquary-elem-dmg",
        label: "All Elemental DMG Bonus (Reliquary of Truth)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "reliquary-skill-dmg",
        label: "Elemental Skill DMG Bonus (Reliquary of Truth)",
        stat: "skillDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "reliquary-burst-dmg",
        label: "Elemental Burst DMG Bonus (Reliquary of Truth)",
        stat: "burstDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "skyward-atlas",
    varName: "skywardAtlas",
    name: "Skyward Atlas",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "atkPct", label: "ATK%", value: 33.1, baseValue: 7.2 },
    passiveName: "Wandering Clouds",
    passiveDesc:
      "Increases All Elemental DMG Bonus by 12~24%. Normal Attack hits have a 50% chance to earn the favor of the clouds, dealing 160~320% ATK DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "skyward-atlas-elem-dmg",
        label: "All Elemental DMG Bonus (Skyward Atlas)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
    ],
  },
  {
    id: "starcallers-watch",
    varName: "starcallersWatch",
    name: "Starcaller's Watch",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "defPct", label: "DEF%", value: 82.7, baseValue: 18.0 },
    passiveName: "Star Caller",
    passiveDesc:
      "After using an Elemental Skill, gain +24~48% DEF for 15s. If triggering an Elemental Reaction, gain +120~240 Elemental Mastery for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "starcaller-skill-active",
        label: "Elemental Skill Used (+24~48% DEF)",
        control: "toggle",
        defaultValue: 1,
        hint: "+24~48% DEF for 15s",
      },
      {
        id: "starcaller-reaction-active",
        label: "Reaction Triggered (+120~240 EM)",
        control: "toggle",
        defaultValue: 1,
        hint: "+120~240 EM for 15s",
      },
    ],
    buffs: [
      {
        id: "starcaller-def",
        label: "DEF% (Starcaller's Watch)",
        stat: "def",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "starcaller-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['starcaller-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['starcaller-skill-active'] ?? 1) > 0; return on ? [24, 30, 36, 42, 48][r - 1] : 0; }",
      },
      {
        id: "starcaller-em",
        label: "Elemental Mastery (Starcaller's Watch)",
        stat: "em",
        refinementValues: [120, 150, 180, 210, 240],
        isTeamBuff: false,
        conditionKey: "starcaller-reaction-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['starcaller-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['starcaller-reaction-active'] ?? 1) > 0; return on ? [120, 150, 180, 210, 240][r - 1] : 0; }",
      },
    ],
    signatureFor: ["citlali"],
  },
  {
    id: "sunny-morning-sleep-in",
    varName: "sunnyMorningSleepIn",
    name: "Sunny Morning Sleep-In",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Sunny Repose",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. Normal and Charged Attack DMG is increased by 20~40%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "sunny-elem-dmg",
        label: "All Elemental DMG Bonus (Sunny Morning Sleep-In)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "sunny-na-dmg",
        label: "Normal Attack DMG Bonus (Sunny Morning Sleep-In)",
        stat: "normalDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "sunny-ca-dmg",
        label: "Charged Attack DMG Bonus (Sunny Morning Sleep-In)",
        stat: "chargedDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
    ],
  },
  {
    id: "surfs-up",
    varName: "surfsUp",
    name: "Surf's Up",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Aqua Serenity",
    passiveDesc:
      "Max HP is increased by 20~40%. Once every 15s for 14s after using an Elemental Skill, gain 4 Scorching Summer stacks: each stack increases Normal Attack DMG by 12~24% (up to +48~96% NA DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "surfs-up-stacks",
        label: "Scorching Summer Stacks (0-4)",
        control: "stacks",
        max: 4,
        defaultValue: 4,
        hint: "+12~24% NA DMG per stack (up to +48~96%)",
      },
    ],
    buffs: [
      {
        id: "surfs-up-hp",
        label: "Max HP% (Surf's Up)",
        stat: "hp",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "surfs-up-na-dmg",
        label: "Normal Attack DMG Bonus (Surf's Up)",
        stat: "normalDmgBonus",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "surfs-up-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['surfs-up-stacks'] ?? 4); return s * [12, 15, 18, 21, 24][r - 1]; }",
      },
    ],
    signatureFor: ["mualani"],
  },
  {
    id: "the-daybreak-chronicles",
    varName: "theDaybreakChronicles",
    name: "The Daybreak Chronicles",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Daybreak Melody",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. CRIT DMG is increased by 20~40%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "daybreak-elem-dmg",
        label: "All Elemental DMG Bonus (The Daybreak Chronicles)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "daybreak-crit-dmg",
        label: "CRIT DMG% (The Daybreak Chronicles)",
        stat: "critDmg",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
    ],
  },
  {
    id: "tome-of-the-eternal-flow",
    varName: "tomeOfTheEternalFlow",
    name: "Tome of the Eternal Flow",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Aeon Wave",
    passiveDesc:
      "HP is increased by 16~32%. When current HP increases or decreases, Charged Attack DMG is increased by 14~30% for 4s. Max 3 stacks (+42~90% CA DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "tome-hp-stacks",
        label: "Aeon Wave Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+14~30% Charged Attack DMG per stack (up to +42~90%)",
      },
    ],
    buffs: [
      {
        id: "tome-hp",
        label: "Max HP% (Tome of the Eternal Flow)",
        stat: "hp",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "tome-ca-dmg",
        label: "Charged Attack DMG Bonus (Tome of the Eternal Flow)",
        stat: "chargedDmgBonus",
        refinementValues: [42, 54, 66, 78, 90],
        isTeamBuff: false,
        conditionKey: "tome-hp-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['tome-hp-stacks'] ?? 3); return s * [14, 18, 22, 26, 30][r - 1]; }",
      },
    ],
    signatureFor: ["neuvillette"],
  },
  {
    id: "tulaytullahs-remembrance",
    varName: "tulaytullahsRemembrance",
    name: "Tulaytullah's Remembrance",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Bygone Azure Teardrop",
    passiveDesc:
      "Normal Attack SPD is increased by 10~20%. After using an Elemental Skill, Normal Attack DMG increases by 4.8~9.6% every 1s for 14s, and by 9.6~19.2% when hitting opponents (max +48~96% NA DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "tulaytullah-na-buff",
        label: "Skill NA DMG Ramp Up (0-48~96%)",
        control: "stacks",
        max: 96,
        defaultValue: 48,
        hint: "Max Normal Attack DMG bonus achieved during skill (+48~96%)",
      },
    ],
    buffs: [
      {
        id: "tulaytullah-na-dmg",
        label: "Normal Attack DMG Bonus (Tulaytullah's Remembrance)",
        stat: "normalDmgBonus",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "tulaytullah-na-buff",
        computeCode: "(r) => [48, 60, 72, 84, 96][r - 1]",
      },
    ],
    signatureFor: ["wanderer"],
  },
  {
    id: "vivid-notions",
    varName: "vividNotions",
    name: "Vivid Notions",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Vivid Dream",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. ATK is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "vivid-elem-dmg",
        label: "All Elemental DMG Bonus (Vivid Notions)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "vivid-atk",
        label: "ATK% (Vivid Notions)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk",
      },
    ],
  },
  {
    id: "a-teaspoon-of-transcendence",
    varName: "aTeaspoonOfTranscendence",
    name: "A Teaspoon of Transcendence",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Transcendence",
    passiveDesc: "All Elemental DMG Bonus is increased by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "teaspoon-elem-dmg",
        label: "All Elemental DMG Bonus (A Teaspoon of Transcendence)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
    ],
  },

  // ==========================================
  // 4-STAR CATALYSTS (24)
  // ==========================================
  {
    id: "hakushin-ring",
    varName: "hakushinRing",
    name: "Hakushin Ring",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
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
      },
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
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['hakushin-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['hakushin-reaction-active'] ?? 1) > 0; return on ? [10, 12.5, 15, 17.5, 20][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "wandering-evenstar",
    varName: "wanderingEvenstar",
    name: "Wandering Evenstar",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Wildling Nightstar",
    passiveDesc:
      "The equipping character will gain 24~48% of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "evenstar-wielder-em",
        label: "Wielder's Elemental Mastery (e.g. 1000)",
        control: "stacks",
        max: 2000,
        defaultValue: 1000,
        hint: "Used to compute flat ATK gained by wielder and party",
      },
    ],
    buffs: [
      {
        id: "evenstar-self-atk",
        label: "Self ATK from EM (Wandering Evenstar)",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const em = Number(ctx.inputs?.['evenstar-wielder-em'] ?? 1000); const ratio = [0.24, 0.30, 0.36, 0.42, 0.48][r - 1]; return em * ratio; }",
      },
      {
        id: "evenstar-party-atk",
        label: "Party ATK from Wielder EM (Wandering Evenstar)",
        description: "Nearby party members gain 30% of the wielder's ATK buff",
        stat: "atk",
        refinementValues: [7.2, 9.0, 10.8, 12.6, 14.4],
        isTeamBuff: true,
        computeCode:
          "(r, ctx) => { const em = Number(ctx.inputs?.['evenstar-wielder-em'] ?? 1000); const ratio = [0.24, 0.30, 0.36, 0.42, 0.48][r - 1]; return em * ratio * 0.3; }",
      },
    ],
  },
  {
    id: "the-widsith",
    varName: "theWidsith",
    name: "The Widsith",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 55.1, baseValue: 12.0 },
    passiveName: "Debut",
    passiveDesc:
      "When taking the field, gain a random theme song for 10s: Recitative (+60~120% ATK), Aria (+48~96% All Elemental DMG), Interlude (+240~480 EM).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "widsith-song",
        label: "Theme Song (1: Recitative, 2: Aria, 3: Interlude)",
        control: "stacks",
        max: 3,
        defaultValue: 2,
        hint: "1: +60~120% ATK, 2: +48~96% All Elem DMG, 3: +240~480 EM",
      },
    ],
    buffs: [
      {
        id: "widsith-atk",
        label: "ATK% (Recitative)",
        stat: "atk",
        refinementValues: [60, 75, 90, 105, 120],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "widsith-song",
        computeCode:
          "(r, ctx) => { const song = Number(ctx.inputs?.['widsith-song'] ?? 2); return song === 1 ? ([60, 75, 90, 105, 120][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "widsith-elem-dmg",
        label: "All Elemental DMG Bonus (Aria)",
        stat: "dmgBonus",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "widsith-song",
        computeCode:
          "(r, ctx) => { const song = Number(ctx.inputs?.['widsith-song'] ?? 2); return song === 2 ? [48, 60, 72, 84, 96][r - 1] : 0; }",
      },
      {
        id: "widsith-em",
        label: "Elemental Mastery (Interlude)",
        stat: "em",
        refinementValues: [240, 300, 360, 420, 480],
        isTeamBuff: false,
        conditionKey: "widsith-song",
        computeCode:
          "(r, ctx) => { const song = Number(ctx.inputs?.['widsith-song'] ?? 2); return song === 3 ? [240, 300, 360, 420, 480][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "favonius-codex",
    varName: "favoniusCodex",
    name: "Favonius Codex",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Windfall",
    passiveDesc:
      "CRIT hits have a 60~100% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
    isSupport: true,
    buffType: "team",
    buffs: [],
  },
  {
    id: "prototype-amber",
    varName: "prototypeAmber",
    name: "Prototype Amber",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Gilding",
    passiveDesc:
      "Using an Elemental Burst regenerates 4~6 Energy every 2s for 6s. All party members will regenerate 4~6% HP every 2s for this duration.",
    isSupport: true,
    buffType: "team",
    buffs: [],
  },
  {
    id: "sacrificial-fragments",
    varName: "sacrificialFragments",
    name: "Sacrificial Fragments",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "em", label: "Elemental Mastery", value: 221, baseValue: 48 },
    passiveName: "Composed",
    passiveDesc:
      "After dealing damage to an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
    isSupport: true,
    buffType: "self",
    buffs: [],
  },
  {
    id: "ash-graven-drinking-horn",
    varName: "ashGravenDrinkingHorn",
    name: "Ash-Graven Drinking Horn",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Tuco's Grace",
    passiveDesc:
      "When hitting an opponent, deals 40~80% Max HP as AoE DMG at the target location. Can occur once every 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "ballad-of-the-boundless-blue",
    varName: "balladOfTheBoundlessBlue",
    name: "Ballad of the Boundless Blue",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Dandelion Skies",
    passiveDesc:
      "Within 6s after Normal or Charged Attacks hit an opponent, Normal Attack DMG is increased by 8~16% and Charged Attack DMG is increased by 6~12%. Max 3 stacks (+24~48% NA, +18~36% CA).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "blue-stacks",
        label: "Dandelion Skies Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+8~16% NA and +6~12% CA DMG per stack (up to +24~48% NA, +18~36% CA)",
      },
    ],
    buffs: [
      {
        id: "blue-na-dmg",
        label: "Normal Attack DMG Bonus (Ballad Boundless Blue)",
        stat: "normalDmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        conditionKey: "blue-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['blue-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
      {
        id: "blue-ca-dmg",
        label: "Charged Attack DMG Bonus (Ballad Boundless Blue)",
        stat: "chargedDmgBonus",
        refinementValues: [18, 22.5, 27, 31.5, 36],
        isTeamBuff: false,
        conditionKey: "blue-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['blue-stacks'] ?? 3); return s * [6, 7.5, 9, 10.5, 12][r - 1]; }",
      },
    ],
  },
  {
    id: "blackcliff-agate",
    varName: "blackcliffAgate",
    name: "Blackcliff Agate",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 55.1, baseValue: 12.0 },
    passiveName: "Press the Advantage",
    passiveDesc:
      "After defeating an opponent, ATK is increased by 12~24% for 30s. Max 3 stacks (+36~72% ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "agate-defeat-stacks",
        label: "Opponents Defeated Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+12~24% ATK per stack (up to +36~72%)",
      },
    ],
    buffs: [
      {
        id: "agate-atk",
        label: "ATK% (Blackcliff Agate Stacks)",
        stat: "atk",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "agate-defeat-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['agate-defeat-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "dodoco-tales",
    varName: "dodocoTales",
    name: "Dodoco Tales",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Dodoventure!",
    passiveDesc:
      "Normal Attack hits increase Charged Attack DMG by 16~32% for 6s. Charged Attack hits increase ATK by 8~16% for 6s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "dodoco-na-hit",
        label: "Normal Attack Hit (+16~32% Charged Attack DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% Charged Attack DMG for 6s",
      },
      {
        id: "dodoco-ca-hit",
        label: "Charged Attack Hit (+8~16% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+8~16% ATK for 6s",
      },
    ],
    buffs: [
      {
        id: "dodoco-ca-dmg",
        label: "Charged Attack DMG Bonus (Dodoco Tales)",
        stat: "chargedDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "dodoco-na-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['dodoco-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['dodoco-na-hit'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
      {
        id: "dodoco-atk",
        label: "ATK% from Charged Hit (Dodoco Tales)",
        stat: "atk",
        refinementValues: [8, 10, 12, 14, 16],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "dodoco-ca-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['dodoco-ca-hit'] ?? '1') === '1' || Number(ctx.inputs?.['dodoco-ca-hit'] ?? 1) > 0; return on ? ([8, 10, 12, 14, 16][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
    signatureFor: ["klee"],
  },
  {
    id: "eye-of-perception",
    varName: "eyeOfPerception",
    name: "Eye of Perception",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Echo",
    passiveDesc:
      "Normal and Charged Attacks have a 50% chance to fire a Bolt of Perception, dealing 240~360% ATK as DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "flowing-purity",
    varName: "flowingPurity",
    name: "Flowing Purity",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Unfinished Masterpiece",
    passiveDesc:
      "Using an Elemental Skill increases All Elemental DMG Bonus by 8~16% for 15s and grants a Bond of Life equal to 24% of Max HP. When BoL is cleared, grants +2~4% All Elemental DMG Bonus per 1,000 HP cleared (up to +12~24%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "flowing-purity-skill",
        label: "Elemental Skill Used (+8~16% Elem DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+8~16% All Elemental DMG Bonus for 15s",
      },
      {
        id: "flowing-purity-bol-cleared",
        label: "Bond of Life Cleared Max Stack (+12~24% Elem DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% All Elemental DMG Bonus when BoL is cleared",
      },
    ],
    buffs: [
      {
        id: "flowing-purity-skill-dmg",
        label: "All Elemental DMG Bonus (Flowing Purity Skill)",
        stat: "dmgBonus",
        refinementValues: [8, 10, 12, 14, 16],
        isTeamBuff: false,
        conditionKey: "flowing-purity-skill",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['flowing-purity-skill'] ?? '1') === '1' || Number(ctx.inputs?.['flowing-purity-skill'] ?? 1) > 0; return on ? [8, 10, 12, 14, 16][r - 1] : 0; }",
      },
      {
        id: "flowing-purity-bol-dmg",
        label: "All Elemental DMG Bonus (Flowing Purity BoL Cleared)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "flowing-purity-bol-cleared",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['flowing-purity-bol-cleared'] ?? '1') === '1' || Number(ctx.inputs?.['flowing-purity-bol-cleared'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "frostbearer",
    varName: "frostbearer",
    name: "Frostbearer",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Frost Burial",
    passiveDesc:
      "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of dropping an Everfrost Icicle above them, dealing 80~140% AoE ATK DMG (200~360% on Cryo affected).",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "fruit-of-fulfillment",
    varName: "fruitOfFulfillment",
    name: "Fruit of Fulfillment",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Full Circle",
    passiveDesc:
      "Triggering Elemental Reactions grants Wax and Wane stack (+24~36 EM, -5% ATK). Max 5 stacks (+120~180 EM, -25% ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "fulfillment-stacks",
        label: "Wax and Wane Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+24~36 EM and -5% ATK per stack (up to +120~180 EM, -25% ATK)",
      },
    ],
    buffs: [
      {
        id: "fulfillment-em",
        label: "Elemental Mastery (Fruit of Fulfillment)",
        stat: "em",
        refinementValues: [120, 135, 150, 165, 180],
        isTeamBuff: false,
        conditionKey: "fulfillment-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['fulfillment-stacks'] ?? 5); return s * [24, 27, 30, 33, 36][r - 1]; }",
      },
      {
        id: "fulfillment-atk-penalty",
        label: "ATK% Reduction (Fruit of Fulfillment)",
        stat: "atk",
        refinementValues: [-25, -25, -25, -25, -25],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "fulfillment-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['fulfillment-stacks'] ?? 5); return ((-s * 5) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "jade-vista",
    varName: "jadeVista",
    name: "Jade Vista",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Jade Light",
    passiveDesc: "Normal Attack DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "jade-vista-na",
        label: "Normal Attack DMG Bonus (Jade Vista)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "mappa-mare",
    varName: "mappaMare",
    name: "Mappa Mare",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Infusion Scroll",
    passiveDesc:
      "Triggering an Elemental Reaction grants an 8~16% Elemental DMG Bonus for 10s. Max 2 stacks (+16~32% Elemental DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "mappa-stacks",
        label: "Infusion Scroll Stacks (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+8~16% All Elemental DMG Bonus per stack (up to +16~32%)",
      },
    ],
    buffs: [
      {
        id: "mappa-elem-dmg",
        label: "All Elemental DMG Bonus (Mappa Mare)",
        stat: "dmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "mappa-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['mappa-stacks'] ?? 2); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
    ],
  },
  {
    id: "oathsworn-eye",
    varName: "oathswornEye",
    name: "Oathsworn Eye",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "People of the Faltering Light",
    passiveDesc:
      "Increases Energy Recharge by 24~48% for 10s after using an Elemental Skill.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "oathsworn-skill-active",
        label: "Elemental Skill Used (+24~48% Energy Recharge)",
        control: "toggle",
        defaultValue: 1,
        hint: "+24~48% ER for 10s",
      },
    ],
    buffs: [
      {
        id: "oathsworn-er",
        label: "Energy Recharge% (Oathsworn Eye)",
        stat: "energyRecharge",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        conditionKey: "oathsworn-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['oathsworn-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['oathsworn-skill-active'] ?? 1) > 0; return on ? [24, 30, 36, 42, 48][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "ring-of-yaxche",
    varName: "ringOfYaxche",
    name: "Ring of Yaxche",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Echoing Song",
    passiveDesc:
      "Using an Elemental Skill grants Jade-Forged Crown: every 1,000 Max HP increases Normal Attack DMG by 0.6~1.0% for 10s (up to max +16~32% NA DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "yaxche-wielder-hp",
        label: "Character Total Max HP (e.g. 35000)",
        control: "stacks",
        max: 80000,
        defaultValue: 35000,
        hint: "Max HP used for Normal Attack DMG bonus",
      },
      {
        id: "yaxche-skill-active",
        label: "Elemental Skill Used Active",
        control: "toggle",
        defaultValue: 1,
        hint: "Grants NA DMG bonus based on Max HP",
      },
    ],
    buffs: [
      {
        id: "yaxche-na-dmg",
        label: "Normal Attack DMG Bonus (Ring of Yaxche)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "yaxche-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['yaxche-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['yaxche-skill-active'] ?? 1) > 0; if (!on) return 0; const hp = Number(ctx.inputs?.['yaxche-wielder-hp'] ?? 35000); const ratio = [0.6, 0.7, 0.8, 0.9, 1.0][r - 1]; const cap = [16, 20, 24, 28, 32][r - 1]; return Math.min((hp / 1000) * ratio, cap); }",
      },
    ],
  },
  {
    id: "royal-grimoire",
    varName: "royalGrimoire",
    name: "Royal Grimoire",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Focus",
    passiveDesc:
      "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks (+40~80%). A CRIT hit removes all stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "royal-grimoire-stacks",
        label: "Focus Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+8~16% CRIT Rate per stack (up to +40~80%)",
      },
    ],
    buffs: [
      {
        id: "royal-grimoire-crit",
        label: "CRIT Rate% (Royal Grimoire Focus)",
        stat: "critRate",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "royal-grimoire-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['royal-grimoire-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
    ],
  },
  {
    id: "sacrificial-jade",
    varName: "sacrificialJade",
    name: "Sacrificial Jade",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 36.8, baseValue: 8.0 },
    passiveName: "Jade Precept",
    passiveDesc:
      "When not on the field for more than 5s, Max HP is increased by 32~64% and Elemental Mastery is increased by 40~80 for 10s after taking the field.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "sacrificial-jade-active",
        label: "Jade Precept Active (+32~64% HP, +40~80 EM)",
        control: "toggle",
        defaultValue: 1,
        hint: "+32~64% Max HP and +40~80 EM for 10s after taking field",
      },
    ],
    buffs: [
      {
        id: "sacrificial-jade-hp",
        label: "Max HP% (Sacrificial Jade)",
        stat: "hp",
        refinementValues: [32, 40, 48, 56, 64],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "sacrificial-jade-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['sacrificial-jade-active'] ?? '1') === '1' || Number(ctx.inputs?.['sacrificial-jade-active'] ?? 1) > 0; return on ? [32, 40, 48, 56, 64][r - 1] : 0; }",
      },
      {
        id: "sacrificial-jade-em",
        label: "Elemental Mastery (Sacrificial Jade)",
        stat: "em",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "sacrificial-jade-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['sacrificial-jade-active'] ?? '1') === '1' || Number(ctx.inputs?.['sacrificial-jade-active'] ?? 1) > 0; return on ? [40, 50, 60, 70, 80][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "solar-pearl",
    varName: "solarPearl",
    name: "Solar Pearl",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Solar Shine",
    passiveDesc:
      "Normal Attack hits increase Elemental Skill and Elemental Burst DMG by 20~40% for 6s. Elemental Skill or Burst hits increase Normal Attack DMG by 20~40% for 6s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "solar-na-hit",
        label: "Normal Attack Hit (+20~40% Skill/Burst DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% Skill and Burst DMG for 6s",
      },
      {
        id: "solar-skill-burst-hit",
        label: "Skill/Burst Hit (+20~40% Normal Attack DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% Normal Attack DMG for 6s",
      },
    ],
    buffs: [
      {
        id: "solar-skill-dmg",
        label: "Elemental Skill DMG Bonus (Solar Pearl)",
        stat: "skillDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "solar-na-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['solar-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['solar-na-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
      {
        id: "solar-burst-dmg",
        label: "Elemental Burst DMG Bonus (Solar Pearl)",
        stat: "burstDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "solar-na-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['solar-na-hit'] ?? '1') === '1' || Number(ctx.inputs?.['solar-na-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
      {
        id: "solar-na-dmg",
        label: "Normal Attack DMG Bonus (Solar Pearl)",
        stat: "normalDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "solar-skill-burst-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['solar-skill-burst-hit'] ?? '1') === '1' || Number(ctx.inputs?.['solar-skill-burst-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "waveriding-whirl",
    varName: "waveridingWhirl",
    name: "Waveriding Whirl",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 61.3, baseValue: 13.3 },
    passiveName: "Wave Rider",
    passiveDesc:
      "Decreases swimming Stamina consumption by 15%. After using an Elemental Skill, Max HP is increased by 20~40% for 15s (2x during Nightsoul's Blessing = +40~80% Max HP).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "waveriding-skill-active",
        label: "Elemental Skill Used Active (+20~40% Max HP)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% Max HP for 15s",
      },
      {
        id: "waveriding-nightsoul",
        label: "In Nightsoul's Blessing (2x HP Buff)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles Max HP bonus (up to +40~80%)",
      },
    ],
    buffs: [
      {
        id: "waveriding-hp",
        label: "Max HP% (Waveriding Whirl)",
        stat: "hp",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "waveriding-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['waveriding-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['waveriding-skill-active'] ?? 1) > 0; if (!on) return 0; const nightsoul = (ctx.inputs?.['waveriding-nightsoul'] ?? '1') === '1' || Number(ctx.inputs?.['waveriding-nightsoul'] ?? 1) > 0; const mult = nightsoul ? 2 : 1; return [20, 25, 30, 35, 40][r - 1] * mult; }",
      },
    ],
  },
  {
    id: "wine-and-song",
    varName: "wineAndSong",
    name: "Wine and Song",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Ever-Changing",
    passiveDesc:
      "Hitting an opponent with a Normal Attack decreases Sprinting Stamina consumption by 14~22% for 5s. Sprinting increases ATK by 20~40% for 5s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "wine-sprint-active",
        label: "Sprinted Active (+20~40% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% ATK for 5s",
      },
    ],
    buffs: [
      {
        id: "wine-atk",
        label: "ATK% (Wine and Song)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "wine-sprint-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['wine-sprint-active'] ?? '1') === '1' || Number(ctx.inputs?.['wine-sprint-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },

  // ==========================================
  // 3-STAR CATALYSTS (4)
  // ==========================================
  {
    id: "thrilling-tales-of-dragon-slayers",
    varName: "thrillingTalesOfDragonSlayers",
    name: "Thrilling Tales of Dragon Slayers",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "hpPct", label: "HP%", value: 35.2, baseValue: 7.7 },
    passiveName: "Heritage",
    passiveDesc:
      "When switching characters, the new character taking the field has their ATK increased by 24~48% for 10s. This effect can only occur once every 20s.",
    isSupport: true,
    buffType: "team",
    mechanicDefs: [
      {
        id: "ttds-buff-active",
        label: "Switched to Character Active (+24~48% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "Team buff: +24~48% ATK for 10s upon switching",
      },
    ],
    buffs: [
      {
        id: "ttds-party-atk",
        label: "Party ATK% (Thrilling Tales of Dragon Slayers)",
        description: "New active character taking the field gains +24~48% ATK for 10s",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "ttds-buff-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['ttds-buff-active'] ?? '1') === '1' || Number(ctx.inputs?.['ttds-buff-active'] ?? 1) > 0; return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "magic-guide",
    varName: "magicGuide",
    name: "Magic Guide",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "em", label: "Elemental Mastery", value: 187, baseValue: 41 },
    passiveName: "Bane of Storm and Tide",
    passiveDesc: "Increases DMG against opponents affected by Hydro or Electro by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "magic-guide-target-affected",
        label: "Target Affected by Hydro or Electro (+12~24% DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% All DMG bonus against affected enemies",
      },
    ],
    buffs: [
      {
        id: "magic-guide-dmg",
        label: "All DMG Bonus vs Hydro/Electro (Magic Guide)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "magic-guide-target-affected",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['magic-guide-target-affected'] ?? '1') === '1' || Number(ctx.inputs?.['magic-guide-target-affected'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "emerald-orb",
    varName: "emeraldOrb",
    name: "Emerald Orb",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "em", label: "Elemental Mastery", value: 94, baseValue: 20 },
    passiveName: "Rapids",
    passiveDesc:
      "Upon triggering a Vaporize, Electro-Charged, Frozen, Bloom, or a Hydro-infused Swirl reaction, ATK is increased by 20~40% for 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "emerald-reaction-active",
        label: "Hydro Reaction Triggered (+20~40% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "emerald-atk",
        label: "ATK% (Emerald Orb)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "emerald-reaction-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['emerald-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['emerald-reaction-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "twin-nephrite",
    varName: "twinNephrite",
    name: "Twin Nephrite",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 15.6, baseValue: 3.4 },
    passiveName: "Guerilla Tactics",
    passiveDesc: "Defeating an opponent increases Movement SPD and ATK by 12~20% for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "nephrite-defeat-active",
        label: "Opponent Defeated (+12~20% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~20% ATK for 15s",
      },
    ],
    buffs: [
      {
        id: "nephrite-atk",
        label: "ATK% (Twin Nephrite)",
        stat: "atk",
        refinementValues: [12, 14, 16, 18, 20],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "nephrite-defeat-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['nephrite-defeat-active'] ?? '1') === '1' || Number(ctx.inputs?.['nephrite-defeat-active'] ?? 1) > 0; return on ? ([12, 14, 16, 18, 20][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "otherworldly-story",
    varName: "otherworldlyStory",
    name: "Otherworldly Story",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 39.0, baseValue: 8.5 },
    passiveName: "Energy Shower",
    passiveDesc: "Each Elemental Orb or Particle collected restores 1~2% HP.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },

  // ==========================================
  // 2-STAR & 1-STAR CATALYSTS (2)
  // ==========================================
  {
    id: "pocket-grimoire",
    varName: "pocketGrimoire",
    name: "Pocket Grimoire",
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
    id: "apprentices-notes",
    varName: "apprenticesNotes",
    name: "Apprentice's Notes",
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
function generateWeaponFile(w: CatalystDefinition): string {
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
  type: "Catalyst",
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

// Generate all catalyst files
const catalystsDir = path.resolve("src/data/registry/weapons/catalysts");

for (const w of COMPLETE_CATALYSTS) {
  const filePath = path.join(catalystsDir, `${w.id}.ts`);
  const content = generateWeaponFile(w);
  fs.writeFileSync(filePath, content, "utf-8");
}

// Update catalysts/index.ts
const imports = COMPLETE_CATALYSTS.map((w) => `import { ${w.varName} } from "./${w.id}";`).join("\n");
const names = COMPLETE_CATALYSTS.map((w) => w.varName).join(",\n  ");

const indexContent = `${imports}
import type { WeaponConfig } from "../types";

export {
  ${names},
};

export const CATALYSTS: WeaponConfig[] = [
  ${names},
];
`;

fs.writeFileSync(path.join(catalystsDir, "index.ts"), indexContent, "utf-8");

console.log(`Successfully generated ${COMPLETE_CATALYSTS.length} catalyst files and updated catalysts/index.ts.`);
