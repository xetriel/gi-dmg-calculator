import type { CharacterConfig, TalentHit } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge, def, lunarDef } from "./hit-helpers";

const healDef = (key: string, name: string): TalentHit => ({ key, name, scaling: "def", kind: "heal" });

export const linnea: CharacterConfig = {
  id: "linnea", name: "Linnea", rarity: 5,
  element: "Geo", weapon: "Bow", scalingSource: "def",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "Geo DMG Bonus%",
  stats: coreStats("Geo DMG Bonus%"),
  talents: [
    {
      type: "normal", name: "Normal Attack — Capture Protocol", hits: [
        atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
        atkCharged("aimed", "Aimed Shot"),
        atkCharged("aimed-charged", "Fully-Charged Aimed Shot (Geo)"),
        atkPlunge("plunge", "Plunge"), atkPlunge("low-plunge", "Low Plunge"), atkPlunge("high-plunge", "High Plunge")
      ]
    },
    {
      type: "skill", name: "Elemental Skill — Countermeasure: Lumi's Battle Cry!", hits: [
        def("pound-pound", "Lumi Pound-Pound Pummeler DMG (×2 each)"),
        lunarDef("heavy-overdrive", "Lumi Heavy Overdrive Hammer DMG"),
        lunarDef("million-ton-crush", "Lumi Million Ton Crush DMG")
      ]
    },
    {
      type: "burst", name: "Elemental Burst — Memo: Survival Guide in Extreme Conditions", hits: [
        healDef("burst-initial", "Initial Healing"),
        healDef("burst-continuous", "Continuous Healing (per tick)")
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "active-char-non-moonsign", label: "A4: Active char is NOT a Moonsign character", control: "toggle",
      hint: "Universal Naturalist Archive (A4): Increases Linnea's own EM by 5% of her DEF."
    },
    {
      id: "field-catalog-stacks", label: "Field Catalog stacks (C1)", control: "stacks", max: 18, defaultValue: 6,
      hint: "C1: Consuming 1 stack boosts nearby party Lunar-Crystallize by 75% DEF. Million Ton Crush consumes up to 5 stacks (150% DEF each). C6: Consumes double, 1.5x DMG boost."
    },
    {
      id: "c2-moondrift", label: "Within 8s after Moondrift Harmony (C2)", control: "toggle",
      hint: "C2: Geo/Hydro party members CRIT DMG +40%; Million Ton Crush CRIT DMG +150%."
    },
    {
      id: "c4-moondrift", label: "Within 5s after Moondrift Harmony (C4)", control: "toggle",
      hint: "C4: DEF of Linnea and active character +25%."
    }
  ],
  mechanics: [
    "Lunar-tagged rows are Lunar-Crystallize reaction DMG (coefficient 1.6): they ignore DMG Bonus% and enemy DEF, use EM bonus 6·EM/(EM+2000), and can CRIT",
    "Moonsign Benediction (Habitat Survey): Hydro Crystallize becomes Lunar-Crystallize; +0.7% Lunar-Crystallize Base DMG per 100 DEF (max 14%)",
    "Field Catalog: flat DMG bonus from stacks scales on DEF (75% normal, 150% Million Ton Crush; C6 increases these to 1.5x)",
  ],
  wikiTalents: [
    {
      name: "Capture Protocol",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 3 consecutive shots with a bow. Charged Attack: Performs a more precise Aimed Shot with increased DMG. While aiming, stone crystals accumulate on the arrowhead; a fully charged crystalline arrow deals Geo DMG."
    },
    {
      name: "Countermeasure: Lumi's Battle Cry!",
      type: "Elemental Skill",
      description: "Summons Lumi to assist in combat. Lumi deals continuous AoE Geo DMG or triggers Lunar-Crystallize Reaction DMG depending on player inputs. Tap triggers Pound-Pound Pummeler, spam triggers Million Ton Crush."
    },
    {
      name: "Memo: Survival Guide in Extreme Conditions",
      type: "Elemental Burst",
      description: "Summons Lumi in Super Power Form to provide initial and continuous healing to party members based on Linnea's DEF. Resets Lumi's duration."
    },
    {
      name: "Field Observation Notes",
      type: "Passive Talent",
      description: "When Lumi is on the field, the Geo RES of nearby opponents is decreased by 15%."
    },
    {
      name: "Universal Naturalist Archive",
      type: "Passive Talent",
      description: "Linnea increases the EM of party members by 5% of her DEF. If the active character is a Moonsign character, their EM is increased; otherwise, Linnea's own EM is increased."
    },
    {
      name: "Habitat Survey",
      type: "Moonsign Benediction Passive",
      description: "When party members trigger Hydro Crystallize, it is converted into a Lunar-Crystallize reaction. Every 100 DEF that Linnea possesses increases the Base DMG of the Lunar-Crystallize reaction by 0.7%, up to a maximum of 14%. Increases Moonsign level by 1."
    }
  ],
  constellations: [
    {
      level: 1, name: "Provisional Classification",
      description: "Elemental Skill or Moondrift Harmony grants 6 stacks of Field Catalog (max 18). Consuming 1 stack boosts nearby party Lunar-Crystallize DMG by 75% of DEF. Million Ton Crush consumes up to 5 stacks, giving +150% of DEF DMG per stack.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "Tidings of Joy and Sorrow",
      description: "Within 8s after triggering Moondrift Harmony, Hydro/Geo party members' CRIT DMG is increased by 40%. Million Ton Crush's CRIT DMG is increased by 150%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "Eventful Log Page",
      description: "Increases the level of Countermeasure: Lumi's Battle Cry! by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "Expert Instinct",
      description: "Within 5s after triggering Moondrift Harmony, the DEF of Linnea and the active character is increased by 25%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Outdoor Survival Manual",
      description: "Increases the level of Memo: Survival Guide in Extreme Conditions by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "Golden Beagle's Dream",
      description: "Elemental Skill or Moondrift Harmony grants max stacks of Field Catalog. Consuming Field Catalog consumes double the stacks and increases the resulting DMG boost to 150% of original. Elevates Lunar-Crystallize DMG of nearby party members by 25%.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Moonsign Geo buffer and Lunar-Crystallize amplifier. Converts Hydro Crystallize into Lunar-Crystallize, shares EM scaling from DEF (A4), boosts Hydro/Geo CRIT DMG by 40% at C2, grants +25% DEF at C4, and elevates party Lunar-Crystallize DMG by 25% at C6.",
    buffExplanations: [
      {
        name: "Moonsign Benediction",
        brief: "+0.7% Lunar-Crystallize Base DMG per 100 DEF (max 14%)",
        full: "Converts Hydro Crystallize into Lunar-Crystallize. Every 100 DEF increases party Lunar-Crystallize Base DMG by 0.7%, capped at 14.0%.",
        category: "lunar",
      },
      {
        name: "A4: Universal Naturalist Archive",
        brief: "Shares 5% of DEF as EM",
        full: "Linnea increases the EM of party members by 5% of her DEF.",
        category: "stat_share",
      },
      {
        name: "C2: Tidings of Joy and Sorrow",
        brief: "+40% CRIT DMG for Hydro/Geo allies",
        full: "Hydro and Geo party members gain +40% CRIT DMG after Moondrift Harmony.",
        category: "dmg_bonus",
      },
      {
        name: "C4: Expert Instinct",
        brief: "+25% DEF to active character",
        full: "Increases the DEF of the active character by 25% of their base DEF.",
        category: "stat_share",
      },
      {
        name: "C6: Golden Beagle's Dream",
        brief: "+25% Lunar-Crystallize DMG elevation",
        full: "Elevates the Lunar-Crystallize DMG of nearby party members by 25%.",
        category: "lunar",
      },
    ],
    statFields: [
      { key: "def", label: "Total DEF", defaultValue: "2400" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "em",
        label: "EM (Linnea A4)",
        compute: (ctx) => 0.05 * ctx.def,
      },
      {
        stat: "critDmg",
        label: "CRIT DMG (Linnea C2)",
        compute: (ctx) => (ctx.constellationLevel >= 2 ? 40 : 0),
      },
      {
        stat: "def",
        label: "DEF (Linnea C4)",
        compute: (ctx) => (ctx.constellationLevel >= 4 ? 0.25 * (ctx.baseDef || ctx.def) : 0),
      },
      {
        stat: "lunarCrystallizeDmgBonus",
        label: "Lunar-Crystallize DMG (Linnea C6)",
        compute: (ctx) => (ctx.constellationLevel >= 6 ? 25 : 0),
      },
    ],
    lunarBaseBonusCompute: (ctx) => Math.min(0.7 * (ctx.def / 100), 14),
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Total DEF", value: fmt(ctx.def) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
