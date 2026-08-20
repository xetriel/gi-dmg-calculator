import fs from "fs";
import path from "path";

export interface SwordDefinition {
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

export const COMPLETE_SWORDS: SwordDefinition[] = [
  // 5-STAR SWORDS (20)
  {
    id: "absolution",
    varName: "absolution",
    name: "Absolution",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Climb the Flowing Shadows",
    passiveDesc:
      "CRIT DMG is increased by 20~40%. When the value of a Bond of Life increases, the wielder deals 16~32% increased DMG for 6s. Max 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "absolution-stacks",
        label: "Bond of Life Increase Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+16~32% All DMG bonus per stack (up to +48~96%)",
      },
    ],
    buffs: [
      {
        id: "absolution-crit-dmg",
        label: "CRIT DMG% (Absolution)",
        stat: "critDmg",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "absolution-dmg-bonus",
        label: "All DMG Bonus (Absolution BoL Stacks)",
        stat: "dmgBonus",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "absolution-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['absolution-stacks'] ?? 3); return s * [16, 20, 24, 28, 32][r - 1]; }",
      },
    ],
    signatureFor: ["clorinde"],
  },
  {
    id: "angelos-heptades",
    varName: "angelosHeptades",
    name: "Angelos' Heptades",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Heptadic Chord",
    passiveDesc:
      "Increases All Elemental DMG Bonus by 12~24%. Normal and Charged Attacks dealing Elemental DMG grant +16~32% ATK for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "angelos-atk-active",
        label: "Elemental NA/CA Hit Active",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% ATK for 10s",
      },
    ],
    buffs: [
      {
        id: "angelos-elem-dmg",
        label: "All Elemental DMG Bonus (Angelos' Heptades)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "angelos-atk",
        label: "ATK% (Angelos' Heptades)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "angelos-atk-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['angelos-atk-active'] ?? '1') === '1' || Number(ctx.inputs?.['angelos-atk-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "aquila-favonia",
    varName: "aquilaFavonia",
    name: "Aquila Favonia",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 41.3, baseValue: 9.0 },
    passiveName: "Falcon's Defiance",
    passiveDesc:
      "ATK is increased by 20~40%. Triggers on taking DMG: the soul of the Falcon of the West awakens, regenerating HP equal to 100~160% of ATK and dealing 200~320% of ATK as DMG to surrounding opponents.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "aquila-atk",
        label: "ATK% (Aquila Favonia)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk",
      },
    ],
    signatureFor: ["jean"],
  },
  {
    id: "athame-artis",
    varName: "athameArtis",
    name: "Athame Artis",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Ritual Cleaving",
    passiveDesc:
      "Increases Normal and Charged Attack DMG by 20~40%. When the equipping character triggers an Elemental Reaction, nearby party members gain 12~24% All Elemental DMG Bonus and 16~32% ATK for 12s.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "athame-reaction-active",
        label: "Party Buff: Reaction Triggered Active",
        control: "toggle",
        defaultValue: 1,
        hint: "Team buff: +12~24% All Elemental DMG and +16~32% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "athame-party-elem-dmg",
        label: "Party All Elemental DMG Bonus (Athame Artis)",
        description: "Nearby party members gain +12~24% All Elemental DMG Bonus for 12s",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: true,
        conditionKey: "athame-reaction-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['athame-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['athame-reaction-active'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
      {
        id: "athame-party-atk",
        label: "Party ATK% (Athame Artis)",
        description: "Nearby party members gain +16~32% ATK for 12s",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "athame-reaction-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['athame-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['athame-reaction-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "athame-na-ca-dmg",
        label: "Normal/Charged Attack DMG Bonus (Athame Artis)",
        stat: "normalDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
    ],
  },
  {
    id: "azurelight",
    varName: "azurelight",
    name: "Azurelight",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Azure Brilliance",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. Elemental Skill hits increase CRIT DMG by 20~40% for 8s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "azurelight-skill-hit",
        label: "Skill Hit Active (+20~40% CRIT DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% CRIT DMG for 8s",
      },
    ],
    buffs: [
      {
        id: "azurelight-elem-dmg",
        label: "All Elemental DMG Bonus (Azurelight)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "azurelight-crit-dmg",
        label: "CRIT DMG% (Azurelight)",
        stat: "critDmg",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "azurelight-skill-hit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['azurelight-skill-hit'] ?? '1') === '1' || Number(ctx.inputs?.['azurelight-skill-hit'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "exaiphanes-blade",
    varName: "exaiphanesBlade",
    name: "Exaiphanes Blade",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Sudden Manifestation",
    passiveDesc:
      "Increases All Elemental DMG Bonus by 12~24%. After using an Elemental Skill, increases Normal and Charged Attack DMG by 20~40% for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "exaiphanes-skill-active",
        label: "Skill Used (+20~40% NA/CA DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% Normal & Charged Attack DMG for 10s",
      },
    ],
    buffs: [
      {
        id: "exaiphanes-elem-dmg",
        label: "All Elemental DMG Bonus (Exaiphanes Blade)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "exaiphanes-na-dmg",
        label: "Normal Attack DMG Bonus (Exaiphanes)",
        stat: "normalDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "exaiphanes-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['exaiphanes-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['exaiphanes-skill-active'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
      {
        id: "exaiphanes-ca-dmg",
        label: "Charged Attack DMG Bonus (Exaiphanes)",
        stat: "chargedDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "exaiphanes-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['exaiphanes-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['exaiphanes-skill-active'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "freedom-sworn",
    varName: "freedomSworn",
    name: "Freedom-Sworn",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "em", label: "Elemental Mastery", value: 198, baseValue: 43 },
    passiveName: "Revolutionary Chorale",
    passiveDesc:
      "Increases DMG by 10~20%. When triggering Elemental Reactions 2 times, all nearby party members gain +16~32% Normal/Charged/Plunging Attack DMG and +20~40% ATK for 12s.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "freedom-sigils-active",
        label: "Millennial Movement: Song of Resistance Active",
        control: "toggle",
        defaultValue: 1,
        hint: "Team buff: +16~32% NA/CA/Plunge DMG, +20~40% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "freedom-party-na-ca-plunge",
        label: "Party NA/CA/Plunge DMG Bonus (Freedom-Sworn)",
        description: "Nearby party members gain +16~32% Normal, Charged, and Plunging Attack DMG",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        conditionKey: "freedom-sigils-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['freedom-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['freedom-sigils-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
      {
        id: "freedom-party-charged",
        label: "Party Charged Attack DMG Bonus (Freedom-Sworn)",
        stat: "chargedDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        conditionKey: "freedom-sigils-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['freedom-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['freedom-sigils-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
      {
        id: "freedom-party-plunge",
        label: "Party Plunging Attack DMG Bonus (Freedom-Sworn)",
        stat: "plungeDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        conditionKey: "freedom-sigils-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['freedom-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['freedom-sigils-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
      {
        id: "freedom-party-atk",
        label: "Party ATK% (Freedom-Sworn)",
        description: "Nearby party members gain +20~40% ATK",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "freedom-sigils-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['freedom-sigils-active'] ?? '1') === '1' || Number(ctx.inputs?.['freedom-sigils-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "freedom-self-dmg",
        label: "Self All DMG Bonus (Freedom-Sworn Base)",
        stat: "dmgBonus",
        refinementValues: [10, 12.5, 15, 17.5, 20],
        isTeamBuff: false,
        computeCode: "(r) => [10, 12.5, 15, 17.5, 20][r - 1]",
      },
    ],
    signatureFor: ["kaedehara-kazuha"],
  },
  {
    id: "haran-geppaku-futsu",
    varName: "haranGeppakuFutsu",
    name: "Haran Geppaku Futsu",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Honed Flow",
    passiveDesc:
      "Obtain 12~24% All Elemental DMG Bonus. When nearby party members use Elemental Skills, obtain 1 Wavespike stack (max 2). When the wielder uses an Elemental Skill, consume all stacks to gain 20~40% Normal Attack DMG Bonus per stack for 8s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "wavespike-stacks",
        label: "Wavespike Stacks Consumed (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+20~40% Normal Attack DMG Bonus per stack",
      },
    ],
    buffs: [
      {
        id: "haran-elem-dmg",
        label: "All Elemental DMG Bonus (Haran Geppaku Futsu)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "haran-na-dmg",
        label: "Normal Attack DMG Bonus (Haran Wavespike)",
        stat: "normalDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "wavespike-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['wavespike-stacks'] ?? 2); return s * [20, 25, 30, 35, 40][r - 1]; }",
      },
    ],
    signatureFor: ["kamisato-ayato"],
  },
  {
    id: "key-of-khaj-nisut",
    varName: "keyOfKhajNisut",
    name: "Key of Khaj-Nisut",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "hpPct", label: "HP%", value: 66.2, baseValue: 14.4 },
    passiveName: "Sunken Song of the Sands",
    passiveDesc:
      "HP increased by 20~40%. When an Elemental Skill hits opponents, gain Grand Hymn effect for 20s (max 3 stacks): increases EM by 0.12~0.24% of Max HP per stack. At 3 stacks, all nearby party members gain EM equal to 0.2~0.4% of wielder's Max HP for 20s.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "wielder-max-hp",
        label: "Wielder's Max HP (e.g. 70000)",
        control: "stacks",
        max: 100000,
        defaultValue: 70000,
        hint: "Used to calculate EM granted to party members",
      },
      {
        id: "key-hymn-stacks",
        label: "Grand Hymn Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "3 stacks required to activate party EM buff",
      },
    ],
    buffs: [
      {
        id: "key-self-hp",
        label: "HP% (Key of Khaj-Nisut Base)",
        stat: "hp",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "key-self-em",
        label: "Self EM from Max HP (Key of Khaj-Nisut)",
        stat: "em",
        refinementValues: [0.36, 0.45, 0.54, 0.63, 0.72],
        isTeamBuff: false,
        conditionKey: "key-hymn-stacks",
        computeCode:
          "(r, ctx) => { const hp = Number(ctx.inputs?.['wielder-max-hp'] ?? 70000); const s = Number(ctx.inputs?.['key-hymn-stacks'] ?? 3); const perStack = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; return hp * perStack * s; }",
      },
      {
        id: "key-party-em",
        label: "Party EM from Wielder Max HP (Key of Khaj-Nisut)",
        description: "Nearby party members gain EM equal to 0.2~0.4% of wielder's Max HP",
        stat: "em",
        refinementValues: [0.2, 0.25, 0.3, 0.35, 0.4],
        isTeamBuff: true,
        conditionKey: "key-hymn-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['key-hymn-stacks'] ?? 3); if (s < 3) return 0; const hp = Number(ctx.inputs?.['wielder-max-hp'] ?? 70000); const ratio = [0.002, 0.0025, 0.003, 0.0035, 0.004][r - 1]; return hp * ratio; }",
      },
    ],
    signatureFor: ["nilou"],
  },
  {
    id: "light-of-foliar-incision",
    varName: "lightOfFoliarIncision",
    name: "Light of Foliar Incision",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Whitemoon Bristle",
    passiveDesc:
      "CRIT Rate is increased by 4~8%. After Normal Attacks deal Elemental DMG, the Foliar Incision effect is obtained: increases DMG dealt by Normal Attacks and Elemental Skills by 120~240% of Elemental Mastery for 28 hits or 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "foliar-wielder-em",
        label: "Character EM",
        control: "stacks",
        max: 2000,
        defaultValue: 400,
        hint: "EM used for Foliar Incision flat DMG",
      },
      {
        id: "foliar-incision-active",
        label: "Foliar Incision Active",
        control: "toggle",
        defaultValue: 1,
        hint: "+120~240% of EM as flat NA/Skill DMG",
      },
    ],
    buffs: [
      {
        id: "foliar-crit-rate",
        label: "CRIT Rate% (Light of Foliar Incision)",
        stat: "critRate",
        refinementValues: [4, 5, 6, 7, 8],
        isTeamBuff: false,
        computeCode: "(r) => [4, 5, 6, 7, 8][r - 1]",
      },
      {
        id: "foliar-na-flat",
        label: "Normal Attack Flat DMG from EM",
        stat: "normalDmgBonus",
        refinementValues: [120, 150, 180, 210, 240],
        isTeamBuff: false,
        conditionKey: "foliar-incision-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['foliar-incision-active'] ?? '1') === '1' || Number(ctx.inputs?.['foliar-incision-active'] ?? 1) > 0; if (!on) return 0; const em = Number(ctx.inputs?.['foliar-wielder-em'] ?? 400); return em * ([1.2, 1.5, 1.8, 2.1, 2.4][r - 1]); }",
      },
      {
        id: "foliar-skill-flat",
        label: "Elemental Skill Flat DMG from EM",
        stat: "skillDmgBonus",
        refinementValues: [120, 150, 180, 210, 240],
        isTeamBuff: false,
        conditionKey: "foliar-incision-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['foliar-incision-active'] ?? '1') === '1' || Number(ctx.inputs?.['foliar-incision-active'] ?? 1) > 0; if (!on) return 0; const em = Number(ctx.inputs?.['foliar-wielder-em'] ?? 400); return em * ([1.2, 1.5, 1.8, 2.1, 2.4][r - 1]); }",
      },
    ],
    signatureFor: ["alhaitham"],
  },
  {
    id: "lightbearing-moonshard",
    varName: "lightbearingMoonshard",
    name: "Lightbearing Moonshard",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Lunar Glow",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. When an Elemental Burst is used, increases ATK by 20~40% for 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "moonshard-burst-active",
        label: "Elemental Burst Used (+20~40% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "moonshard-elem-dmg",
        label: "All Elemental DMG Bonus (Lightbearing Moonshard)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "moonshard-atk",
        label: "ATK% (Lightbearing Moonshard)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "moonshard-burst-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['moonshard-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['moonshard-burst-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "mistsplitter-reforged",
    varName: "mistsplitterReforged",
    name: "Mistsplitter Reforged",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Mistsplitter's Edge",
    passiveDesc:
      "Gain 12~24% Elemental DMG Bonus for all elements and receive the might of the Mistsplitter's Emblem. At stack levels 1/2/3, Mistsplitter's Emblem provides 8/16/28% ~ 16/32/56% Elemental DMG Bonus for the character's Elemental Type.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "mistsplitter-stacks",
        label: "Mistsplitter's Emblem Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+8/16/28% Elemental DMG Bonus at R1 (up to +16/32/56% at R5)",
      },
    ],
    buffs: [
      {
        id: "mistsplitter-base-elem",
        label: "All Elemental DMG Bonus (Mistsplitter Base)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "mistsplitter-emblem-dmg",
        label: "Elemental DMG Bonus (Mistsplitter Stacks)",
        stat: "dmgBonus",
        refinementValues: [28, 35, 42, 49, 56],
        isTeamBuff: false,
        conditionKey: "mistsplitter-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['mistsplitter-stacks'] ?? 3); const tiers: Record<number, [number, number, number, number, number]> = { 0: [0, 0, 0, 0, 0], 1: [8, 10, 12, 14, 16], 2: [16, 20, 24, 28, 32], 3: [28, 35, 42, 49, 56] }; return (tiers[s] ?? tiers[3])[r - 1]; }",
      },
    ],
    signatureFor: ["kamisato-ayaka"],
  },
  {
    id: "peak-patrol-song",
    varName: "peakPatrolSong",
    name: "Peak Patrol Song",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "defPct", label: "DEF%", value: 82.7, baseValue: 18.0 },
    passiveName: "High-Altitude Patrol",
    passiveDesc:
      "After Normal or Plunging Attacks hit opponents, gain the Ode to Flowers effect: DEF is increased by 8~16% and All Elemental DMG Bonus by 10~20% for 6s (max 2 stacks). At 2 stacks, every 1,000 DEF increases nearby party members' All Elemental DMG Bonus by 8~16% for 15s (max 25.6~51.2%).",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "patrol-wielder-def",
        label: "Wielder's DEF (e.g. 3200)",
        control: "stacks",
        max: 6000,
        defaultValue: 3200,
        hint: "DEF used for party Elemental DMG Bonus conversion (cap reached at 3200 DEF)",
      },
      {
        id: "patrol-ode-stacks",
        label: "Ode to Flowers Stacks (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "2 stacks trigger party Elemental DMG buff",
      },
    ],
    buffs: [
      {
        id: "patrol-party-elem-dmg",
        label: "Party All Elemental DMG Bonus (Peak Patrol Song)",
        description: "Nearby party members gain All Elemental DMG Bonus based on wielder's DEF",
        stat: "dmgBonus",
        refinementValues: [25.6, 32.0, 38.4, 44.8, 51.2],
        isTeamBuff: true,
        conditionKey: "patrol-ode-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['patrol-ode-stacks'] ?? 2); if (s < 2) return 0; const def = Number(ctx.inputs?.['patrol-wielder-def'] ?? 3200); const per1k = [8, 10, 12, 14, 16][r - 1]; const cap = [25.6, 32.0, 38.4, 44.8, 51.2][r - 1]; return Math.min((def / 1000) * per1k, cap); }",
      },
      {
        id: "patrol-self-def",
        label: "Self DEF% (Peak Patrol Song)",
        stat: "def",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "patrol-ode-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['patrol-ode-stacks'] ?? 2); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
      {
        id: "patrol-self-dmg",
        label: "Self All Elemental DMG Bonus (Peak Patrol Song)",
        stat: "dmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "patrol-ode-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['patrol-ode-stacks'] ?? 2); return s * [10, 12.5, 15, 17.5, 20][r - 1]; }",
      },
    ],
    signatureFor: ["xilonen"],
  },
  {
    id: "primordial-jade-cutter",
    varName: "primordialJadeCutter",
    name: "Primordial Jade Cutter",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 44.1, baseValue: 9.6 },
    passiveName: "Protector's Virtue",
    passiveDesc:
      "HP is increased by 20~40%. Additionally, provides an ATK Bonus based on 1.2~2.4% of the wielder's Max HP.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "jade-cutter-max-hp",
        label: "Character Max HP",
        control: "stacks",
        max: 100000,
        defaultValue: 25000,
        hint: "Max HP used for flat ATK conversion",
      },
    ],
    buffs: [
      {
        id: "jade-cutter-hp",
        label: "HP% (Primordial Jade Cutter)",
        stat: "hp",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "jade-cutter-atk-from-hp",
        label: "Flat ATK from Max HP (Primordial Jade Cutter)",
        stat: "atk",
        refinementValues: [1.2, 1.5, 1.8, 2.1, 2.4],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const hp = Number(ctx.inputs?.['jade-cutter-max-hp'] ?? 25000); const ratio = [0.012, 0.015, 0.018, 0.021, 0.024][r - 1]; return hp * ratio; }",
      },
    ],
  },
  {
    id: "skyward-blade",
    varName: "skywardBlade",
    name: "Skyward Blade",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 55.1, baseValue: 12.0 },
    passiveName: "Sky-Piercing Fang",
    passiveDesc:
      "CRIT Rate is increased by 4~8%. Using an Elemental Burst gains Skypiercing Might: increases Movement SPD by 10%, ATK SPD by 10%, and Normal and Charged Attacks deal additional DMG equal to 20~40% of ATK for 12s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "skyward-blade-crit",
        label: "CRIT Rate% (Skyward Blade)",
        stat: "critRate",
        refinementValues: [4, 5, 6, 7, 8],
        isTeamBuff: false,
        computeCode: "(r) => [4, 5, 6, 7, 8][r - 1]",
      },
    ],
    signatureFor: ["bennett"],
  },
  {
    id: "splendor-of-tranquil-waters",
    varName: "splendorOfTranquilWaters",
    name: "Splendor of Tranquil Waters",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Dawn and Dusk by the Lake",
    passiveDesc:
      "When HP increases or decreases, Elemental Skill DMG is increased by 8~16% for 6s (max 3 stacks). When party members' HP increases or decreases, wielder's Max HP is increased by 14~28% for 6s (max 2 stacks).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "splendor-skill-stacks",
        label: "Wielder HP Change Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+8~16% Elemental Skill DMG per stack (up to +24~48%)",
      },
      {
        id: "splendor-hp-stacks",
        label: "Party Member HP Change Stacks (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+14~28% Max HP per stack (up to +28~56%)",
      },
    ],
    buffs: [
      {
        id: "splendor-skill-dmg",
        label: "Elemental Skill DMG Bonus (Splendor)",
        stat: "skillDmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        conditionKey: "splendor-skill-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['splendor-skill-stacks'] ?? 3); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
      {
        id: "splendor-hp",
        label: "Max HP% (Splendor Party Stacks)",
        stat: "hp",
        refinementValues: [28, 35, 42, 49, 56],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "splendor-hp-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['splendor-hp-stacks'] ?? 2); return s * [14, 17.5, 21, 24.5, 28][r - 1]; }",
      },
    ],
    signatureFor: ["furina"],
  },
  {
    id: "summit-shaper",
    varName: "summitShaper",
    name: "Summit Shaper",
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
        id: "summit-stacks",
        label: "Golden Majesty Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+4~8% ATK per stack",
      },
      {
        id: "summit-shielded",
        label: "Protected by Shield (2x ATK Buff)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles ATK bonus from stacks",
      },
    ],
    buffs: [
      {
        id: "summit-atk",
        label: "ATK% (Summit Shaper Stacks)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "summit-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['summit-stacks'] ?? 5); const shielded = (ctx.inputs?.['summit-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['summit-shielded'] ?? 1) > 0; const mult = shielded ? 2 : 1; return ((s * [4, 5, 6, 7, 8][r - 1] * mult) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "symphonist-of-scents",
    varName: "symphonistOfScents",
    name: "Symphonist of Scents",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Fragrant Harmony",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. Normal and Charged Attacks dealing Elemental DMG increase ATK by 16~32% for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "symphonist-hit-active",
        label: "Elemental NA/CA Hit Active",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% ATK for 10s",
      },
    ],
    buffs: [
      {
        id: "symphonist-elem-dmg",
        label: "All Elemental DMG Bonus (Symphonist of Scents)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "symphonist-atk",
        label: "ATK% (Symphonist of Scents)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "symphonist-hit-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['symphonist-hit-active'] ?? '1') === '1' || Number(ctx.inputs?.['symphonist-hit-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "uraku-misugiri",
    varName: "urakuMisugiri",
    name: "Uraku Misugiri",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 88.2, baseValue: 19.2 },
    passiveName: "Brocade Bloom, Shrine Sword",
    passiveDesc:
      "Normal Attack DMG is increased by 16~32% and Elemental Skill DMG is increased by 24~48%. After a nearby active character deals Geo DMG, the aforementioned effects increase by 100% for 15s. Additionally, DEF is increased by 20~40%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "uraku-geo-trigger",
        label: "Nearby Character Dealt Geo DMG (2x Buff)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles NA and Skill DMG bonuses for 15s",
      },
    ],
    buffs: [
      {
        id: "uraku-na-dmg",
        label: "Normal Attack DMG Bonus (Uraku Misugiri)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const geo = (ctx.inputs?.['uraku-geo-trigger'] ?? '1') === '1' || Number(ctx.inputs?.['uraku-geo-trigger'] ?? 1) > 0; return [16, 20, 24, 28, 32][r - 1] * (geo ? 2 : 1); }",
      },
      {
        id: "uraku-skill-dmg",
        label: "Elemental Skill DMG Bonus (Uraku Misugiri)",
        stat: "skillDmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const geo = (ctx.inputs?.['uraku-geo-trigger'] ?? '1') === '1' || Number(ctx.inputs?.['uraku-geo-trigger'] ?? 1) > 0; return [24, 30, 36, 42, 48][r - 1] * (geo ? 2 : 1); }",
      },
      {
        id: "uraku-def",
        label: "DEF% (Uraku Misugiri)",
        stat: "def",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
    ],
    signatureFor: ["chiori"],
  },

  // 4-STAR SWORDS (31)
  {
    id: "amenoma-kageuchi",
    varName: "amenomaKageuchi",
    name: "Amenoma Kageuchi",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "atkPct", label: "ATK%", value: 55.1, baseValue: 12.0 },
    passiveName: "Iwakura Succession",
    passiveDesc:
      "After casting an Elemental Skill, gain 1 Succession Seed (max 3). After using an Elemental Burst, all Succession Seeds are consumed, restoring 6~12 Energy per seed after 2s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "blackcliff-longsword",
    varName: "blackcliffLongsword",
    name: "Blackcliff Longsword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 36.8, baseValue: 8.0 },
    passiveName: "Press the Advantage",
    passiveDesc:
      "After defeating an opponent, ATK is increased by 12~24% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "blackcliff-stacks",
        label: "Opponents Defeated Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+12~24% ATK per defeat stack (up to +36~72%)",
      },
    ],
    buffs: [
      {
        id: "blackcliff-atk",
        label: "ATK% (Blackcliff Longsword)",
        stat: "atk",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "blackcliff-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['blackcliff-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "calamity-of-eshu",
    varName: "calamityOfEshu",
    name: "Calamity of Eshu",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Pure and True",
    passiveDesc:
      "When the equipping character has >= 70% HP, increases Normal and Charged Attack DMG by 20~40% and Normal and Charged Attack CRIT Rate by 8~16%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "calamity-eshu-hp-ge-70",
        label: "HP >= 70% (+20~40% NA/CA DMG, +8~16% CRIT)",
        control: "toggle",
        defaultValue: 1,
        hint: "Active when current HP is at or above 70%",
      },
    ],
    buffs: [
      {
        id: "eshu-na-dmg",
        label: "Normal Attack DMG Bonus (Calamity of Eshu)",
        stat: "normalDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "calamity-eshu-hp-ge-70",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? '1') === '1' || Number(ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
      {
        id: "eshu-ca-dmg",
        label: "Charged Attack DMG Bonus (Calamity of Eshu)",
        stat: "chargedDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        conditionKey: "calamity-eshu-hp-ge-70",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? '1') === '1' || Number(ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? 1) > 0; return on ? [20, 25, 30, 35, 40][r - 1] : 0; }",
      },
      {
        id: "eshu-crit-rate",
        label: "NA & CA CRIT Rate% (Calamity of Eshu)",
        stat: "critRate",
        refinementValues: [8, 10, 12, 14, 16],
        isTeamBuff: false,
        conditionKey: "calamity-eshu-hp-ge-70",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? '1') === '1' || Number(ctx.inputs?.['calamity-eshu-hp-ge-70'] ?? 1) > 0; return on ? [8, 10, 12, 14, 16][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "cinnabar-spindle",
    varName: "cinnabarSpindle",
    name: "Cinnabar Spindle",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "defPct", label: "DEF%", value: 69.0, baseValue: 15.0 },
    passiveName: "Spotless Heart",
    passiveDesc:
      "Elemental Skill DMG is increased by 40~80% of DEF. The effect will be triggered no more than once every 1.5s and will be cleared 0.1s after the Elemental Skill deals DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "cinnabar-wielder-def",
        label: "Character Total DEF",
        control: "stacks",
        max: 5000,
        defaultValue: 2500,
        hint: "Total DEF used to calculate flat Elemental Skill DMG bonus",
      },
    ],
    buffs: [
      {
        id: "cinnabar-skill-flat",
        label: "Elemental Skill Flat DMG from DEF (Cinnabar Spindle)",
        stat: "skillDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const def = Number(ctx.inputs?.['cinnabar-wielder-def'] ?? 2500); const ratio = [0.4, 0.5, 0.6, 0.7, 0.8][r - 1]; return def * ratio; }",
      },
    ],
    signatureFor: ["albedo"],
  },
  {
    id: "clash-of-kings",
    varName: "clashOfKings",
    name: "Clash of Kings",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Royal Clash",
    passiveDesc: "Increases Normal and Charged Attack DMG by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "clash-na-dmg",
        label: "Normal Attack DMG Bonus (Clash of Kings)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "clash-ca-dmg",
        label: "Charged Attack DMG Bonus (Clash of Kings)",
        stat: "chargedDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "echoes-of-the-heart",
    varName: "echoesOfTheHeart",
    name: "Echoes of the Heart",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Heart Echo",
    passiveDesc: "Elemental Skill DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "echoes-heart-skill",
        label: "Elemental Skill DMG Bonus (Echoes of the Heart)",
        stat: "skillDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "favonius-sword",
    varName: "favoniusSword",
    name: "Favonius Sword",
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
    id: "festering-desire",
    varName: "festeringDesire",
    name: "Festering Desire",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Undying Admiration",
    passiveDesc:
      "Increases Elemental Skill DMG by 16~32% and Elemental Skill CRIT Rate by 6~12%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "festering-skill-dmg",
        label: "Elemental Skill DMG Bonus (Festering Desire)",
        stat: "skillDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "festering-skill-crit",
        label: "Elemental Skill CRIT Rate% (Festering Desire)",
        stat: "critRate",
        refinementValues: [6, 7.5, 9, 10.5, 12],
        isTeamBuff: false,
        computeCode: "(r) => [6, 7.5, 9, 10.5, 12][r - 1]",
      },
    ],
  },
  {
    id: "finale-of-the-deep",
    varName: "finaleOfTheDeep",
    name: "Finale of the Deep",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "An End Sublime",
    passiveDesc:
      "When using an Elemental Skill, ATK is increased by 12~24% for 15s, and a Bond of Life equal to 25% of Max HP is granted. When the Bond of Life is cleared, a maximum of 150~300 ATK is gained based on 2.4~4.8% of the cleared Bond of Life value for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "finale-skill-active",
        label: "Skill Used (+12~24% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% ATK for 15s",
      },
      {
        id: "finale-bol-cleared-atk",
        label: "Cleared BoL Flat ATK (0-300)",
        control: "stacks",
        max: 300,
        defaultValue: 150,
        hint: "Flat ATK gained when Bond of Life is cleared (up to 150 at R1, up to 300 at R5)",
      },
    ],
    buffs: [
      {
        id: "finale-skill-atk",
        label: "ATK% (Finale of the Deep Skill)",
        stat: "atk",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "finale-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['finale-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['finale-skill-active'] ?? 1) > 0; return on ? ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "finale-cleared-flat-atk",
        label: "Flat ATK from Cleared BoL (Finale)",
        stat: "atk",
        refinementValues: [150, 187.5, 225, 262.5, 300],
        isTeamBuff: false,
        conditionKey: "finale-bol-cleared-atk",
        computeCode:
          "(r, ctx) => { const input = Number(ctx.inputs?.['finale-bol-cleared-atk'] ?? 150); const cap = [150, 187.5, 225, 262.5, 300][r - 1]; return Math.min(input, cap); }",
      },
    ],
  },
  {
    id: "fleuve-cendre-ferryman",
    varName: "fleuveCendreFerryman",
    name: "Fleuve Cendre Ferryman",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Ironbone",
    passiveDesc:
      "Increases Elemental Skill CRIT Rate by 8~16%. Additionally, increases Energy Recharge by 16~32% for 5s after using an Elemental Skill.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "fleuve-post-skill-er",
        label: "Post-Skill +16~32% ER Active",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% Energy Recharge for 5s after casting Elemental Skill",
      },
    ],
    buffs: [
      {
        id: "fleuve-skill-crit",
        label: "Elemental Skill CRIT Rate% (Fleuve Cendre)",
        stat: "critRate",
        refinementValues: [8, 10, 12, 14, 16],
        isTeamBuff: false,
        computeCode: "(r) => [8, 10, 12, 14, 16][r - 1]",
      },
      {
        id: "fleuve-er-buff",
        label: "Energy Recharge% (Fleuve Cendre Post-Skill)",
        stat: "energyRecharge",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "fleuve-post-skill-er",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['fleuve-post-skill-er'] ?? '1') === '1' || Number(ctx.inputs?.['fleuve-post-skill-er'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "flute-of-ezpitzal",
    varName: "fluteOfEzpitzal",
    name: "Flute of Ezpitzal",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "defPct", label: "DEF%", value: 69.0, baseValue: 15.0 },
    passiveName: "Smoke and Mirrors",
    passiveDesc:
      "Using an Elemental Skill increases DEF by 16~32% for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "ezpitzal-skill-def",
        label: "Skill Used (+16~32% DEF)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% DEF for 15s",
      },
    ],
    buffs: [
      {
        id: "ezpitzal-def",
        label: "DEF% (Flute of Ezpitzal)",
        stat: "def",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "ezpitzal-skill-def",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['ezpitzal-skill-def'] ?? '1') === '1' || Number(ctx.inputs?.['ezpitzal-skill-def'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "iron-sting",
    varName: "ironSting",
    name: "Iron Sting",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Infusion Stinger",
    passiveDesc:
      "Dealing Elemental DMG increases all DMG by 6~12% for 6s. Max 2 stacks. Can occur once every 1s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "iron-sting-stacks",
        label: "Infusion Stinger Stacks (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+6~12% All DMG bonus per stack (up to +12~24%)",
      },
    ],
    buffs: [
      {
        id: "iron-sting-dmg",
        label: "All DMG Bonus (Iron Sting)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "iron-sting-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['iron-sting-stacks'] ?? 2); return s * [6, 7.5, 9, 10.5, 12][r - 1]; }",
      },
    ],
  },
  {
    id: "kagotsurube-isshin",
    varName: "kagotsurubeIsshin",
    name: "Kagotsurube Isshin",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Isshin Art Clarity",
    passiveDesc:
      "When a Normal, Charged, or Plunging Attack hits an opponent, it unleashes a Hewing Gale dealing 180% ATK DMG and increases ATK by 15% for 8s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "isshin-atk-active",
        label: "Hewing Gale ATK Buff Active (+15% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+15% ATK for 8s",
      },
    ],
    buffs: [
      {
        id: "isshin-atk",
        label: "ATK% (Kagotsurube Isshin)",
        stat: "atk",
        refinementValues: [15, 15, 15, 15, 15],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "isshin-atk-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['isshin-atk-active'] ?? '1') === '1' || Number(ctx.inputs?.['isshin-atk-active'] ?? 1) > 0; return on ? (0.15 * ctx.baseAtk) : 0; }",
      },
    ],
  },
  {
    id: "lions-roar",
    varName: "lionsRoar",
    name: "Lion's Roar",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Bane of Fire and Thunder",
    passiveDesc:
      "Increases DMG against opponents affected by Pyro or Electro by 20~36%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "lions-roar-target-affected",
        label: "Target Affected by Pyro or Electro",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~36% All DMG bonus against affected enemies",
      },
    ],
    buffs: [
      {
        id: "lions-roar-dmg",
        label: "All DMG Bonus vs Pyro/Electro (Lion's Roar)",
        stat: "dmgBonus",
        refinementValues: [20, 24, 28, 32, 36],
        isTeamBuff: false,
        conditionKey: "lions-roar-target-affected",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['lions-roar-target-affected'] ?? '1') === '1' || Number(ctx.inputs?.['lions-roar-target-affected'] ?? 1) > 0; return on ? [20, 24, 28, 32, 36][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "master-key",
    varName: "masterKey",
    name: "Master Key",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Lockpick",
    passiveDesc: "Using an Elemental Burst increases ATK by 16~32% for 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "master-key-burst-active",
        label: "Burst Used (+16~32% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "master-key-atk",
        label: "ATK% (Master Key)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "master-key-burst-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['master-key-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['master-key-burst-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "prototype-rancour",
    varName: "prototypeRancour",
    name: "Prototype Rancour",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 34.5, baseValue: 7.5 },
    passiveName: "Smashed Stone",
    passiveDesc:
      "On hit, Normal or Charged Attacks increase ATK and DEF by 4~8% for 6s. Max 4 stacks. Can only occur once every 0.3s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "rancour-stacks",
        label: "Smashed Stone Stacks (0-4)",
        control: "stacks",
        max: 4,
        defaultValue: 4,
        hint: "+4~8% ATK and DEF per stack (up to +16~32%)",
      },
    ],
    buffs: [
      {
        id: "rancour-atk",
        label: "ATK% (Prototype Rancour Stacks)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "rancour-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['rancour-stacks'] ?? 4); return ((s * [4, 5, 6, 7, 8][r - 1]) / 100) * ctx.baseAtk; }",
      },
      {
        id: "rancour-def",
        label: "DEF% (Prototype Rancour Stacks)",
        stat: "def",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "rancour-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['rancour-stacks'] ?? 4); return s * [4, 5, 6, 7, 8][r - 1]; }",
      },
    ],
  },
  {
    id: "royal-longsword",
    varName: "royalLongsword",
    name: "Royal Longsword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
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
        label: "CRIT Rate% (Royal Longsword Focus)",
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
    id: "sacrificial-sword",
    varName: "sacrificialSword",
    name: "Sacrificial Sword",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 61.3, baseValue: 13.3 },
    passiveName: "Composed",
    passiveDesc:
      "After dealing damage to an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
    isSupport: true,
    buffType: "self",
    buffs: [],
  },
  {
    id: "sapwood-blade",
    varName: "sapwoodBlade",
    name: "Sapwood Blade",
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
        id: "sapwood-leaf-picked",
        label: "Leaf of Consciousness Picked Up",
        control: "toggle",
        defaultValue: 1,
        hint: "+60~120 EM for 12s to picking party member",
      },
    ],
    buffs: [
      {
        id: "sapwood-party-em",
        label: "Party EM (Sapwood Blade Leaf of Consciousness)",
        description: "Picking up the Leaf of Consciousness grants +60~120 Elemental Mastery for 12s",
        stat: "em",
        refinementValues: [60, 75, 90, 105, 120],
        isTeamBuff: true,
        conditionKey: "sapwood-leaf-picked",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['sapwood-leaf-picked'] ?? '1') === '1' || Number(ctx.inputs?.['sapwood-leaf-picked'] ?? 1) > 0; return on ? [60, 75, 90, 105, 120][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "sequence-of-solitude",
    varName: "sequenceOfSolitude",
    name: "Sequence of Solitude",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 36.8, baseValue: 8.0 },
    passiveName: "Solitude",
    passiveDesc: "Increases Normal and Charged Attack DMG by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "solitude-na-dmg",
        label: "Normal Attack DMG Bonus (Sequence of Solitude)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "solitude-ca-dmg",
        label: "Charged Attack DMG Bonus (Sequence of Solitude)",
        stat: "chargedDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "sturdy-bone",
    varName: "sturdyBone",
    name: "Sturdy Bone",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Sprint and Strike",
    passiveDesc:
      "Sprinting or Alternate Sprinting Stamina consumption is decreased by 15%. After sprinting, Normal and Charged Attack DMG is increased by 16~32% of ATK for 6s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "sturdy-sprint-active",
        label: "Post-Sprint Active (+16~32% of ATK as Flat NA/CA DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% of ATK as flat NA/CA DMG for 6s",
      },
    ],
    buffs: [
      {
        id: "sturdy-bone-na-flat",
        label: "Normal Attack Flat DMG from ATK (Sturdy Bone)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "sturdy-sprint-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['sturdy-sprint-active'] ?? '1') === '1' || Number(ctx.inputs?.['sturdy-sprint-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "sturdy-bone-ca-flat",
        label: "Charged Attack Flat DMG from ATK (Sturdy Bone)",
        stat: "chargedDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "sturdy-sprint-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['sturdy-sprint-active'] ?? '1') === '1' || Number(ctx.inputs?.['sturdy-sprint-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "sword-of-descension",
    varName: "swordOfDescension",
    name: "Sword of Descension",
    rarity: 4,
    baseAtk: 440,
    lvl1BaseAtk: 39,
    subStat: { type: "atkPct", label: "ATK%", value: 35.2, baseValue: 7.7 },
    passiveName: "Descension",
    passiveDesc:
      "Hitting opponents with Normal and Charged Attacks grants a 50% chance to deal 200% ATK as DMG. In addition, if the Traveler equips the Sword of Descension, their ATK is increased by 66.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "descension-traveler-atk",
        label: "Flat ATK for Traveler (Sword of Descension)",
        stat: "atk",
        refinementValues: [66, 66, 66, 66, 66],
        isTeamBuff: false,
        computeCode: "(r) => 66",
      },
    ],
  },
  {
    id: "sword-of-narzissenkreuz-pneuma",
    varName: "swordOfNarzissenkreuzPneuma",
    name: "Sword of Narzissenkreuz Pneuma",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Hero's Blade: Pneuma",
    passiveDesc:
      "When the equipping character does not have an Arkhe: When Normal, Charged, or Plunging Attacks hit, a Pneuma or Ousia energy blast will be unleashed, dealing 160~320% of ATK as DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "the-alley-flash",
    varName: "theAlleyFlash",
    name: "The Alley Flash",
    rarity: 4,
    baseAtk: 620,
    lvl1BaseAtk: 45,
    subStat: { type: "em", label: "Elemental Mastery", value: 55, baseValue: 12 },
    passiveName: "Itinerant Hero",
    passiveDesc:
      "Increases DMG dealt by the character equipping this weapon by 12~24%. Taking DMG disables this effect for 5s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "alley-flash-unhit",
        label: "Not Damaged Within 5s (Active DMG Buff)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% All DMG bonus when not taking DMG",
      },
    ],
    buffs: [
      {
        id: "alley-flash-dmg",
        label: "All DMG Bonus (The Alley Flash)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "alley-flash-unhit",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['alley-flash-unhit'] ?? '1') === '1' || Number(ctx.inputs?.['alley-flash-unhit'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "the-black-sword",
    varName: "theBlackSword",
    name: "The Black Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Justice",
    passiveDesc:
      "Increases DMG dealt by Normal and Charged Attacks by 20~40%. Additionally, regenerates 60~100% of ATK as HP when Normal and Charged Attacks score a CRIT Hit.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "black-sword-na-dmg",
        label: "Normal Attack DMG Bonus (The Black Sword)",
        stat: "normalDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "black-sword-ca-dmg",
        label: "Charged Attack DMG Bonus (The Black Sword)",
        stat: "chargedDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
    ],
  },
  {
    id: "the-dockhands-assistant",
    varName: "theDockhandsAssistant",
    name: "The Dockhand's Assistant",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Sea Shanty",
    passiveDesc:
      "When the equipping character is healed or heals others, gain a Stoic's Symbol for 30s (max 3). Using an Elemental Skill or Burst consumes all symbols to grant 40~80 EM per symbol for 10s and restore 2~4 Energy per symbol.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "dockhand-symbols",
        label: "Stoic Symbols Consumed (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+40~80 EM per symbol (up to +120~240 EM)",
      },
    ],
    buffs: [
      {
        id: "dockhand-em",
        label: "Elemental Mastery (The Dockhand's Assistant)",
        stat: "em",
        refinementValues: [120, 150, 180, 210, 240],
        isTeamBuff: false,
        conditionKey: "dockhand-symbols",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['dockhand-symbols'] ?? 3); return s * [40, 50, 60, 70, 80][r - 1]; }",
      },
    ],
  },
  {
    id: "the-flute",
    varName: "theFlute",
    name: "The Flute",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Chord",
    passiveDesc:
      "Normal or Charged Attacks grant Harmonics on hits (max 5). At 5 Harmonics, deals 100~200% ATK DMG to surrounding opponents.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "toukabou-shigure",
    varName: "toukabouShigure",
    name: "Toukabou Shigure",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Kaidan: Rain-Tied Yuka",
    passiveDesc:
      "After an attack hits an opponent, it will inflict an instance of Cursed Parasol upon one of them for 10s. The character wielding this weapon will deal 16~32% more DMG to the opponent affected by Cursed Parasol.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "cursed-parasol-active",
        label: "Target Affected by Cursed Parasol",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% DMG dealt to the afflicted opponent",
      },
    ],
    buffs: [
      {
        id: "shigure-dmg-bonus",
        label: "All DMG Bonus vs Parasol Target (Toukabou Shigure)",
        stat: "dmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "cursed-parasol-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['cursred-parasol-active'] ?? ctx.inputs?.['cursed-parasol-active'] ?? '1') === '1' || Number(ctx.inputs?.['cursed-parasol-active'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "wolf-fang",
    varName: "wolfFang",
    name: "Wolf-Fang",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Northwind Wolf",
    passiveDesc:
      "DMG dealt by Elemental Skill and Elemental Burst is increased by 16~32%. When an Elemental Skill or Burst hits an opponent, its CRIT Rate will be increased by 2~4% (max 4 stacks each = +8~16%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "wolf-fang-skill-stacks",
        label: "Elemental Skill CRIT Stacks (0-4)",
        control: "stacks",
        max: 4,
        defaultValue: 4,
        hint: "+2~4% Skill CRIT Rate per stack (up to +8~16%)",
      },
      {
        id: "wolf-fang-burst-stacks",
        label: "Elemental Burst CRIT Stacks (0-4)",
        control: "stacks",
        max: 4,
        defaultValue: 4,
        hint: "+2~4% Burst CRIT Rate per stack (up to +8~16%)",
      },
    ],
    buffs: [
      {
        id: "wolf-fang-base-skill-dmg",
        label: "Elemental Skill DMG Bonus (Wolf-Fang Base)",
        stat: "skillDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "wolf-fang-base-burst-dmg",
        label: "Elemental Burst DMG Bonus (Wolf-Fang Base)",
        stat: "burstDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "wolf-fang-skill-crit",
        label: "Elemental Skill CRIT Rate% (Wolf-Fang Stacks)",
        stat: "critRate",
        refinementValues: [8, 10, 12, 14, 16],
        isTeamBuff: false,
        conditionKey: "wolf-fang-skill-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['wolf-fang-skill-stacks'] ?? 4); return s * [2, 2.5, 3, 3.5, 4][r - 1]; }",
      },
      {
        id: "wolf-fang-burst-crit",
        label: "Elemental Burst CRIT Rate% (Wolf-Fang Stacks)",
        stat: "critRate",
        refinementValues: [8, 10, 12, 14, 16],
        isTeamBuff: false,
        conditionKey: "wolf-fang-burst-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['wolf-fang-burst-stacks'] ?? 4); return s * [2, 2.5, 3, 3.5, 4][r - 1]; }",
      },
    ],
  },
  {
    id: "xiphos-moonlight",
    varName: "xiphosMoonlight",
    name: "Xiphos' Moonlight",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Jinni's Whispers",
    passiveDesc:
      "The following effect will trigger every 10s: The equipping character will gain 0.036~0.072% Energy Recharge for each point of Elemental Mastery they possess for 12s, with nearby party members gaining 30% of this buff for the same duration.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "xiphos-wielder-em",
        label: "Wielder's Elemental Mastery (e.g. 1000)",
        control: "stacks",
        max: 2000,
        defaultValue: 1000,
        hint: "Used to compute ER% gained by wielder and party",
      },
    ],
    buffs: [
      {
        id: "xiphos-self-er",
        label: "Self Energy Recharge% (Xiphos' Moonlight)",
        stat: "energyRecharge",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const em = Number(ctx.inputs?.['xiphos-wielder-em'] ?? 1000); const perEm = [0.00036, 0.00045, 0.00054, 0.00063, 0.00072][r - 1]; return em * perEm * 100; }",
      },
      {
        id: "xiphos-party-er",
        label: "Party Energy Recharge% (Xiphos' Moonlight)",
        description: "Nearby party members gain 30% of the wielder's Energy Recharge buff",
        stat: "energyRecharge",
        refinementValues: [10.8, 13.5, 16.2, 18.9, 21.6],
        isTeamBuff: true,
        computeCode:
          "(r, ctx) => { const em = Number(ctx.inputs?.['xiphos-wielder-em'] ?? 1000); const perEm = [0.00036, 0.00045, 0.00054, 0.00063, 0.00072][r - 1]; return em * perEm * 0.3 * 100; }",
      },
    ],
  },

  // 3-STAR SWORDS (6)
  {
    id: "cool-steel",
    varName: "coolSteel",
    name: "Cool Steel",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "atkPct", label: "ATK%", value: 35.2, baseValue: 7.7 },
    passiveName: "Bane of Water and Ice",
    passiveDesc:
      "Increases DMG against opponents affected by Hydro or Cryo by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "cool-steel-target-affected",
        label: "Target Affected by Hydro or Cryo",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% All DMG bonus against affected enemies",
      },
    ],
    buffs: [
      {
        id: "cool-steel-dmg",
        label: "All DMG Bonus vs Hydro/Cryo (Cool Steel)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "cool-steel-target-affected",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['cool-steel-target-affected'] ?? '1') === '1' || Number(ctx.inputs?.['cool-steel-target-affected'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "dark-iron-sword",
    varName: "darkIronSword",
    name: "Dark Iron Sword",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "em", label: "Elemental Mastery", value: 141, baseValue: 31 },
    passiveName: "Overloaded",
    passiveDesc:
      "Upon causing an Overloaded, Superconduct, Electro-Charged, Quicken, Aggravate, Hyperbloom, or Electro-infused Swirl reaction, ATK is increased by 20~40% for 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "dark-iron-reaction-active",
        label: "Electro Reaction Triggered Active",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~40% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "dark-iron-atk",
        label: "ATK% (Dark Iron Sword)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "dark-iron-reaction-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['dark-iron-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['dark-iron-reaction-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "fillet-blade",
    varName: "filletBlade",
    name: "Fillet Blade",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "atkPct", label: "ATK%", value: 35.2, baseValue: 7.7 },
    passiveName: "Gash",
    passiveDesc:
      "On hit, has 50% chance to deal 240~400% ATK DMG to a single opponent. Can only occur once every 15~11s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "harbinger-of-dawn",
    varName: "harbingerOfDawn",
    name: "Harbinger of Dawn",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 46.9, baseValue: 10.2 },
    passiveName: "Skypiercing",
    passiveDesc:
      "When HP is above 90%, increases CRIT Rate by 14~28%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "harbinger-hp-gt-90",
        label: "HP > 90% (+14~28% CRIT Rate)",
        control: "toggle",
        defaultValue: 1,
        hint: "Active when current HP is above 90%",
      },
    ],
    buffs: [
      {
        id: "harbinger-crit-rate",
        label: "CRIT Rate% (Harbinger of Dawn)",
        stat: "critRate",
        refinementValues: [14, 17.5, 21, 24.5, 28],
        isTeamBuff: false,
        conditionKey: "harbinger-hp-gt-90",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['harbinger-hp-gt-90'] ?? '1') === '1' || Number(ctx.inputs?.['harbinger-hp-gt-90'] ?? 1) > 0; return on ? [14, 17.5, 21, 24.5, 28][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "skyrider-sword",
    varName: "skyriderSword",
    name: "Skyrider Sword",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 51.7, baseValue: 11.3 },
    passiveName: "Determination",
    passiveDesc:
      "Using an Elemental Burst increases ATK and Movement SPD by 12~24% for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "skyrider-burst-active",
        label: "Burst Used (+12~24% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% ATK for 15s",
      },
    ],
    buffs: [
      {
        id: "skyrider-atk",
        label: "ATK% (Skyrider Sword)",
        stat: "atk",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "skyrider-burst-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['skyrider-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['skyrider-burst-active'] ?? 1) > 0; return on ? ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "travelers-handy-sword",
    varName: "travelersHandySword",
    name: "Traveler's Handy Sword",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "defPct", label: "DEF%", value: 29.3, baseValue: 6.4 },
    passiveName: "Journey",
    passiveDesc:
      "Each Elemental Orb or Particle collected restores 1~2% HP.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },

  // 2-STAR & 1-STAR SWORDS (2)
  {
    id: "silver-sword",
    varName: "silverSword",
    name: "Silver Sword",
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
    id: "dull-blade",
    varName: "dullBlade",
    name: "Dull Blade",
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
function generateWeaponFile(w: SwordDefinition): string {
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
  type: "Sword",
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

// Generate all files
const swordsDir = path.resolve("src/data/registry/weapons/swords");

// Remove tamayuratei-no-ohanashi.ts if it exists in swords
const tamayurateiPath = path.join(swordsDir, "tamayuratei-no-ohanashi.ts");
if (fs.existsSync(tamayurateiPath)) {
  fs.unlinkSync(tamayurateiPath);
  console.log("Removed tamayuratei-no-ohanashi.ts from swords folder.");
}

for (const w of COMPLETE_SWORDS) {
  const filePath = path.join(swordsDir, `${w.id}.ts`);
  const content = generateWeaponFile(w);
  fs.writeFileSync(filePath, content, "utf-8");
}

// Update swords/index.ts
const imports = COMPLETE_SWORDS.map((w) => `import { ${w.varName} } from "./${w.id}";`).join("\n");
const names = COMPLETE_SWORDS.map((w) => w.varName).join(",\n  ");

const indexContent = `${imports}
import type { WeaponConfig } from "../types";

export {
  ${names},
};

export const SWORDS: WeaponConfig[] = [
  ${names},
];
`;

fs.writeFileSync(path.join(swordsDir, "index.ts"), indexContent, "utf-8");

console.log(`Successfully generated ${COMPLETE_SWORDS.length} sword files and updated swords/index.ts.`);
