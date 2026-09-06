import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const xilonen: CharacterConfig = {
  id: "xilonen",
  name: "Xilonen",
  rarity: 5,
  element: "Geo",
  weapon: "Sword",
  scalingSource: "def",
  ascensionStat: { label: "DEF%", maxValue: 36.0 },
  dmgBonusLabel: "Geo DMG Bonus%",
  stats: coreStats("Geo DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Ehecatl's Roar",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG ×2 (each)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "charged", name: "Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "plunge", name: "Plunge DMG", scaling: "def", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "def", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "def", hitCategory: "plunge", element: "Physical" },
        { key: "blade-roller-1", name: "Blade Roller 1-Hit DMG", scaling: "def", hitCategory: "normal", element: "Geo" },
        { key: "blade-roller-2", name: "Blade Roller 2-Hit DMG", scaling: "def", hitCategory: "normal", element: "Geo" },
        { key: "blade-roller-3", name: "Blade Roller 3-Hit DMG", scaling: "def", hitCategory: "normal", element: "Geo" },
        { key: "blade-roller-4", name: "Blade Roller 4-Hit DMG", scaling: "def", hitCategory: "normal", element: "Geo" },
      ],
    },
    {
      type: "skill",
      name: "Elemental Skill — Yohual's Scratch",
      hits: [
        { key: "rush-dmg", name: "Rush DMG", scaling: "def", hitCategory: "skill", element: "Geo" },
      ],
    },
    {
      type: "burst",
      name: "Elemental Burst — Ocelotlicue Point!",
      hits: [
        { key: "burst-dmg", name: "Skill DMG", scaling: "def", hitCategory: "burst", element: "Geo" },
        { key: "follow-up-beat", name: "Follow-Up Beat DMG (Ardent Rhythm)", scaling: "def", hitCategory: "burst", element: "Geo" },
        { key: "burst-heal", name: "Continuous Healing (Ebullient Rhythm)", scaling: "def", kind: "heal" },
      ],
    },
  ],
  mechanics: [
    "Nightsoul's Blessing (Blade Roller): Normal Attacks convert to 4-hit roller blade strikes scaling with DEF and dealing Nightsoul-aligned Geo DMG.",
    "Source Samples: Initial 3 Geo Samples. Converts 1 Sample to Pyro/Hydro/Cryo/Electro (PHEC) for each party member of that element. When active, decreases nearby enemies' corresponding Elemental RES (36% at Lv10).",
    "Netotiliztli's Echoes (A1): In Nightsoul's Blessing, if < 2 PHEC teammates (Geo DPS mode), Normal and Plunging Attacks deal +30% increased DMG. If >= 2 PHEC teammates, Normal/Plunging hits generate 35 Nightsoul points.",
    "Portable Armored Sheath (A4): When nearby party members trigger Nightsoul Burst, Xilonen's DEF is increased by 20% for 15s.",
    "Chiucue Mix (C2): Geo Source Sample remains always active. Active Source Samples grant: Geo DMG +50%, Pyro ATK +45%, Hydro Max HP +45%, Cryo CRIT DMG +60%, Electro Energy restore.",
    "Suchitl's Trance (C4): Using Yohual's Scratch grants Blooming Blessing: increases Normal, Charged, and Plunging Attack DMG by 65% of Xilonen's DEF for 6 hits.",
    "Imperishable Night Carnival (C6): Extends Nightsoul's Blessing by 5s without consuming points, adds +300% DEF as Flat DMG to Normal and Plunging Attacks, and heals party members for 120% DEF every 1.5s.",
  ],
  mechanicDefs: [
    {
      id: "nightsoul-state",
      label: "Nightsoul's Blessing State (Blade Roller)",
      control: "toggle",
      defaultValue: 1,
      hint: "Xilonen enters Blade Roller mode, performing roller blade kicks scaling with DEF and dealing Nightsoul-aligned Geo DMG.",
    },
    {
      id: "source-samples-geo-dps",
      label: "Geo DPS Mode (< 2 PHEC Teammates, +30% NA/Plunge DMG & Burst Beats)",
      control: "toggle",
      defaultValue: 1,
      hint: "When fewer than 2 Source Samples are changed to PHEC elements: A1 grants +30% Normal/Plunging DMG Bonus, and Burst triggers Ardent Rhythm with 2 Follow-Up Beats.",
    },
    {
      id: "source-samples-active",
      label: "Source Samples Active (Skill RES Shred)",
      control: "toggle",
      defaultValue: 1,
      hint: "Active Source Samples decrease nearby opponents' corresponding Elemental RES (36% at Lv10, 45% at Lv13).",
    },
    {
      id: "a4-nightsoul-burst",
      label: "A4 Portable Armored Sheath (+20% DEF)",
      control: "toggle",
      defaultValue: 1,
      hint: "When nearby party members trigger a Nightsoul Burst, Xilonen's DEF is increased by 20% for 15s.",
    },
    {
      id: "c2-chiucue-mix",
      label: "C2 Chiucue Mix Active (+50% Geo DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Requires C2. Geo Source Sample is always active and grants +50% Geo DMG Bonus.",
    },
    {
      id: "c2-geo",
      label: "C2 Chiucue Mix: Geo Party Member (+50% DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Requires C2. Grants +50% Geo / All DMG Bonus to Geo party members.",
    },
    {
      id: "c2-pyro",
      label: "C2 Chiucue Mix: Pyro Party Member (+45% ATK)",
      control: "toggle",
      defaultValue: 0,
      hint: "Requires C2. Grants +45% of Base ATK to Pyro party members.",
    },
    {
      id: "c2-hydro",
      label: "C2 Chiucue Mix: Hydro Party Member (+45% HP)",
      control: "toggle",
      defaultValue: 0,
      hint: "Requires C2. Grants +45% of Base HP to Hydro party members.",
    },
    {
      id: "c2-cryo",
      label: "C2 Chiucue Mix: Cryo Party Member (+60% CRIT DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Requires C2. Grants +60% CRIT DMG to Cryo party members.",
    },
    {
      id: "c4-blooming-blessing",
      label: "C4 Suchitl's Trance: Blooming Blessing (+65% DEF Flat DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Requires C4. After using Skill, Normal, Charged, and Plunging Attacks deal +65% of Xilonen's DEF as Flat DMG for 6 hits.",
    },
    {
      id: "c6-imperishable-night",
      label: "C6 Imperishable Night Carnival (+300% DEF Flat DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Requires C6. Normal and Plunging Attacks deal an additional 300% of Xilonen's DEF as Flat DMG during Imperishable Night's Blessing.",
    },
  ],
  wikiTalents: [
    {
      name: "Ehecatl's Roar",
      type: "Normal Attack",
      description:
        "Normal Attack: Performs up to 3 rapid strikes. Charged Attack: Consumes Stamina and performs a forward kick. Plunging Attack: Plunges from mid-air based on DEF. Nightsoul's Blessing: Blade Roller: While in this mode, Normal Attacks perform up to 4 kicks using roller blades scaling with DEF and dealing Nightsoul-aligned Geo DMG that cannot be overridden.",
    },
    {
      name: "Yohual's Scratch",
      type: "Elemental Skill",
      description:
        "Rushes forward dealing Nightsoul-aligned Geo DMG based on DEF, gaining 45 Nightsoul points and entering Nightsoul's Blessing in Blade Roller mode. Has 3 Source Samples that can change to Pyro/Hydro/Cryo/Electro based on teammates. When Nightsoul points hit maximum, consumes points and activates the 3 Source Samples for 15s, decreasing nearby opponents' corresponding Elemental RES (36% at Lv10). CD 7s.",
    },
    {
      name: "Ocelotlicue Point!",
      type: "Elemental Burst",
      description:
        "Deals Nightsoul-aligned AoE Geo DMG based on DEF. If at least 2 Source Samples are changed to PHEC elements, plays Ebullient rhythm, healing active characters periodically based on DEF. If fewer than 2 Source Samples are changed, plays Ardent rhythm, dealing two additional beats of AoE Geo DMG based on DEF. Energy Cost 60, CD 15s.",
    },
    {
      name: "Netotiliztli's Echoes",
      type: "Passive Talent",
      description:
        "While in Nightsoul's Blessing: If Xilonen has at least 2 Source Samples that have had their Elemental Types changed, gains 35 Nightsoul points when Normal or Plunging Attacks hit opponents. If fewer than 2 Source Samples have changed, Normal and Plunging Attacks deal 30% increased DMG.",
    },
    {
      name: "Portable Armored Sheath",
      type: "Passive Talent",
      description:
        "While in Nightsoul's Blessing, when Nightsoul points reach the maximum, triggers an effect equal to Nightsoul Burst (CD 14s). Additionally, when nearby party members trigger a Nightsoul Burst, Xilonen's DEF is increased by 20% for 15s.",
    },
    {
      name: "Blessing of Forge-Fire",
      type: "Night Realm's Gift Passive",
      description:
        "While in an area with Phlogiston Mechanics within Natlan, can use Nightsoul Transmission: Xilonen. When active character is sprinting, climbing, or in a specific state in Natlan, switching to Xilonen enters Nightsoul's Blessing with 20 Nightsoul points.",
    },
    {
      name: "Tour of Tepeilhuitl",
      type: "Utility Passive",
      description:
        "While in an area with Phlogiston Mechanics within Natlan, interacting with harvestable items restores 15 Phlogiston. Additionally, displays the location of nearby resources unique to Natlan on the mini-map.",
    },
  ],
  constellations: [
    {
      level: 1,
      name: "Sabbatical Phrase",
      description:
        "Nightsoul point and Phlogiston consumption in Nightsoul's Blessing is decreased by 30%, and Nightsoul point time limit is extended by 45%. When Source Samples are active, increases active characters' interruption resistance.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "Chiucue Mix",
      description:
        "Geo Source Sample will always remain active. Additionally, active Source Samples grant nearby party members effects based on matching elemental type: Geo DMG +50%, Pyro ATK +45%, Hydro Max HP +45%, Cryo CRIT DMG +60%, Electro restore 25 Energy and decrease Burst CD by 6s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "Tonalpohualli's Loop",
      description: "Increases the Level of Yohual's Scratch by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 4,
      name: "Suchitl's Trance",
      description:
        "After using Yohual's Scratch, grants Blooming Blessing for 15s: party members deal 65% of Xilonen's DEF as increased Normal, Charged, and Plunging Attack DMG for 6 hits.",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "Tlaltecuhtli's Crossfade",
      description: "Increases the Level of Ocelotlicue Point! by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 6,
      name: "Imperishable Night Carnival",
      description:
        "When in Nightsoul's Blessing, sprinting, leaping, or using Normal/Plunging Attacks grants Imperishable Night's Blessing for 5s: pauses time limit, points do not decrease, deals 300% of DEF as increased Normal and Plunging Attack DMG, and heals party members for 120% DEF every 1.5s.",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description:
      "Premier 5-star Geo support providing universal team-wide Elemental RES Shred (36% at Lv10, 45% at Lv13) for Geo and active PHEC elements, massive C2 team buffs (+50% Geo DMG, +45% Pyro ATK, +45% Hydro HP, +60% Cryo CRIT DMG), C4 +65% DEF flat attack DMG, and team healing.",
    buffExplanations: [
      {
        name: "Yohual's Scratch: Source Sample RES Shred",
        brief: "-36% Elemental RES Shred (Lv10)",
        full: "While Source Samples are active, nearby opponents' corresponding Elemental RES (Geo and changed Pyro/Hydro/Cryo/Electro) is decreased by 36% at Skill Lv10 (up to 45% at Skill Lv13 with C3).",
        category: "elemental",
      },
      {
        name: "C2: Chiucue Mix",
        brief: "Geo +50% DMG, Pyro +45% ATK, Hydro +45% HP, Cryo +60% CD",
        full: "Active Source Samples grant nearby party members effects matching their Element: Geo DMG +50%, Pyro ATK +45% of base ATK, Hydro Max HP +45% of base HP, Cryo CRIT DMG +60%. Requires C2.",
        category: "stat_share",
      },
      {
        name: "C4: Suchitl's Trance (Blooming Blessing)",
        brief: "+65% DEF Flat Normal/Charged/Plunge DMG",
        full: "Grants party members Blooming Blessing: deals 65% of Xilonen's DEF as increased Normal, Charged, and Plunging Attack DMG for 6 hits. Requires C4.",
        category: "flat_dmg",
      },
    ],
    statFields: [
      { key: "def", label: "DEF", defaultValue: "930", hasBaseAndFlat: true },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "enemyRes",
        label: "Elemental RES Shred (Xilonen Skill)",
        compute: (ctx) => {
          if ((ctx.inputs["source-samples-active"] ?? 1) <= 0) return 0;
          const rawSkillLv = ctx.talentLevels?.skill ? Number(ctx.talentLevels.skill) : 10;
          const effectiveSkillLv = rawSkillLv <= 10
            ? (ctx.constellationLevel >= 3 ? rawSkillLv + 3 : rawSkillLv)
            : (ctx.constellationLevel >= 3 ? rawSkillLv : Math.max(1, rawSkillLv - 3));
          const clampedLv = Math.min(14, Math.max(1, effectiveSkillLv));
          const resShred = 9 + (clampedLv - 1) * 3;
          return -resShred;
        },
      },
      {
        stat: "dmgBonus",
        label: "Geo DMG (Xilonen C2 Chiucue Mix)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          if ((ctx.inputs["c2-geo"] ?? 0) <= 0) return 0;
          return 50;
        },
      },
      {
        stat: "atk",
        label: "Pyro ATK (Xilonen C2 Chiucue Mix)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          if ((ctx.inputs["c2-pyro"] ?? 0) <= 0) return 0;
          const baseAtk = ctx.baseAtk || 800;
          return 0.45 * baseAtk;
        },
      },
      {
        stat: "hp",
        label: "Hydro Max HP (Xilonen C2 Chiucue Mix)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          if ((ctx.inputs["c2-hydro"] ?? 0) <= 0) return 0;
          const baseHp = ctx.baseHp || 15000;
          return 0.45 * baseHp;
        },
      },
      {
        stat: "critDmg",
        label: "Cryo CRIT DMG (Xilonen C2 Chiucue Mix)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          if ((ctx.inputs["c2-cryo"] ?? 0) <= 0) return 0;
          return 60;
        },
      },
      {
        stat: "flatDmgBonus",
        label: "Normal/Charged/Plunge Flat DMG (Xilonen C4 Blooming Blessing)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 4) return 0;
          if ((ctx.inputs["c4-blooming-blessing"] ?? 1) <= 0) return 0;
          return 0.65 * ctx.def;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      const rawSkillLv = ctx.talentLevels?.skill ? Number(ctx.talentLevels.skill) : 10;
      const effectiveSkillLv = rawSkillLv <= 10
        ? (ctx.constellationLevel >= 3 ? rawSkillLv + 3 : rawSkillLv)
        : (ctx.constellationLevel >= 3 ? rawSkillLv : Math.max(1, rawSkillLv - 3));
      const clampedLv = Math.min(14, Math.max(1, effectiveSkillLv));
      const resShred = 9 + (clampedLv - 1) * 3;
      return [
        { label: "Total DEF", value: fmt(ctx.def) },
        { label: "RES Shred", value: `-${resShred}%` },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
