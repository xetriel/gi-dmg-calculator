import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge, stellarAtk } from "./hit-helpers";
import { stellarConductFieldBuffs } from "../../../lib/engine/stellar";

// All hits scale on ATK. The "-stellar" rows are the Radiance: Stellar Glimmer
// variants (Stellar-Conduct and Stellar Swirl): they are reaction DMG computed through
// the stellar formula branch — no enemy-DEF multiplier, no DMG Bonus%, EM bonus
// 6·EM/(EM+2000), and they still CRIT. The mechanics resolver supplies their
// Base Reaction Coefficient / Base DMG Bonus / Reaction Bonus / Elevation.
export const sandrone: CharacterConfig = {
  id: "sandrone", name: "Sandrone", rarity: 5,
  element: "Cryo", weapon: "Claymore", scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "Cryo DMG Bonus%",
  stats: coreStats("Cryo DMG Bonus%"),
  talents: [
    { type: "normal", name: "Normal Attack — Self-Evident Proposition", hits: [
      { key: "1-hit", name: "1-Hit", scaling: "atk", hitCategory: "normal", element: "Physical" },
      { key: "2-hit", name: "2-Hit", scaling: "atk", hitCategory: "normal", element: "Physical" },
      { key: "3-hit", name: "3-Hit", scaling: "atk", hitCategory: "normal", element: "Physical" },
      atkCharged("sweeping-fire", "Charged: Sweeping Fire"),
      atkCharged("condensed-beam", "Charged: Condensed Beam"),
      { key: "condensed-beam-stellar", name: "Charged: Condensed Beam (Radiance: Stellar Glimmer)", scaling: "atk", direct: "stellar", hitCategory: "charged" },
      atk("power-overdrive", "DMG When in Power Overdrive"),
      atkPlunge("plunge", "Plunge"), atkPlunge("low-plunge", "Low Plunge"), atkPlunge("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill — Differential Analysis", hits: [
      atk("prism-shot", "Prism Shot"),
      stellarAtk("prism-shot-stellar", "Prism Shot 2 (Radiance: Stellar Glimmer)"),
    ] },
    { type: "burst", name: "Elemental Burst — Q.E.D.", hits: [
      atk("bombardment", "Bombardment ×3 (each)"),
      atk("convective-ray", "Convective Inhibition Ray"),
      stellarAtk("convective-ray-stellar", "Convective Inhibition Ray (Radiance: Stellar Glimmer)"),
    ] },
  ],
  mechanicDefs: [
    { id: "polestar-field", label: "Polestar Field active", control: "toggle", defaultValue: 1,
      hint: "Stellar-Conduct field: activates Radiance: Stellar-Conduct (priority over Stellar Swirl); BRC from hits below; +20–40% Cryo DMG Bonus on non-stellar hits; -40% Phys RES" },
    { id: "polestar-hits", label: "Polestar recorded hits", control: "stacks", max: 12,
      hint: "Cryo/Electro hits stored by the field: BRC 1.00 → 1.45…2.00; Cryo DMG Bonus 20% → 29…40%" },
    { id: "radiance-stellar-swirl", label: "Radiance: Stellar Swirl active", control: "toggle", defaultValue: 0,
      hint: "Party Stellar Swirl triggers Radiance: Stellar Swirl (8s); direct hits deal Stellar Swirl DMG (inactive if Polestar Field is active)" },
    { id: "decoding-over-50", label: "Decoding Power > 50 (A1)", control: "toggle", defaultValue: 1,
      hint: "2nd Prism Shot deals 400% of its original DMG" },
    { id: "refined-tactics", label: "Refined Tactics stacks (A1)", control: "stacks", max: 10,
      hint: "Burst clears stacks: Convective Ray deals 100% + 10%/stack of original DMG" },
    { id: "c2-beam-stacks", label: "Beams fired this Decoding (C2)", control: "stacks", max: 3,
      hint: "C2 only: condensed beams +40% CRIT DMG, +20% more per beam fired (max 3)" },
  ],
  mechanics: [
    "Radiance: Stellar Glimmer (Stellar-Conduct / Stellar Swirl) rows are reaction DMG: they ignore DMG Bonus% and enemy DEF, use EM bonus 6·EM/(EM+2000), and can CRIT",
    "Light of Rationalisme: Superconduct becomes Stellar-Conduct; Cryo Swirl becomes Stellar Swirl; Base Stellar reaction DMG +0.7% per 100 ATK (max 14%)",
    "A Lady's Code of Conduct: Increases Elemental Mastery by 8 for every 100 ATK (max 160 EM)",
  ],
  wikiTalents: [
    {
      name: "Formule Phenomenale: Self-Evident Proposition",
      type: "Normal Attack",
      description: "Normal Attack: Generates threads that control her weapon using formulae, performing up to 3 consecutive strikes. Charged Attack: Summons Fagio and switches it to Decoding mode: unleashes a sweeping fire attack on enemies in front and periodically fires condensed beams, dealing AoE Cryo DMG. Radiance: Stellar Glimmer: The condensed beams will instead deal AoE Cryo DMG that is considered the corresponding Stellar Glimmer DMG. While in Decoding mode, Fagio's Decoding Power continuously increases (firing beams increases it further). At 100 Decoding Power, Fagio switches to Power Overdrive mode, firing at longer intervals, and cannot re-enter Decoding mode until Decoding Power drops below 50. When Sandrone is off-field, Decoding Power decreases at 300% the original rate. Plunging Attack: Plunges from midair, dealing AoE DMG on landing."
    },
    {
      name: "Formule Phenomenale: Differential Analysis",
      type: "Elemental Skill",
      description: "Sandrone boards the Tea Party Tactical Assault Hovermech and hovers forward for 6s, controlling the travel direction (Sprint launches a faster hover mode at Stamina cost). When she starts hovering with opponents nearby, she summons a Prismatic Resonance Cannon and fires 2 Prism Shots, dealing Cryo DMG. Radiance: Stellar Glimmer: The second Prism Shot will instead deal Cryo DMG that is considered the corresponding Stellar Glimmer reaction DMG. While on the Hovermech, Sandrone repairs Fagio, causing Decoding Power to swiftly decrease."
    },
    {
      name: "Formule Phenomenale: Q.E.D.",
      type: "Elemental Burst",
      description: "Summons a large number of Prismatic Resonance Cannons for a frontal bombardment before firing a Convective Inhibition Ray, dealing AoE Cryo DMG. Radiance: Stellar Glimmer: The Convective Inhibition Ray instead deals AoE Cryo DMG that is considered the corresponding Stellar Glimmer reaction DMG."
    },
    {
      name: "Eternal Speculation Engine",
      type: "Passive Talent",
      description: "Radiance: Stellar Glimmer: When using Differential Analysis, if Fagio's Decoding Power is greater than 50, the second Prism Shot deals 400% of its original DMG as Fagio's Decoding Power is decreased. For every 10 points of Decoding Power Fagio loses, it gains 1 stack of Refined Tactics for 60s (max 10 stacks). When Sandrone uses Q.E.D. while in the Radiance: Stellar-Conduct state, all Refined Tactics stacks are cleared, causing the Convective Inhibition Ray to deal 100% + (stacks cleared) × 10% of its original DMG."
    },
    {
      name: "A Lady's Code of Conduct",
      type: "Passive Talent",
      description: "Increases Sandrone's Elemental Mastery based on her ATK. Every 100 ATK will increase her Elemental Mastery by 8. The maximum increase she can gain this way is 160."
    },
    {
      name: "Light of Rationalisme",
      type: "Passive Talent",
      description: "Sandrone will enter the Radiance: Stellar Conduct state when she is inside a Polestar Field, or the Radiance: Stellar Swirl state for 8s after a nearby party member triggers a Stellar Swirl reaction. When a party member triggers a Superconduct or Cryo Swirl reaction, it becomes a Stellar-Conduct or Stellar Swirl reaction instead, and the Base DMG of the aforementioned reaction is also increased by 0.7% for every 100 points of Sandrone's ATK (max 14%)."
    },
    {
      name: "A Caucus Prelude and a Long Tale",
      type: "Utility Passive",
      description: "When Sandrone is in the party, you will gain additional snack rewards after turning in your Daily Commissions with Katheryne."
    }
  ],
  // Numeric effects (C1 +30% stellar reaction bonus, C2 beam CRIT DMG, C4 Extra
  // Cannon, C6 Cluster Beam & +20% Elevation) are applied/annotated by the mechanics resolver.
  constellations: [
    {
      level: 1, name: "Morrow After the Golden Dusk",
      description: "When in Decoding mode, Fagio's Decoding Power increases at a 50% lower rate, and all party members deal 30% increased Stellar Glimmer reaction DMG.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "An Heiress Gazed Into the Looking-Glass",
      description: "Radiance: Stellar Glimmer: Increases CRIT DMG from Charged Attack condensed beams by 40%. Each time a beam is fired, CRIT DMG dealt by all condensed beams fired during this Decoding mode period is further increased by 20%. Max 3 stacks.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "Refuse the Wake of Dusk, the Moonlit Yoke",
      description: "Increases the Level of Formule Phenomenale: Self-Evident Proposition by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "normal" }]
    },
    {
      level: 4, name: "In Knowledge Lies the World's True Ground",
      description: "When Sandrone deals Stellar-Conduct or Stellar Swirl DMG to an opponent, she will also summon an extra Prismatic Resonance Cannon to fire off a coordinated attack which deals Cryo DMG at 125% or 187.5% of her ATK, respectively. This DMG is considered the corresponding Stellar Glimmer reaction DMG, and the effect can occur once every 4s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Of All Beside, She Takes No Part",
      description: "Increases the Level of Formule Phenomenale: Q.E.D. by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "Narcissus Wakes, Her Eyes Upon the Dawn",
      description: "When Fagio fires a condensed beam for the third time in Decoding mode, it becomes a Condensed Cluster Beam firing continuously: up to 4 additional instances of AoE Cryo DMG at 100% of Sandrone's ATK on top of subsequent beams. Radiance: Stellar Glimmer: the 4 additional instances instead deal 80% (Stellar-Conduct) or 120% (Stellar Swirl) of Sandrone's ATK as the corresponding Stellar Glimmer reaction DMG. Additionally, all Stellar Glimmer reaction DMG dealt by Sandrone is elevated by 20%.",
      effects: [{ type: "informational" }]
    },
  ],
  support: {
    description: "Cryo sub-DPS and Stellar Glimmer reaction specialist. Empowers party Stellar reaction Base DMG scaling with ATK, provides Cryo/Electro DMG Bonus via Polestar Field, and grants +30% Stellar Glimmer Reaction DMG at C1.",
    buffExplanations: [
      {
        name: "Light of Rationalisme",
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
        name: "C1: Morrow After the Golden Dusk",
        brief: "+30% Stellar Glimmer Reaction DMG",
        full: "All party members deal +30% increased Stellar Glimmer Reaction DMG (both Stellar-Conduct and Stellar Swirl).",
        category: "lunar",
      },
    ],
    statFields: [
      { key: "atk", label: "Total ATK", defaultValue: "2200" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "dmgBonus",
        label: "Cryo/Electro DMG (Sandrone Polestar Field)",
        compute: (ctx) => {
          if ((ctx.inputs["polestar-field"] ?? 0) <= 0) return 0;
          const hits = ctx.inputs["polestar-hits"] ?? 0;
          return stellarConductFieldBuffs(hits).cryoElectroDmgBonus;
        },
      },
      {
        stat: "enemyPhysicalRes",
        label: "Enemy Phys RES Shred (Sandrone Polestar Field)",
        compute: (ctx) => ((ctx.inputs["polestar-field"] ?? 0) > 0 ? -40 : 0),
      },
      {
        stat: "stellarConductMultiplier",
        label: "Stellar-Conduct Multiplier BRC (Sandrone Polestar Field)",
        compute: (ctx) => {
          if ((ctx.inputs["polestar-field"] ?? 0) <= 0) return 0;
          const hits = ctx.inputs["polestar-hits"] ?? 0;
          return hits <= 0 ? 0 : 40 + 5 * Math.min(hits, 12);
        },
      },
      {
        stat: "stellarConductDmgBonus",
        label: "Stellar-Conduct Reaction DMG (Sandrone C1)",
        compute: (ctx) => (ctx.constellationLevel >= 1 ? 30 : 0),
      },
      {
        stat: "stellarSwirlDmgBonus",
        label: "Stellar Swirl Reaction DMG (Sandrone C1)",
        compute: (ctx) => (ctx.constellationLevel >= 1 ? 30 : 0),
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
