import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, def, lunarDef } from "./hit-helpers";

// DEF-scaler: regular NA rows scale ATK, but everything in Lunar Phase Shift
// (skill) and the Burst scales %DEF. The three `lunarDef` rows are "considered
// Lunar-Crystallize Reaction DMG" (Direct Lunar, coefficient 1.6) — computed via
// the direct-reaction branch; the mechanics resolver supplies their params.
// Multi-part hits (×2) show the per-hit value.
export const zibai: CharacterConfig = {
  id: "zibai", name: "Zibai", rarity: 5,
  element: "Geo", weapon: "Sword", scalingSource: "def",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Geo DMG Bonus%",
  stats: coreStats("Geo DMG Bonus%"),
  talents: [
    { type: "normal", name: "Normal Attack — Golden Blade's Petaled Touch", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit-x2", "3-Hit ×2 (each)"),
      atk("4-hit", "4-Hit"), atk("charged-x2", "Charged Attack ×2 (each)"),
      atk("plunge", "Plunge"), atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill — Heaven and Earth Made Manifest", hits: [
      def("ps-1-hit", "Phase Shift 1-Hit"), def("ps-2-hit", "Phase Shift 2-Hit"),
      def("ps-3-hit-x2", "Phase Shift 3-Hit ×2 (each)"), def("ps-4-hit", "Phase Shift 4-Hit"),
      def("ps-charged-x2", "Phase Shift Charged ×2 (each)"),
      def("spirit-steed-1", "Spirit Steed's Stride 1-Hit"),
      lunarDef("spirit-steed-2", "Spirit Steed's Stride 2-Hit"),
      lunarDef("4-hit-additional", "Phase Shift 4-Hit Additional"),
    ] },
    { type: "burst", name: "Elemental Burst — Tri-Sphere Eminence", hits: [
      def("skill-1", "Skill 1-Hit"),
      lunarDef("skill-2", "Skill 2-Hit"),
    ] },
  ],
  mechanicDefs: [
    { id: "geo-allies", label: "Other Geo party members (A4)", control: "stacks", max: 3,
      hint: "+15% DEF each (Layered Peaks Pierce the Clouds)" },
    { id: "hydro-allies", label: "Hydro party members (A4)", control: "stacks", max: 3,
      hint: "+60 Elemental Mastery each" },
    { id: "moonfall", label: "Moonfall active (A1)", control: "toggle", defaultValue: 1,
      hint: "Spirit Steed's Stride 2nd hit +60% of DEF (4s after Skill cast / Moondrift Harmony)" },
    { id: "c1-first-stride", label: "First Stride of the phase (C1)", control: "toggle",
      hint: "C1 only: first Spirit Steed's Stride 2nd-hit Lunar DMG +220%" },
    { id: "c4-scattermoon", label: "Scattermoon Splendor (C4)", control: "toggle",
      hint: "C4 only: next Phase Shift 4-Hit Additional deals 250% of original" },
    { id: "c6-radiance", label: "Radiance consumed (C6)", control: "percent", max: 100, defaultValue: 100,
      hint: "C6 only: Stride consumes all Radiance; +1.6% DMG per point above 70 on Stride + Lunar hits" },
  ],
  mechanics: [
    "Lunar-tagged rows are Lunar-Crystallize reaction DMG (coefficient 1.6): they ignore DMG Bonus% and enemy DEF, use EM bonus 6·EM/(EM+2000), and can CRIT",
    "Moonsign Benediction: Hydro Crystallize becomes Lunar-Crystallize; +0.7% Lunar-Crystallize Base DMG per 100 DEF (max 14%) — applied automatically to her Lunar hits and the Indirect Lunar panel",
    "Phase Shift Radiance: 100 cap; 10/s in mode, 5 per NA hit (0.5s ICD), 35 per party Lunar-Crystallize (4s ICD); Spirit Steed's Stride costs 70 (max 4 uses; C1: 5)",
  ],
  wikiTalents: [
    {
      name: "Golden Blade's Petaled Touch",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 4 rapid strikes. Charged Attack: Consumes Stamina to unleash 2 rapid sword strikes. Plunging Attack: Plunges from mid-air, dealing AoE DMG upon impact."
    },
    {
      name: "Heaven and Earth Made Manifest",
      type: "Elemental Skill",
      description: "Summoning a shadow of her former powers, Zibai switches to Lunar Phase Shift mode (max 15s): Normal and Charged Attacks are converted to Geo DMG that cannot be overridden, and she accrues Phase Shift Radiance (10/s in mode; 5 per Normal Attack hit, once per 0.5s; 35 when a nearby party member triggers Lunar-Crystallize, once per 4s; max 100). With at least 70 Radiance, she consumes 70 to unleash Spirit Steed's Stride: two instances of Geo DMG, the second considered Lunar-Crystallize Reaction DMG. Max 4 Strides per phase. Moonsign: Ascendant Gleam — while in Lunar Phase Shift, the 4th Normal Attack deals additional Geo DMG considered Lunar-Crystallize Reaction DMG."
    },
    {
      name: "Tri-Sphere Eminence",
      type: "Elemental Burst",
      description: "Operates the Jadelight Canopy, dealing 2 instances of Geo DMG — the second is considered Lunar-Crystallize Reaction DMG. If cast while in Lunar Phase Shift, extends the current phase by 1.7s."
    },
    {
      name: "The Selenic Adeptus Descends",
      type: "Passive Talent",
      description: "When casting the Elemental Skill or triggering Moondrift Harmony, Zibai gains the Moonfall effect for 4s: DMG dealt by the 2nd hit of Spirit Steed's Stride is increased by 60% of Zibai's DEF."
    },
    {
      name: "Layered Peaks Pierce the Clouds",
      type: "Passive Talent",
      description: "Each other Geo party member increases Zibai's DEF by 15%; each Hydro party member increases her Elemental Mastery by 60."
    },
    {
      name: "The Coursing Sun and Moon",
      type: "Moonsign Benediction Passive",
      description: "When party members trigger Hydro Crystallize, it is converted to Lunar-Crystallize, and the party's Lunar-Crystallize Base DMG is increased based on Zibai's DEF: every 100 DEF increases it by 0.7%, up to a maximum of 14%. When Zibai is in the party, the party's Moonsign increases by 1 level."
    },
    {
      name: "Moonlit Flower Forest",
      type: "Utility Passive",
      description: "At night (18:00–06:00), when not in combat, restores 1 Elemental Energy to Zibai every 2s. Does not work in Domains, Trounce Domains, or the Spiral Abyss."
    }
  ],
  // Numeric effects (C1 ×3.2 first Stride, C2 +30% party Lunar + 550% DEF flat,
  // C4 ×2.5 Scattermoon, C6 radiance bonus) are applied by the mechanics resolver.
  constellations: [
    {
      level: 1, name: "Burst Forth With Vigor, But Enter in Silence",
      description: "After using the Elemental Skill, Zibai immediately gains 100 Phase Shift Radiance, and the max Spirit Steed's Stride uses per phase increases to 5. The first Stride's 2nd-hit Lunar-Crystallize Reaction DMG is increased by 220%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "At Birth Are Souls Born, and in Death Leave But Husks",
      description: "While in Lunar Phase Shift, all nearby party members' Lunar-Crystallize Reaction DMG is increased by 30%. Moonsign: Ascendant Gleam — the 2nd hit of Spirit Steed's Stride deals additional DMG equal to 550% of Zibai's DEF.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "Free From Constraints and Worldly Ties",
      description: "Increases the Level of Heaven and Earth Made Manifest by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "The Spirit Passes, Then Form Follows",
      description: "While in Lunar Phase Shift, the Normal Attack sequence does not reset. When Spirit Steed's Stride hits opponents, Zibai gains Scattermoon Splendor: the next 4th Normal Attack's additional hit deals 250% of its original Lunar-Crystallize Reaction DMG.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Perceive the Worthless and Debate It Not",
      description: "Increases the Level of Tri-Sphere Eminence by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "The World, A Journey in Passing",
      description: "While in Lunar Phase Shift, Phase Shift Radiance gain rate is increased by 50%, and Spirit Steed's Stride consumes ALL Phase Shift Radiance: for the next 3s, DMG dealt by Spirit Steed's Stride and Zibai's Lunar-Crystallize Reaction DMG is elevated by 1.6% for every point consumed above 70.",
      effects: [{ type: "informational" }]
    },
  ],
};
