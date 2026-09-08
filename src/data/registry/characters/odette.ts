import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";
import { stellarConductFieldBuffs } from "../../../lib/engine/stellar";

export const odette: CharacterConfig = {
  id: "odette",
  name: "Odette",
  rarity: 5,
  element: "Cryo",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Cryo DMG Bonus%",
  stats: coreStats("Cryo DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Snow Swan Variation",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit-a", name: "3-Hit DMG (Hit 1)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit-b", name: "3-Hit DMG (Hit 2)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        atkCharged("charged", "Charged Attack DMG"),
        atkPlunge("plunge", "Plunge DMG"),
        atkPlunge("low-plunge", "Low Plunge DMG"),
        atkPlunge("high-plunge", "High Plunge DMG"),
      ],
    },
    {
      type: "skill",
      name: "Elemental Skill — Adagio: Phantom Night Dancers",
      hits: [
        atk("skill-dmg", "Skill DMG"),
        atk("coda-dot", "Coda at Dawn's Tolling DoT (×3)"),
        { key: "coda-stellar-conduct", name: "Coda Finisher (Radiance: Stellar-Conduct)", scaling: "atk", hitCategory: "skill", direct: "stellar", stellarType: "stellar-conduct", element: "Cryo" },
        { key: "coda-stellar-swirl", name: "Coda Finisher (Radiance: Stellar Swirl)", scaling: "atk", hitCategory: "skill", direct: "stellar", stellarType: "stellar-swirl", element: "Cryo" },
        atk("plume-dance", "Solo Dance Double: Plume Dance Move"),
        { key: "plume-stellar-conduct", name: "Solo Dance Double: Plume Dance (Radiance: Stellar-Conduct)", scaling: "atk", hitCategory: "skill", direct: "stellar", stellarType: "stellar-conduct", element: "Cryo" },
        { key: "plume-stellar-swirl", name: "Solo Dance Double: Plume Dance (Radiance: Stellar Swirl)", scaling: "atk", hitCategory: "skill", direct: "stellar", stellarType: "stellar-swirl", element: "Cryo" },
        atk("wing-dance", "Solo Dance Double: Wing Dance Move"),
        { key: "wing-stellar-conduct", name: "Solo Dance Double: Wing Dance (Radiance: Stellar-Conduct)", scaling: "atk", hitCategory: "skill", direct: "stellar", stellarType: "stellar-conduct", element: "Cryo" },
        { key: "wing-stellar-swirl", name: "Solo Dance Double: Wing Dance (Radiance: Stellar Swirl)", scaling: "atk", hitCategory: "skill", direct: "stellar", stellarType: "stellar-swirl", element: "Cryo" },
        { key: "c1-stellar-conduct", name: "C1 Additional Finisher (Radiance: Stellar-Conduct)", scaling: "atk", hitCategory: "special", direct: "stellar", stellarType: "stellar-conduct", element: "Cryo" },
        { key: "c1-stellar-swirl", name: "C1 Additional Finisher (Radiance: Stellar Swirl)", scaling: "atk", hitCategory: "special", direct: "stellar", stellarType: "stellar-swirl", element: "Cryo" },
      ],
    },
    {
      type: "burst",
      name: "Elemental Burst — Presto: Bluebird Finale",
      hits: [
        atk("burst-slash", "Slash DMG (×3)"),
        atk("final-slash", "Final Slash DMG"),
        { key: "c4-coord-stellar-conduct", name: "C4 Coordinated Attack (Radiance: Stellar-Conduct)", scaling: "atk", hitCategory: "special", direct: "stellar", stellarType: "stellar-conduct", element: "Cryo" },
        { key: "c4-coord-stellar-swirl", name: "C4 Coordinated Attack (Radiance: Stellar Swirl)", scaling: "atk", hitCategory: "special", direct: "stellar", stellarType: "stellar-swirl", element: "Cryo" },
      ],
    },
  ],
  mechanicDefs: [
    {
      id: "polestar-field",
      label: "Polestar Field active",
      control: "toggle",
      defaultValue: 1,
      hint: "Stellar-Conduct field: activates Radiance: Stellar-Conduct (priority over Stellar Swirl); BRC from recorded hits; +20–40% Cryo DMG on non-stellar hits; -40% Phys RES",
    },
    {
      id: "polestar-hits",
      label: "Polestar recorded hits",
      control: "stacks",
      max: 12,
      defaultValue: 0,
      hint: "Cryo/Electro hits stored by the field: BRC 1.00 → 1.45…2.00; Cryo/Electro DMG Bonus 20% → 29…40%",
    },
    {
      id: "radiance-stellar-swirl",
      label: "Radiance: Stellar Swirl active",
      control: "toggle",
      defaultValue: 0,
      hint: "Party Stellar Swirl triggers Radiance: Stellar Swirl (8s); direct hits deal Stellar Swirl DMG (inactive if Polestar Field is active)",
    },
    {
      id: "solo-dance-double",
      label: "Solo Dance Double on field",
      control: "toggle",
      defaultValue: 1,
      hint: "Enables Solo Dance Double periodic Plume & Wing attacks and C2 RES shred",
    },
    {
      id: "marvelous-splendor-stacks",
      label: "Marvelous Splendor stacks (A1 / C1)",
      control: "stacks",
      max: 6,
      defaultValue: 4,
      hint: "A1: +15% Stellar Glimmer DMG per stack (max 4, or 6 at C1+). C2: +7% ATK per stack. C6: stacks no longer decrease.",
    },
    {
      id: "snow-swans-dream",
      label: "Snow Swan's Dream active (Burst)",
      control: "toggle",
      defaultValue: 1,
      hint: "+14% to +62% (scaling with Burst level) Stellar Glimmer reaction DMG bonus to Odette. C4: +50% of this bonus to other party members.",
    },
  ],
  mechanics: [
    "Radiance: Stellar Glimmer (Stellar-Conduct / Stellar Swirl) rows are reaction DMG: they ignore standard DMG Bonus% and enemy DEF, use EM bonus 6·EM/(EM+2000), and can CRIT",
    "Dance of Aurore: Superconduct becomes Stellar-Conduct; Cryo Swirl becomes Stellar Swirl; Base Stellar reaction DMG +0.7% per 100 ATK (max 14%)",
    "Pathetique of Pateticheskaya (A4): +1.5% Base DMG Multiplier per 100 ATK over 1,000 on direct Stellar hits (max +30%)",
  ],
  wikiTalents: [
    {
      name: "Snow Swan Variation",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 5 consecutive strikes with her sword. Charged Attack: Consumes a certain amount of Stamina to unleash a dazzling slash on opponents in front of her. Plunging Attack: Attacks opponents in her path while plunging from mid-air, dealing AoE DMG upon landing.",
    },
    {
      name: "Adagio: Phantom Night Dancers",
      type: "Elemental Skill",
      description: "With slow, graceful dance steps, Odette deals AoE Cryo DMG and summons her Solo Dance Double. The Double alternates between Plume and Wing dance moves to periodically attack nearby opponents, dealing AoE Cryo DMG. For 6s after unleashing the Skill, it becomes the special Elemental Skill Adagio: Coda at Dawn's Tolling, dealing AoE Cryo DMG over time and a finisher instance of AoE Cryo DMG considered Stellar-Conduct or Stellar Swirl DMG.",
    },
    {
      name: "Presto: Bluebird Finale",
      type: "Elemental Burst",
      description: "With quick, lively dance steps, Odette deals multiple instances of AoE Cryo DMG, summons her Solo Dance Double (or refreshes its duration), and gains Snow Swan's Dream, which increases the Stellar Glimmer reaction DMG Odette deals. Also enables Adagio: Coda at Dawn's Tolling for 6s.",
    },
    {
      name: "Spring Rite of the Chosen One",
      type: "Passive Talent",
      description: "When Odette summons her Solo Dance Double, she obtains 4 stacks of Marvelous Splendor. Every stack increases the character's Stellar Glimmer DMG by 15%. Lasts until her Double exits or is re-summoned. When off-field, she loses 1 stack per second while other nearby party members gain stacks.",
    },
    {
      name: "Pathetique of Pateticheskaya",
      type: "Passive Talent",
      description: "For every 100 ATK Odette has over 1,000, her Stellar Glimmer DMG is additionally increased by 1.5% of the original DMG (Base DMG Multiplier directly, max +30%). Only applies to Stellar Glimmer DMG dealt directly by Odette.",
    },
    {
      name: "Dance of Aurore",
      type: "Passive Talent",
      description: "Odette enters Radiance: Stellar-Conduct inside a Polestar Field, or Radiance: Stellar Swirl for 8s after party triggers Stellar Swirl. Superconduct/Cryo Swirl convert to Stellar-Conduct/Stellar Swirl, and their Base DMG is increased by 0.7% for every 100 ATK (max 14%).",
    },
    {
      name: "Echo of Winter Daydreams",
      type: "Utility Passive",
      description: "Shows the locations of Snezhnaya's Local Specialties on the mini-map. Tapping Elemental Skill during her dancing idle animation extends her dance performance.",
    },
  ],
  constellations: [
    {
      level: 1,
      name: "On This Danceless Morn, She Gazes at Her Reflection",
      description: "After unleashing Adagio: Coda at Dawn's Tolling, at the duet's end Odette deals an additional instance of Cryo AoE DMG considered Stellar-Conduct DMG at 300% ATK or Stellar Swirl DMG at 450% ATK. Solo Dance Double grants +2 stacks of Marvelous Splendor (max 6 stacks).",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "I Must See the Snow Swan's Unseen Dream for Myself, She Thought",
      description: "Every stack of Marvelous Splendor active also increases the character's ATK by 7%. In Radiance: Stellar Glimmer while Solo Dance Double is on the field, opponents near the Double have corresponding Elemental RES lowered by 20% (Cryo/Electro in Conduct, Cryo/Anemo in Swirl).",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "I'll Chase the Shouting Wind Along, Climbing Alone As I Go",
      description: "Increases the Level of Adagio: Phantom Night Dancers by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 4,
      name: "Up, Up the Long, Delirious, Burning Blue",
      description: "Snow Swan's Dream increases other party members' Stellar Glimmer reaction DMG by 50% of its effects. When a party member deals Stellar Glimmer DMG, Odette unleashes a coordinated attack dealing AoE Cryo DMG considered Stellar-Conduct (66% ATK) or Stellar Swirl (99% ATK) every 3.5s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "Oh! I Have Slipped the Surly Bonds of Earth",
      description: "Increases the Level of Presto: Bluebird Finale by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 6,
      name: "Put Out My Hand, and Touched the Face of the Divine",
      description: "When Odette grants Marvelous Splendor to party members, her own stacks no longer decrease. Characters affected by Marvelous Splendor have Stellar Glimmer reaction DMG elevated by 25%, and Odette's Stellar Glimmer reaction DMG is elevated by an additional 20% (total 45%).",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description: "Cryo off-field sub-DPS and Stellar Glimmer reaction specialist. Grants party Base Stellar Reaction DMG scaling with ATK, Cryo/Electro DMG Bonus & Phys RES shred via Polestar Field, Marvelous Splendor Stellar Glimmer DMG & ATK% (C2), RES shred (C2), team Snow Swan's Dream bonus (C4), and Stellar reaction Elevation (C6).",
    buffExplanations: [
      {
        name: "Dance of Aurore",
        brief: "+0.7% Stellar Base DMG per 100 ATK (max 14%)",
        full: "Converts Superconduct into Stellar-Conduct and Cryo Swirl into Stellar Swirl. Increases party Base Stellar reaction DMG by 0.7% per 100 ATK, capped at 14.0%.",
        category: "lunar",
      },
      {
        name: "Polestar Field",
        brief: "+20% to +40% Cryo/Electro DMG Bonus & -40% Phys RES",
        full: "While Polestar Field is active, party members gain +20% (0 hits) or +(28 + hits)% (1-12 hits, up to +40%) Cryo and Electro DMG Bonus, and opponents within the field have their Physical RES decreased by 40%.",
        category: "dmg_bonus",
      },
      {
        name: "A1: Marvelous Splendor",
        brief: "+15% Stellar Glimmer DMG per stack",
        full: "Nearby party members gain Marvelous Splendor stacks when Odette is off-field, each increasing Stellar Glimmer DMG by 15% (up to +60% at 4 stacks, or +90% at 6 stacks with C1).",
        category: "lunar",
      },
      {
        name: "C2: Marvelous Splendor ATK% & RES Shred",
        brief: "+7% ATK per stack & -20% Cryo/Electro (or Anemo) RES",
        full: "Every stack of Marvelous Splendor active increases ATK by 7%. When Solo Dance Double is on field in Radiance: Stellar-Conduct, lowers nearby enemy Cryo and Electro RES by 20% (or Cryo and Anemo in Stellar Swirl).",
        category: "elemental",
      },
      {
        name: "C4: Snow Swan's Dream Share",
        brief: "+50% of Snow Swan's Dream to party",
        full: "Increases teammate Stellar Glimmer reaction DMG by 50% of Snow Swan's Dream effect (+25% at Burst Lv10, +31% at Burst Lv13).",
        category: "lunar",
      },
      {
        name: "C6: Divine Elevation",
        brief: "+25% Elevation to party Stellar Glimmer DMG",
        full: "Party characters affected by Marvelous Splendor have their Stellar Glimmer reaction DMG elevated by 25%.",
        category: "lunar",
      },
    ],
    statFields: [
      { key: "atk", label: "Total ATK", defaultValue: "2400" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "65" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "150" },
    ],
    buffs: [
      {
        stat: "dmgBonus",
        label: "Cryo/Electro DMG (Odette Polestar Field)",
        compute: (ctx) => {
          if ((ctx.inputs["polestar-field"] ?? 0) <= 0) return 0;
          const hits = ctx.inputs["polestar-hits"] ?? 0;
          return stellarConductFieldBuffs(hits).cryoElectroDmgBonus;
        },
      },
      {
        stat: "enemyPhysicalRes",
        label: "Enemy Phys RES Shred (Odette Polestar Field)",
        compute: (ctx) => ((ctx.inputs["polestar-field"] ?? 0) > 0 ? -40 : 0),
      },
      {
        stat: "stellarConductMultiplier",
        label: "Stellar-Conduct Multiplier BRC (Odette Polestar Field)",
        compute: (ctx) => {
          if ((ctx.inputs["polestar-field"] ?? 0) <= 0) return 0;
          const hits = ctx.inputs["polestar-hits"] ?? 0;
          return hits <= 0 ? 0 : 40 + 5 * Math.min(hits, 12);
        },
      },
      {
        stat: "stellarReactionDmgBonus",
        label: "Stellar Glimmer DMG (Odette Marvelous Splendor)",
        compute: (ctx) => {
          const maxStacks = ctx.constellationLevel >= 1 ? 6 : 4;
          const stacks = Math.min(ctx.inputs["marvelous-splendor-stacks"] ?? 4, maxStacks);
          return 15 * stacks;
        },
      },
      {
        stat: "atkPercent",
        label: "ATK% (Odette C2 Marvelous Splendor)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          const maxStacks = ctx.constellationLevel >= 1 ? 6 : 4;
          const stacks = Math.min(ctx.inputs["marvelous-splendor-stacks"] ?? 4, maxStacks);
          return 7 * stacks;
        },
      },
      {
        stat: "enemyCryoRes",
        label: "Enemy Cryo RES (Odette C2)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          if ((ctx.inputs["solo-dance-double"] ?? 1) <= 0) return 0;
          const fieldOn = (ctx.inputs["polestar-field"] ?? 0) > 0;
          const swirlOn = (ctx.inputs["radiance-stellar-swirl"] ?? 0) > 0;
          return fieldOn || swirlOn ? -20 : 0;
        },
      },
      {
        stat: "enemyElectroRes",
        label: "Enemy Electro RES (Odette C2)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          if ((ctx.inputs["solo-dance-double"] ?? 1) <= 0) return 0;
          const fieldOn = (ctx.inputs["polestar-field"] ?? 0) > 0;
          return fieldOn ? -20 : 0;
        },
      },
      {
        stat: "enemyAnemoRes",
        label: "Enemy Anemo RES (Odette C2)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          if ((ctx.inputs["solo-dance-double"] ?? 1) <= 0) return 0;
          const fieldOn = (ctx.inputs["polestar-field"] ?? 0) > 0;
          const swirlOn = (ctx.inputs["radiance-stellar-swirl"] ?? 0) > 0;
          return !fieldOn && swirlOn ? -20 : 0;
        },
      },
      {
        stat: "stellarReactionDmgBonus",
        label: "Stellar Glimmer DMG (Odette C4 Snow Swan's Dream Share)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 4) return 0;
          if ((ctx.inputs["snow-swans-dream"] ?? 1) <= 0) return 0;
          const burstLvl = (ctx.talentLevels["burst"] ?? 10) + (ctx.constellationLevel >= 5 ? 3 : 0);
          const bonus = 14 + (Math.min(burstLvl, 13) - 1) * 4;
          return bonus * 0.5;
        },
      },
      {
        stat: "stellarReactionSpecialDmgBonus",
        label: "Stellar Elevation (Odette C6)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          const stacks = ctx.inputs["marvelous-splendor-stacks"] ?? 4;
          return stacks > 0 ? 25 : 0;
        },
      },
    ],
    stellarBaseBonusCompute: (ctx) => Math.min(0.7 * (ctx.atk / 100), 14),
    lunarBaseBonusCompute: (ctx) => Math.min(0.7 * (ctx.atk / 100), 14),
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Total ATK", value: fmt(ctx.atk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
