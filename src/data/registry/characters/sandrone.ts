import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, stellarAtk } from "./hit-helpers";

// All hits scale on ATK. The "-stellar" rows are the Radiance: Stellar-Conduct
// variants (separate wiki table rows): they are reaction DMG computed through the
// stellar formula branch — no enemy-DEF multiplier, no DMG Bonus%, EM bonus
// 6·EM/(EM+2000), and they still CRIT. The mechanics resolver supplies their
// Base Reaction Coefficient / Base DMG Bonus / Reaction Bonus.
export const sandrone: CharacterConfig = {
  id: "sandrone", name: "Sandrone", rarity: 5,
  element: "Cryo", weapon: "Claymore", scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "Cryo DMG Bonus%",
  stats: coreStats("Cryo DMG Bonus%"),
  talents: [
    { type: "normal", name: "Normal Attack — Self-Evident Proposition", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
      atk("sweeping-fire", "Charged: Sweeping Fire"),
      atk("condensed-beam", "Charged: Condensed Beam"),
      stellarAtk("condensed-beam-stellar", "Charged: Condensed Beam (Stellar-Conduct)"),
      atk("power-overdrive", "DMG When in Power Overdrive"),
      atk("plunge", "Plunge"), atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill — Differential Analysis", hits: [
      atk("prism-shot", "Prism Shot"),
      stellarAtk("prism-shot-stellar", "Prism Shot 2 (Stellar-Conduct)"),
    ] },
    { type: "burst", name: "Elemental Burst — Q.E.D.", hits: [
      atk("bombardment", "Bombardment ×3 (each)"),
      atk("convective-ray", "Convective Inhibition Ray"),
      stellarAtk("convective-ray-stellar", "Convective Inhibition Ray (Stellar-Conduct)"),
    ] },
  ],
  mechanicDefs: [
    { id: "polestar-field", label: "Polestar Field active", control: "toggle", defaultValue: 1,
      hint: "Stellar-Conduct field: BRC from hits below; +20–38% Cryo DMG Bonus on non-stellar hits" },
    { id: "polestar-hits", label: "Polestar recorded hits", control: "stacks", max: 10,
      hint: "Cryo/Electro hits stored by the field: BRC 1 → 1.45…1.9; DMG Bonus 20% → 29…38%" },
    { id: "decoding-over-50", label: "Decoding Power > 50 (A1)", control: "toggle", defaultValue: 1,
      hint: "2nd Prism Shot deals 400% of its original DMG" },
    { id: "refined-tactics", label: "Refined Tactics stacks (A1)", control: "stacks", max: 10,
      hint: "Burst clears stacks: Convective Ray deals 100% + 10%/stack of original DMG" },
    { id: "c2-beam-stacks", label: "Beams fired this Decoding (C2)", control: "stacks", max: 3,
      hint: "C2 only: condensed beams +40% CRIT DMG, +20% more per beam fired (max 3)" },
  ],
  mechanics: [
    "Stellar-Conduct rows are reaction DMG: they ignore DMG Bonus% and enemy DEF, use EM bonus 6·EM/(EM+2000), and can CRIT",
    "Light of Rationalisme: Superconduct becomes Stellar-Conduct; Base Stellar-Conduct DMG +0.7% per 100 ATK (max 14%) — applied automatically",
  ],
  wikiTalents: [
    {
      name: "Formule Phenomenale: Self-Evident Proposition",
      type: "Normal Attack",
      description: "Normal Attack: Generates threads that control her weapon using formulae, performing up to 3 consecutive strikes. Charged Attack: Summons Fagio and switches it to Decoding mode: unleashes a sweeping fire attack on enemies in front and periodically fires condensed beams, dealing AoE Cryo DMG. Radiance: Stellar-Conduct: The condensed beams instead deal AoE Cryo DMG that is considered Stellar-Conduct DMG. While in Decoding mode, Fagio's Decoding Power continuously increases (firing beams increases it further). At 100 Decoding Power, Fagio switches to Power Overdrive mode, firing at longer intervals, and cannot re-enter Decoding mode until Decoding Power drops below 50. When Sandrone is off-field, Decoding Power decreases at 300% the original rate. Plunging Attack: Plunges from midair, dealing AoE DMG on landing."
    },
    {
      name: "Formule Phenomenale: Differential Analysis",
      type: "Elemental Skill",
      description: "Sandrone boards the Tea Party Tactical Assault Hovermech and hovers forward for 6s, controlling the travel direction (Sprint launches a faster hover mode at Stamina cost). When she starts hovering with opponents nearby, she summons a Prismatic Resonance Cannon and fires 2 Prism Shots, dealing Cryo DMG. Radiance: Stellar-Conduct: The second Prism Shot instead deals Cryo DMG that is considered Stellar-Conduct DMG. While on the Hovermech, Sandrone repairs Fagio, causing Decoding Power to swiftly decrease."
    },
    {
      name: "Formule Phenomenale: Q.E.D.",
      type: "Elemental Burst",
      description: "Summons a large number of Prismatic Resonance Cannons for a frontal bombardment before firing a Convective Inhibition Ray, dealing AoE Cryo DMG. Radiance: Stellar-Conduct: The Convective Inhibition Ray instead deals AoE Cryo DMG that is considered Stellar-Conduct DMG."
    },
    {
      name: "Eternal Speculation Engine",
      type: "Passive Talent",
      description: "Radiance: Stellar-Conduct: When using Differential Analysis, if Fagio's Decoding Power is greater than 50, the second Prism Shot deals 400% of its original DMG as Fagio's Decoding Power is decreased. For every 10 points of Decoding Power Fagio loses, it gains 1 stack of Refined Tactics for 60s (max 10 stacks). When Sandrone uses Q.E.D. while in the Radiance: Stellar-Conduct state, all Refined Tactics stacks are cleared, causing the Convective Inhibition Ray to deal 100% + (stacks cleared) × 10% of its original DMG."
    },
    {
      name: "Light of Rationalisme",
      type: "Passive Talent",
      description: "When party members trigger Superconduct, it is changed to Stellar-Conduct, and party members' Base Stellar-Conduct DMG is increased based on Sandrone's ATK: every 100 ATK she has increases Base Stellar-Conduct DMG by 0.7%, up to a maximum of 14%. Additionally, when Sandrone is within a Polestar Field, she enters the Radiance: Stellar-Conduct state."
    },
    {
      name: "A Caucus Prelude and a Long Tale",
      type: "Utility Passive",
      description: "When Sandrone is in the party, you will gain additional snack rewards after turning in your Daily Commissions with Katheryne."
    }
  ],
  // Numeric effects (C1 +30% stellar reaction bonus, C2 beam CRIT DMG, C4 Extra
  // Cannon, C6 Cluster Beam) are applied/annotated by the mechanics resolver.
  constellations: [
    {
      level: 1, name: "Morrow After the Golden Dusk",
      description: "When in Decoding mode, Fagio's Decoding Power increases at a 50% lower rate, and all party members deal 30% increased Stellar-Conduct DMG.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "An Heiress Gazed Into the Looking-Glass",
      description: "Radiance: Stellar-Conduct: Increases CRIT DMG from Charged Attack condensed beams by 40%. Each time a beam is fired, CRIT DMG dealt by all condensed beams fired during this Decoding mode period is further increased by 20%. Max 3 stacks.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "Refuse the Wake of Dusk, the Moonlit Yoke",
      description: "Increases the Level of Formule Phenomenale: Self-Evident Proposition by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "normal" }]
    },
    {
      level: 4, name: "In Knowledge Lies the World's True Ground",
      description: "When Sandrone deals Stellar-Conduct DMG to an opponent, she summons an extra Prismatic Resonance Cannon to fire a coordinated attack dealing Cryo DMG at 125% of her ATK. This DMG is considered Stellar-Conduct DMG; once every 4s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Of All Beside, She Takes No Part",
      description: "Increases the Level of Formule Phenomenale: Q.E.D. by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "Narcissus Wakes, Her Eyes Upon the Dawn",
      description: "When Fagio fires a condensed beam for the third time in Decoding mode, it becomes a Condensed Cluster Beam firing continuously: up to 4 additional instances of AoE Cryo DMG at 100% of Sandrone's ATK on top of subsequent beams. Radiance: Stellar-Conduct: the 4 additional instances instead deal 80% of Sandrone's ATK as Stellar-Conduct DMG.",
      effects: [{ type: "informational" }]
    },
  ],
};
