import fs from "fs";
import path from "path";

export interface ClaymoreDefinition {
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

export const COMPLETE_CLAYMORES: ClaymoreDefinition[] = [
  // ==========================================
  // 5-STAR CLAYMORES (13)
  // ==========================================
  {
    id: "a-thousand-blazing-suns",
    varName: "aThousandBlazingSuns",
    name: "A Thousand Blazing Suns",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Scorching Reverence",
    passiveDesc:
      "Increases CRIT DMG by 20~40%. When in Nightsoul's Blessing or triggering a Nightsoul Burst, increases ATK by 28~56% for 6s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "blazing-suns-active",
        label: "Nightsoul Burst Triggered Active",
        control: "toggle",
        defaultValue: 1,
        hint: "+28~56% ATK for 6s",
      },
    ],
    buffs: [
      {
        id: "blazing-suns-crit-dmg",
        label: "CRIT DMG% (A Thousand Blazing Suns)",
        stat: "critDmg",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "blazing-suns-atk",
        label: "ATK% (A Thousand Blazing Suns)",
        stat: "atk",
        refinementValues: [28, 35, 42, 49, 56],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "blazing-suns-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['blazing-suns-active'] ?? '1') === '1' || Number(ctx.inputs?.['blazing-suns-active'] ?? 1) > 0; return on ? ([28, 35, 42, 49, 56][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
    signatureFor: ["mavuika"],
  },
  {
    id: "beacon-of-the-reed-sea",
    varName: "beaconOfTheReedSea",
    name: "Beacon of the Reed Sea",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Desert Watch",
    passiveDesc:
      "After an Elemental Skill hits an opponent, ATK is increased by 20~40% for 8s. After taking DMG, ATK is increased by 20~40% for 8s. When not protected by a shield, Max HP is increased by 32~64%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "beacon-skill-hit",
        label: "Skill Hit Opponent (+20~40% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% ATK for 8s",
      },
      {
        id: "beacon-took-dmg",
        label: "Took DMG (+20~40% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% ATK for 8s",
      },
      {
        id: "beacon-unshielded",
        label: "Unshielded (+32~64% Max HP)",
        control: "toggle",
        defaultValue: 1,
        hint: "+32~64% Max HP when not protected by shield",
      },
    ],
    buffs: [
      {
        id: "beacon-skill-atk",
        label: "ATK% from Skill Hit (Beacon)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "beacon-skill-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['beacon-skill-hit'] ?? '1') === '1' || Number(ctx.inputs?.['beacon-skill-hit'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "beacon-dmg-atk",
        label: "ATK% from Taking DMG (Beacon)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "beacon-took-dmg",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['beacon-took-dmg'] ?? '1') === '1' || Number(ctx.inputs?.['beacon-took-dmg'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "beacon-hp",
        label: "Max HP% (Beacon Unshielded)",
        stat: "hp",
        refinementValues: [32, 40, 48, 56, 64],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "beacon-unshielded",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['beacon-unshielded'] ?? '1') === '1' || Number(ctx.inputs?.['beacon-unshielded'] ?? 1) > 0; return on ? [32, 40, 48, 56, 64][r - 1] : 0; }",
      },
    ],
    signatureFor: ["dehya"],
  },
  {
    id: "bloodsoaked-ruins",
    varName: "bloodsoakedRuins",
    name: "Bloodsoaked Ruins",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Ancient Ruin",
    passiveDesc:
      "ATK is increased by 20~40%. When defeating an opponent, All Elemental DMG Bonus is increased by 20~40% for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "bloodsoaked-defeat-active",
        label: "Opponent Defeated (+20~40% Elem DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% All Elemental DMG for 15s",
      },
    ],
    buffs: [
      {
        id: "bloodsoaked-atk",
        label: "ATK% (Bloodsoaked Ruins)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk",
      },
      {
        id: "bloodsoaked-elem-dmg",
        label: "All Elemental DMG Bonus (Bloodsoaked Ruins)",
        stat: "dmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "bloodsoaked-defeat-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['bloodsoaked-defeat-active'] ?? '1') === '1' || Number(ctx.inputs?.['bloodsoaked-defeat-active'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "fang-of-the-mountain-king",
    varName: "fangOfTheMountainKing",
    name: "Fang of the Mountain King",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Turquoise Dawn",
    passiveDesc:
      "Gain 1 stack of Canopy's Favor when an Elemental Skill hits an opponent. Max 6 stacks. At 6 stacks, Elemental Skill and Elemental Burst DMG is increased by 48~96%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "mountain-king-stacks",
        label: "Canopy's Favor Stacks (0-6)",
        control: "stacks",
        max: 6,
        defaultValue: 6,
        hint: "+8~16% Skill & Burst DMG per stack (up to +48~96%)",
      },
    ],
    buffs: [
      {
        id: "mountain-king-skill-dmg",
        label: "Elemental Skill DMG Bonus (Fang of Mountain King)",
        stat: "skillDmgBonus",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "mountain-king-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['mountain-king-stacks'] ?? 6); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
      {
        id: "mountain-king-burst-dmg",
        label: "Elemental Burst DMG Bonus (Fang of Mountain King)",
        stat: "burstDmgBonus",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "mountain-king-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['mountain-king-stacks'] ?? 6); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
    ],
    signatureFor: ["kinich"],
  },
  {
    id: "gest-of-the-mighty-wolf",
    varName: "gestOfTheMightyWolf",
    name: "Gest of the Mighty Wolf",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Wolf's Song",
    passiveDesc:
      "Increases All Elemental DMG Bonus by 12~24%. Normal and Charged Attack hits increase ATK by 16~32% for 8s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "mighty-wolf-atk-active",
        label: "NA/CA Hit (+16~32% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% ATK for 8s",
      },
    ],
    buffs: [
      {
        id: "mighty-wolf-elem-dmg",
        label: "All Elemental DMG Bonus (Gest of Mighty Wolf)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "mighty-wolf-atk",
        label: "ATK% (Gest of Mighty Wolf)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "mighty-wolf-atk-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['mighty-wolf-atk-active'] ?? '1') === '1' || Number(ctx.inputs?.['mighty-wolf-atk-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "redhorn-stonethresher",
    varName: "redhornStonethresher",
    name: "Redhorn Stonethresher",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Gokadaiou Otogibanashi",
    passiveDesc:
      "DEF is increased by 28~56%. Normal and Charged Attack DMG is increased by 40~80% of DEF.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "redhorn-wielder-def",
        label: "Character Total DEF",
        control: "stacks",
        max: 6000,
        defaultValue: 2500,
        hint: "Total DEF used for flat NA/CA DMG bonus",
      },
    ],
    buffs: [
      {
        id: "redhorn-def",
        label: "DEF% (Redhorn Stonethresher)",
        stat: "def",
        refinementValues: [28, 35, 42, 49, 56],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r) => [28, 35, 42, 49, 56][r - 1]",
      },
      {
        id: "redhorn-na-dmg",
        label: "Flat Normal Attack DMG from DEF (Redhorn)",
        stat: "normalDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const def = Number(ctx.inputs?.['redhorn-wielder-def'] ?? 2500); const ratio = [0.4, 0.5, 0.6, 0.7, 0.8][r - 1]; return def * ratio; }",
      },
      {
        id: "redhorn-ca-dmg",
        label: "Flat Charged Attack DMG from DEF (Redhorn)",
        stat: "chargedDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const def = Number(ctx.inputs?.['redhorn-wielder-def'] ?? 2500); const ratio = [0.4, 0.5, 0.6, 0.7, 0.8][r - 1]; return def * ratio; }",
      },
    ],
    signatureFor: ["arataki-itto"],
  },
  {
    id: "skyward-pride",
    varName: "skywardPride",
    name: "Skyward Pride",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 36.8, baseValue: 8.0 },
    passiveName: "Sky-ripping Dragon Spine",
    passiveDesc:
      "Increases all DMG by 8~16%. After using an Elemental Burst, Normal or Charged Attacks create a vacuum blade that deals 80~160% of ATK as DMG to opponents along its path for 20s or 8 blades.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "skyward-pride-dmg",
        label: "All DMG Bonus (Skyward Pride)",
        stat: "dmgBonus",
        refinementValues: [8, 10, 12, 14, 16],
        isTeamBuff: false,
        computeCode: "(r) => [8, 10, 12, 14, 16][r - 1]",
      },
    ],
  },
  {
    id: "song-of-broken-pines",
    varName: "songOfBrokenPines",
    name: "Song of Broken Pines",
    rarity: 5,
    baseAtk: 741,
    lvl1BaseAtk: 49,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 20.7, baseValue: 4.5 },
    passiveName: "Rebel's Banner-Hymn",
    passiveDesc:
      "Increases ATK by 16~32%. Normal/Charged Attacks grant Sigils of Whispers (max 4). At 4 Sigils, all party members gain Millennial Movement: Banner-Hymn (+12~24% Normal ATK SPD, +16~32% NA/CA/Plunge DMG, and +20~40% ATK for 12s).",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "pines-banner-active",
        label: "Millennial Movement: Banner-Hymn Active (4 Sigils)",
        control: "toggle",
        defaultValue: 1,
        hint: "Team buff: +16~32% NA/CA/Plunge DMG, +20~40% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "pines-party-na-ca-plunge",
        label: "Party NA/CA/Plunge DMG Bonus (Song of Broken Pines)",
        description: "Nearby party members gain +16~32% Normal, Charged, and Plunging Attack DMG",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        conditionKey: "pines-banner-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['pines-banner-active'] ?? '1') === '1' || Number(ctx.inputs?.['pines-banner-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
      {
        id: "pines-party-atk",
        label: "Party ATK% (Song of Broken Pines)",
        description: "Nearby party members gain +20~40% ATK",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "pines-banner-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['pines-banner-active'] ?? '1') === '1' || Number(ctx.inputs?.['pines-banner-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "pines-self-atk",
        label: "Self ATK% (Song of Broken Pines Base)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk",
      },
    ],
    signatureFor: ["eula"],
  },
  {
    id: "the-unforged",
    varName: "theUnforged",
    name: "The Unforged",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Golden Majesty",
    passiveDesc:
      "Increases Shield Strength by 20~40%. Scoring hits on opponents increases ATK by 4~8% for 8s. Max 5 stacks. While protected by a shield, this ATK increase effect is increased by 100%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "unforged-stacks",
        label: "Golden Majesty Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+4~8% ATK per stack",
      },
      {
        id: "unforged-shielded",
        label: "Protected by Shield (2x ATK Buff)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles ATK bonus from stacks",
      },
    ],
    buffs: [
      {
        id: "unforged-atk",
        label: "ATK% (The Unforged Stacks)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "unforged-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['unforged-stacks'] ?? 5); const shielded = (ctx.inputs?.['unforged-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['unforged-shielded'] ?? 1) > 0; const mult = shielded ? 2 : 1; return ((s * [4, 5, 6, 7, 8][r - 1] * mult) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "verdict",
    varName: "verdict",
    name: "Verdict",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 22.1, baseValue: 4.8 },
    passiveName: "Many Oaths of Dawn and Dusk",
    passiveDesc:
      "Increases ATK by 20~40%. When party members obtain Elemental Shards from Crystallize reactions, gain 1 Seal (max 2): increases Elemental Skill DMG by 18~36% per Seal.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "verdict-seals",
        label: "Crystallize Seals (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+18~36% Skill DMG per Seal (up to +36~72%)",
      },
    ],
    buffs: [
      {
        id: "verdict-atk",
        label: "ATK% (Verdict)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk",
      },
      {
        id: "verdict-skill-dmg",
        label: "Elemental Skill DMG Bonus (Verdict Seals)",
        stat: "skillDmgBonus",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        conditionKey: "verdict-seals",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['verdict-seals'] ?? 2); return s * [18, 22.5, 27, 31.5, 36][r - 1]; }",
      },
    ],
    signatureFor: ["navia"],
  },
  {
    id: "wolfs-gravestone",
    varName: "wolfsGravestone",
    name: "Wolf's Gravestone",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Wolfish Tracker",
    passiveDesc:
      "Increases ATK by 20~40%. On hit, attacks against opponents with less than 30% HP increase all party members' ATK by 40~80% for 12s. Can only occur once every 30s.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "wgs-party-buff-active",
        label: "Target HP < 30% (+40~80% Party ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "Team buff: +40~80% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "wgs-party-atk",
        label: "Party ATK% (Wolf's Gravestone)",
        description: "Attacks against enemies with <30% HP grant +40~80% ATK to all party members",
        stat: "atk",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "wgs-party-buff-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['wgs-party-buff-active'] ?? '1') === '1' || Number(ctx.inputs?.['wgs-party-buff-active'] ?? 1) > 0; return on ? ([40, 50, 60, 70, 80][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "wgs-self-atk",
        label: "Self ATK% (Wolf's Gravestone Base)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk",
      },
    ],
  },

  // ==========================================
  // 4-STAR CLAYMORES (28)
  // ==========================================
  {
    id: "akuoumaru",
    varName: "akuoumaru",
    name: "Akuoumaru",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Watatsumi Wavewalker",
    passiveDesc:
      "For every point of the entire party's combined maximum Energy capacity, Elemental Burst DMG is increased by 0.12~0.24% (up to 40~80%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "akuoumaru-party-energy",
        label: "Party Total Energy Capacity (e.g. 300)",
        control: "stacks",
        max: 400,
        defaultValue: 300,
        hint: "+0.12~0.24% Burst DMG per total party energy capacity point",
      },
    ],
    buffs: [
      {
        id: "akuoumaru-burst-dmg",
        label: "Elemental Burst DMG Bonus (Akuoumaru)",
        stat: "burstDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "akuoumaru-party-energy",
        computeCode:
          "(r, ctx) => { const energy = Number(ctx.inputs?.['akuoumaru-party-energy'] ?? 300); const ratio = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; const cap = [40, 50, 60, 70, 80][r - 1]; return Math.min(energy * ratio * 100, cap); }",
      },
    ],
  },
  {
    id: "blackcliff-slasher",
    varName: "blackcliffSlasher",
    name: "Blackcliff Slasher",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 55.1, baseValue: 12.0 },
    passiveName: "Press the Advantage",
    passiveDesc:
      "After defeating an opponent, ATK is increased by 12~24% for 30s. Max 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "slasher-defeat-stacks",
        label: "Opponents Defeated Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+12~24% ATK per stack (up to +36~72%)",
      },
    ],
    buffs: [
      {
        id: "slasher-atk",
        label: "ATK% (Blackcliff Slasher Stacks)",
        stat: "atk",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "slasher-defeat-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['slasher-defeat-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "blade-of-atonement",
    varName: "bladeOfAtonement",
    name: "Blade of Atonement",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Atonement",
    passiveDesc: "Normal Attack DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "atonement-na-dmg",
        label: "Normal Attack DMG Bonus (Blade of Atonement)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "covenant-of-frost-and-snow",
    varName: "covenantOfFrostAndSnow",
    name: "Covenant of Frost and Snow",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 34.5, baseValue: 7.5 },
    passiveName: "Frost Covenant",
    passiveDesc: "Physical DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "covenant-phys-dmg",
        label: "Physical DMG Bonus (Covenant of Frost & Snow)",
        stat: "physicalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "earth-shaker",
    varName: "earthShaker",
    name: "Earth Shaker",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
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
      },
    ],
    buffs: [
      {
        id: "earth-shaker-skill-dmg",
        label: "Elemental Skill DMG Bonus (Earth Shaker)",
        stat: "skillDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "earth-shaker-reaction-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['earth-shaker-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['earth-shaker-reaction-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "emberwell",
    varName: "emberwell",
    name: "Emberwell",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Ember Surge",
    passiveDesc: "Increases Pyro DMG Bonus by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "emberwell-pyro-dmg",
        label: "Pyro DMG Bonus (Emberwell)",
        stat: "pyroDmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
    ],
  },
  {
    id: "favonius-greatsword",
    varName: "favoniusGreatsword",
    name: "Favonius Greatsword",
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
    id: "forest-regalia",
    varName: "forestRegalia",
    name: "Forest Regalia",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Forest Sanctuary",
    passiveDesc:
      "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness is created. Picking it up increases Elemental Mastery by 60~120 for 12s.",
    isSupport: true,
    buffType: "team",
    mechanicDefs: [
      {
        id: "regalia-leaf-picked",
        label: "Leaf of Consciousness Picked Up",
        control: "toggle",
        defaultValue: 1,
        hint: "+60~120 EM for 12s to picking party member",
      },
    ],
    buffs: [
      {
        id: "regalia-party-em",
        label: "Party EM (Forest Regalia Leaf of Consciousness)",
        description: "Picking up the Leaf of Consciousness grants +60~120 Elemental Mastery for 12s",
        stat: "em",
        refinementValues: [60, 75, 90, 105, 120],
        isTeamBuff: true,
        conditionKey: "regalia-leaf-picked",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['regalia-leaf-picked'] ?? '1') === '1' || Number(ctx.inputs?.['regalia-leaf-picked'] ?? 1) > 0; return on ? [60, 75, 90, 105, 120][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "fruitful-hook",
    varName: "fruitfulHook",
    name: "Fruitful Hook",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "The Weight of the Falling Branch",
    passiveDesc:
      "Increases Plunging Attack CRIT Rate by 16~32%. After hitting an opponent with a Plunging Attack, Normal, Charged, and Plunging Attack DMG is increased by 16~32% for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "fruitful-hook-plunge-hit",
        label: "Plunging Attack Hit Active (+16~32% NA/CA/Plunge DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% Normal, Charged, and Plunging Attack DMG for 10s",
      },
    ],
    buffs: [
      {
        id: "fruitful-hook-plunge-crit",
        label: "Plunging Attack CRIT Rate% (Fruitful Hook)",
        stat: "critRate",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "fruitful-hook-plunge-dmg",
        label: "Plunging Attack DMG Bonus (Fruitful Hook)",
        stat: "plungeDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "fruitful-hook-plunge-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['fruitful-hook-plunge-hit'] ?? '1') === '1' || Number(ctx.inputs?.['fruitful-hook-plunge-hit'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
      {
        id: "fruitful-hook-na-dmg",
        label: "Normal Attack DMG Bonus (Fruitful Hook)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "fruitful-hook-plunge-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['fruitful-hook-plunge-hit'] ?? '1') === '1' || Number(ctx.inputs?.['fruitful-hook-plunge-hit'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
      {
        id: "fruitful-hook-ca-dmg",
        label: "Charged Attack DMG Bonus (Fruitful Hook)",
        stat: "chargedDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "fruitful-hook-plunge-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['fruitful-hook-plunge-hit'] ?? '1') === '1' || Number(ctx.inputs?.['fruitful-hook-plunge-hit'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "heretics-molten-blade",
    varName: "hereticsMoltenBlade",
    name: "Heretic's Molten Blade",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Molten Heresy",
    passiveDesc: "Elemental Skill DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "molten-blade-skill",
        label: "Elemental Skill DMG Bonus (Heretic's Molten Blade)",
        stat: "skillDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "katsuragikiri-nagamasa",
    varName: "katsuragikiriNagamasa",
    name: "Katsuragikiri Nagamasa",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Samurai Conduct",
    passiveDesc:
      "Increases Elemental Skill DMG by 6~12%. After Elemental Skill hits, loses 3 Energy but restores 3~5 Energy every 2s for 6s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "nagamasa-skill-dmg",
        label: "Elemental Skill DMG Bonus (Katsuragikiri Nagamasa)",
        stat: "skillDmgBonus",
        refinementValues: [6, 7.5, 9, 10.5, 12],
        isTeamBuff: false,
        computeCode: "(r) => [6, 7.5, 9, 10.5, 12][r - 1]",
      },
    ],
  },
  {
    id: "lithic-blade",
    varName: "lithicBlade",
    name: "Lithic Blade",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Lithic Axiom: Unity",
    passiveDesc:
      "For every character in the party who hails from Liyue, the character equipping this weapon gains a 7~11% ATK increase and a 3~7% CRIT Rate increase. Max 4 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "lithic-liyue-count",
        label: "Liyue Party Members (1-4)",
        control: "stacks",
        max: 4,
        defaultValue: 1,
        hint: "+7~11% ATK and +3~7% CRIT Rate per Liyue party member",
      },
    ],
    buffs: [
      {
        id: "lithic-blade-atk",
        label: "ATK% from Liyue Members (Lithic Blade)",
        stat: "atk",
        refinementValues: [28, 32, 36, 40, 44],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "lithic-liyue-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['lithic-liyue-count'] ?? 1); const perStack = [7, 8, 9, 10, 11][r - 1]; return ((count * perStack) / 100) * ctx.baseAtk; }",
      },
      {
        id: "lithic-blade-crit",
        label: "CRIT Rate% from Liyue Members (Lithic Blade)",
        stat: "critRate",
        refinementValues: [12, 16, 20, 24, 28],
        isTeamBuff: false,
        conditionKey: "lithic-liyue-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['lithic-liyue-count'] ?? 1); const perStack = [3, 4, 5, 6, 7][r - 1]; return count * perStack; }",
      },
    ],
  },
  {
    id: "luxurious-sea-lord",
    varName: "luxuriousSeaLord",
    name: "Luxurious Sea-Lord",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Oceanic Victory",
    passiveDesc:
      "Increases Elemental Burst DMG by 12~24%. When Elemental Burst hits opponents, summons a titanic tuna that deals 100~200% ATK as AoE DMG every 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "sea-lord-burst-dmg",
        label: "Elemental Burst DMG Bonus (Luxurious Sea-Lord)",
        stat: "burstDmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
    ],
  },
  {
    id: "mailed-flower",
    varName: "mailedFlower",
    name: "Mailed Flower",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Whispers of Wind and Flower",
    passiveDesc:
      "Within 8s after the character's Elemental Skill hits an opponent or triggers an Elemental Reaction, their ATK is increased by 12~24% and Elemental Mastery is increased by 48~96.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "mailed-flower-active",
        label: "Skill Hit / Reaction Active (+12~24% ATK, +48~96 EM)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% ATK and +48~96 EM for 8s",
      },
    ],
    buffs: [
      {
        id: "mailed-flower-atk",
        label: "ATK% (Mailed Flower)",
        stat: "atk",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "mailed-flower-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['mailed-flower-active'] ?? '1') === '1' || Number(ctx.inputs?.['mailed-flower-active'] ?? 1) > 0; return on ? ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "mailed-flower-em",
        label: "Elemental Mastery (Mailed Flower)",
        stat: "em",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "mailed-flower-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['mailed-flower-active'] ?? '1') === '1' || Number(ctx.inputs?.['mailed-flower-active'] ?? 1) > 0; return on ? [48, 60, 72, 84, 96][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "makhaira-aquamarine",
    varName: "makhairaAquamarine",
    name: "Makhaira Aquamarine",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Desert Pavilion",
    passiveDesc:
      "The following effect will trigger every 10s: The equipping character will gain 24~48% of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "makhaira-wielder-em",
        label: "Wielder's Elemental Mastery (e.g. 1000)",
        control: "stacks",
        max: 2000,
        defaultValue: 1000,
        hint: "Used to compute flat ATK gained by wielder and party",
      },
    ],
    buffs: [
      {
        id: "makhaira-self-atk",
        label: "Self ATK from EM (Makhaira Aquamarine)",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const em = Number(ctx.inputs?.['makhaira-wielder-em'] ?? 1000); const ratio = [0.24, 0.30, 0.36, 0.42, 0.48][r - 1]; return em * ratio; }",
      },
      {
        id: "makhaira-party-atk",
        label: "Party ATK from Wielder EM (Makhaira Aquamarine)",
        description: "Nearby party members gain 30% of the wielder's ATK buff",
        stat: "atk",
        refinementValues: [7.2, 9.0, 10.8, 12.6, 14.4],
        isTeamBuff: true,
        computeCode:
          "(r, ctx) => { const em = Number(ctx.inputs?.['makhaira-wielder-em'] ?? 1000); const ratio = [0.24, 0.30, 0.36, 0.42, 0.48][r - 1]; return em * ratio * 0.3; }",
      },
    ],
  },
  {
    id: "portable-power-saw",
    varName: "portablePowerSaw",
    name: "Portable Power Saw",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "hpPct", label: "HP%", value: 55.1, baseValue: 12.0 },
    passiveName: "Sea Shanty",
    passiveDesc:
      "When the wielder is healed or heals all party members, gain a Stoic's Symbol for 30s (max 3). Using an Elemental Skill or Burst consumes all symbols to grant 40~80 EM per symbol for 10s and restore 2~4 Energy per symbol.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "saw-symbols",
        label: "Stoic Symbols Consumed (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+40~80 EM per symbol (up to +120~240 EM)",
      },
    ],
    buffs: [
      {
        id: "saw-em",
        label: "Elemental Mastery (Portable Power Saw)",
        stat: "em",
        refinementValues: [120, 150, 180, 210, 240],
        isTeamBuff: false,
        conditionKey: "saw-symbols",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['saw-symbols'] ?? 3); return s * [40, 50, 60, 70, 80][r - 1]; }",
      },
    ],
  },
  {
    id: "prospectors-shovel",
    varName: "prospectorsShovel",
    name: "Prospector's Shovel",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "defPct", label: "DEF%", value: 51.7, baseValue: 11.3 },
    passiveName: "Tunneler",
    passiveDesc: "Increases DEF by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "prospector-shovel-def",
        label: "DEF% (Prospector's Shovel)",
        stat: "def",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "prototype-archaic",
    varName: "prototypeArchaic",
    name: "Prototype Archaic",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Crush",
    passiveDesc:
      "On hit, Normal or Charged Attacks have a 50% chance to deal an additional 240~480% ATK DMG to opponents in a small AoE. Can only occur once every 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "rainslasher",
    varName: "rainslasher",
    name: "Rainslasher",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Bane of Storm and Tide",
    passiveDesc:
      "Increases DMG against opponents affected by Hydro or Electro by 20~36%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "rainslasher-target-affected",
        label: "Target Affected by Hydro or Electro",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~36% All DMG bonus against affected enemies",
      },
    ],
    buffs: [
      {
        id: "rainslasher-dmg",
        label: "All DMG Bonus vs Hydro/Electro (Rainslasher)",
        stat: "dmgBonus",
        refinementValues: [20, 24, 28, 32, 36],
        isTeamBuff: false,
        conditionKey: "rainslasher-target-affected",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['rainslasher-target-affected'] ?? '1') === '1' || Number(ctx.inputs?.['rainslasher-target-affected'] ?? 1) > 0; return on ? [20, 24, 28, 32, 36][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "royal-greatsword",
    varName: "royalGreatsword",
    name: "Royal Greatsword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Focus",
    passiveDesc:
      "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks. A CRIT hit removes all stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "royal-focus-stacks",
        label: "Focus Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+8~16% CRIT Rate per stack (up to +40~80%)",
      },
    ],
    buffs: [
      {
        id: "royal-focus-crit",
        label: "CRIT Rate% (Royal Greatsword Focus)",
        stat: "critRate",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "royal-focus-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['royal-focus-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
    ],
  },
  {
    id: "sacrificial-greatsword",
    varName: "sacrificialGreatsword",
    name: "Sacrificial Greatsword",
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
    id: "serenitys-call",
    varName: "serenitysCall",
    name: "Serenity's Call",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Peaceful Mind",
    passiveDesc: "Elemental Burst DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "serenity-burst-dmg",
        label: "Elemental Burst DMG Bonus (Serenity's Call)",
        stat: "burstDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "serpent-spine",
    varName: "serpentSpine",
    name: "Serpent Spine",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Wavesplitter",
    passiveDesc:
      "Every 4s a character is on the field, they will deal 6~10% more DMG and take 3~1.8% more DMG. This effect has a maximum of 5 stacks and will not be reset if the character leaves the field, but will be reduced by 1 stack when the character takes DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "serpent-spine-stacks",
        label: "Wavesplitter Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+6~10% All DMG bonus per stack (up to +30~50%)",
      },
    ],
    buffs: [
      {
        id: "serpent-spine-dmg",
        label: "All DMG Bonus (Serpent Spine)",
        stat: "dmgBonus",
        refinementValues: [30, 35, 40, 45, 50],
        isTeamBuff: false,
        conditionKey: "serpent-spine-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['serpent-spine-stacks'] ?? 5); return s * [6, 7, 8, 9, 10][r - 1]; }",
      },
    ],
  },
  {
    id: "snow-tombed-starsilver",
    varName: "snowTombedStarsilver",
    name: "Snow-Tombed Starsilver",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 34.5, baseValue: 7.5 },
    passiveName: "Frost Burial",
    passiveDesc:
      "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of forming and dropping an Everfrost Icicle above them, dealing 80~140% AoE ATK DMG. Opponents affected by Cryo are dealt 200~360% ATK DMG instead.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "song-of-the-vigil",
    varName: "songOfTheVigil",
    name: "Song of the Vigil",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Vigilant Song",
    passiveDesc: "All Elemental DMG Bonus is increased by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "vigil-elem-dmg",
        label: "All Elemental DMG Bonus (Song of the Vigil)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
    ],
  },
  {
    id: "talking-stick",
    varName: "talkingStick",
    name: "Talking Stick",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 18.4, baseValue: 4.0 },
    passiveName: "\"The Five Sights\"",
    passiveDesc:
      "ATK will be increased by 16~32% for 15s after being affected by Pyro. All Elemental DMG Bonus will be increased by 12~24% for 15s after being affected by Hydro, Cryo, Electro, or Dendro.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "talking-stick-pyro-aura",
        label: "Affected by Pyro (+16~32% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% ATK for 15s",
      },
      {
        id: "talking-stick-elem-aura",
        label: "Affected by Hydro/Cryo/Electro/Dendro (+12~24% Elem DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% All Elemental DMG Bonus for 15s",
      },
    ],
    buffs: [
      {
        id: "talking-stick-atk",
        label: "ATK% from Pyro Aura (Talking Stick)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "talking-stick-pyro-aura",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['talking-stick-pyro-aura'] ?? '1') === '1' || Number(ctx.inputs?.['talking-stick-pyro-aura'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "talking-stick-elem-dmg",
        label: "All Elemental DMG Bonus (Talking Stick)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "talking-stick-elem-aura",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['talking-stick-elem-aura'] ?? '1') === '1' || Number(ctx.inputs?.['talking-stick-elem-aura'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "the-bell",
    varName: "theBell",
    name: "The Bell",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
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
      },
    ],
    buffs: [
      {
        id: "bell-dmg",
        label: "All DMG Bonus when Shielded (The Bell)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "bell-shielded",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['bell-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['bell-shielded'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "tidal-shadow",
    varName: "tidalShadow",
    name: "Tidal Shadow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "White Wave Fold",
    passiveDesc:
      "After the wielder is healed, ATK is increased by 24~48% for 8s. This can be triggered even when the character is not on the field.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "tidal-shadow-healed",
        label: "Wielder Received Healing (+24~48% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+24~48% ATK for 8s",
      },
    ],
    buffs: [
      {
        id: "tidal-shadow-atk",
        label: "ATK% (Tidal Shadow)",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "tidal-shadow-healed",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['tidal-shadow-healed'] ?? '1') === '1' || Number(ctx.inputs?.['tidal-shadow-healed'] ?? 1) > 0; return on ? ([24, 30, 36, 42, 48][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "ultimate-overlords-mega-magic-sword",
    varName: "ultimateOverlordsMegaMagicSword",
    name: "Ultimate Overlord's Mega Magic Sword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
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
        max: 24,
        defaultValue: 24,
        hint: "+0.5~1.0% additional ATK per Melusine helped (up to +12~24%)",
      },
    ],
    buffs: [
      {
        id: "overlord-base-atk",
        label: "ATK% (Mega Magic Sword Base)",
        stat: "atk",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk",
      },
      {
        id: "overlord-melusine-atk",
        label: "ATK% (Melusines Helped)",
        stat: "atk",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "overlord-melusines-helped",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['overlord-melusines-helped'] ?? 24); const cap = [12, 15, 18, 21, 24][r - 1]; const perMelusine = cap / 24; return ((Math.min(count, 24) * perMelusine) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "whiteblind",
    varName: "whiteblind",
    name: "Whiteblind",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "defPct", label: "DEF%", value: 51.7, baseValue: 11.3 },
    passiveName: "Infusion Blade",
    passiveDesc:
      "On hit, Normal or Charged Attacks increase ATK and DEF by 6~12% for 6s. Max 4 stacks (up to +24~48%). Can only occur once every 0.5s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "whiteblind-stacks",
        label: "Infusion Blade Stacks (0-4)",
        control: "stacks",
        max: 4,
        defaultValue: 4,
        hint: "+6~12% ATK & DEF per stack (up to +24~48%)",
      },
    ],
    buffs: [
      {
        id: "whiteblind-atk",
        label: "ATK% (Whiteblind Stacks)",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "whiteblind-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['whiteblind-stacks'] ?? 4); return ((s * [6, 7.5, 9, 10.5, 12][r - 1]) / 100) * ctx.baseAtk; }",
      },
      {
        id: "whiteblind-def",
        label: "DEF% (Whiteblind Stacks)",
        stat: "def",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "whiteblind-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['whiteblind-stacks'] ?? 4); return s * [6, 7.5, 9, 10.5, 12][r - 1]; }",
      },
    ],
  },

  // ==========================================
  // 3-STAR CLAYMORES (5)
  // ==========================================
  {
    id: "bloodtainted-greatsword",
    varName: "bloodtaintedGreatsword",
    name: "Bloodtainted Greatsword",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "em", label: "Elemental Mastery", value: 187, baseValue: 41 },
    passiveName: "Bane of Fire and Thunder",
    passiveDesc:
      "Increases DMG against opponents affected by Pyro or Electro by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "bloodtainted-target-affected",
        label: "Target Affected by Pyro or Electro",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% All DMG bonus against affected enemies",
      },
    ],
    buffs: [
      {
        id: "bloodtainted-dmg",
        label: "All DMG Bonus vs Pyro/Electro (Bloodtainted Greatsword)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "bloodtainted-target-affected",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['bloodtainted-target-affected'] ?? '1') === '1' || Number(ctx.inputs?.['bloodtainted-target-affected'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "debate-club",
    varName: "debateClub",
    name: "Debate Club",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "atkPct", label: "ATK%", value: 35.2, baseValue: 7.7 },
    passiveName: "Blunt Conclusion",
    passiveDesc:
      "After using an Elemental Skill, Normal or Charged Attacks deal an additional 60~120% ATK DMG in a small AoE on hit for 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "ferrous-shadow",
    varName: "ferrousShadow",
    name: "Ferrous Shadow",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "hpPct", label: "HP%", value: 35.2, baseValue: 7.7 },
    passiveName: "Unbending",
    passiveDesc:
      "When HP falls below 70~90%, increases Charged Attack DMG by 30~50% and makes Charged Attacks harder to interrupt.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "ferrous-hp-low",
        label: "HP below 70~90% (+30~50% Charged DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+30~50% Charged Attack DMG when low HP",
      },
    ],
    buffs: [
      {
        id: "ferrous-ca-dmg",
        label: "Charged Attack DMG Bonus (Ferrous Shadow)",
        stat: "chargedDmgBonus",
        refinementValues: [30, 35, 40, 45, 50],
        isTeamBuff: false,
        conditionKey: "ferrous-hp-low",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['ferrous-hp-low'] ?? '1') === '1' || Number(ctx.inputs?.['ferrous-hp-low'] ?? 1) > 0; return on ? [30, 35, 40, 45, 50][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "skyrider-greatsword",
    varName: "skyriderGreatsword",
    name: "Skyrider Greatsword",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 43.9, baseValue: 9.6 },
    passiveName: "Courage",
    passiveDesc:
      "On hit, Normal or Charged Attacks increase ATK by 6~10% for 6s. Max 4 stacks (up to +24~40%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "skyrider-courage-stacks",
        label: "Courage Stacks (0-4)",
        control: "stacks",
        max: 4,
        defaultValue: 4,
        hint: "+6~10% ATK per hit stack (up to +24~40%)",
      },
    ],
    buffs: [
      {
        id: "skyrider-courage-atk",
        label: "ATK% (Skyrider Greatsword Courage)",
        stat: "atk",
        refinementValues: [24, 28, 32, 36, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "skyrider-courage-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['skyrider-courage-stacks'] ?? 4); return ((s * [6, 7, 8, 9, 10][r - 1]) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "white-iron-greatsword",
    varName: "whiteIronGreatsword",
    name: "White Iron Greatsword",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "defPct", label: "DEF%", value: 43.9, baseValue: 9.6 },
    passiveName: "Cull the Weak",
    passiveDesc:
      "Defeating an opponent restores 8~16% HP.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },

  // ==========================================
  // 2-STAR & 1-STAR CLAYMORES (2)
  // ==========================================
  {
    id: "old-mercs-pal",
    varName: "oldMercsPal",
    name: "Old Merc's Pal",
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
    id: "waster-greatsword",
    varName: "wasterGreatsword",
    name: "Waster Greatsword",
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
function generateWeaponFile(w: ClaymoreDefinition): string {
  const buffCode = (w.buffs || [])
    .map(
      (b: any) => `    {
      id: "${b.id}",
      label: "${b.label}",
      ${b.description ? `description: "${b.description}",\n      ` : ""}stat: "${b.stat}",
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
      label: "${m.label}",
      control: "${m.control}",
      ${m.defaultValue !== undefined ? `defaultValue: ${typeof m.defaultValue === "string" ? `"${m.defaultValue}"` : m.defaultValue},\n      ` : ""}${m.max !== undefined ? `max: ${m.max},\n      ` : ""}${m.min !== undefined ? `min: ${m.min},\n      ` : ""}${m.hint ? `hint: "${m.hint}",\n    ` : ""}}`
        )
        .join(",\n") +
      `\n  ],`
    : "";

  return `import type { WeaponConfig } from "../types";

export const ${w.varName}: WeaponConfig = {
  id: "${w.id}",
  name: "${w.name.replace(/"/g, '\\"')}",
  type: "Claymore",
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

// Generate all claymore files
const claymoresDir = path.resolve("src/data/registry/weapons/claymores");

for (const w of COMPLETE_CLAYMORES) {
  const filePath = path.join(claymoresDir, `${w.id}.ts`);
  const content = generateWeaponFile(w);
  fs.writeFileSync(filePath, content, "utf-8");
}

// Update claymores/index.ts
const imports = COMPLETE_CLAYMORES.map((w) => `import { ${w.varName} } from "./${w.id}";`).join("\n");
const names = COMPLETE_CLAYMORES.map((w) => w.varName).join(",\n  ");

const indexContent = `${imports}
import type { WeaponConfig } from "../types";

export {
  ${names},
};

export const CLAYMORES: WeaponConfig[] = [
  ${names},
];
`;

fs.writeFileSync(path.join(claymoresDir, "index.ts"), indexContent, "utf-8");

console.log(`Successfully generated ${COMPLETE_CLAYMORES.length} claymore files and updated claymores/index.ts.`);
