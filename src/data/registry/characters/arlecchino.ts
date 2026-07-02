import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk } from "./hit-helpers";

export const arlecchino: CharacterConfig = {
  id: "arlecchino", name: "Arlecchino", rarity: 5,
  element: "Pyro", weapon: "Polearm", scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "DMG Bonus%",
  stats: coreStats("DMG Bonus%"),
  talents: [
    { type: "normal", name: "Normal Attack — Invitation to a Beheading", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
      atk("4-hit-a", "4-Hit A"), atk("4-hit-b", "4-Hit B"),
      atk("5-hit", "5-Hit"), atk("6-hit", "6-Hit"),
      atk("charged", "Charged Attack"), atk("plunge", "Plunge"),
      atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill — All Is Ash", hits: [
      atk("spike", "Spike"), atk("cleave", "Cleave"), atk("blood-debt-directive", "Blood-Debt Directive"),
    ] },
    { type: "burst", name: "Elemental Burst — Balemoon Rising", hits: [atk("skill-dmg", "Skill DMG")] },
  ],
  mechanicDefs: [
    { id: "bond-of-life", label: "Bond of Life (% Max HP)", control: "percent", max: 200, defaultValue: 100,
      hint: "Masque flat DMG on NA = Masque% × BoL% × ATK (and C6 Burst bonus)" },
    { id: "pyro-bonus", label: "In combat (Balemoon passive)", control: "toggle", defaultValue: 1,
      hint: "+40% Pyro DMG Bonus while in combat" },
  ],
  mechanics: ["Masque of the Red Death: NA base DMG = ATK × (Talent% + Masque% × BoL/MaxHP) — ATK-scaled, Max HP does not affect it","Burst heal = 150% BoL + 150% ATK (only healing she can receive)"],
  notes: ["Has ICD — amplifying (Vaporize/Melt) totals may be approximate."],
  wikiTalents: [
    {
      name: "Invitation to a Beheading",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 6 attacks. Charged Attack: Consumes Stamina to dash and cleave; holding sustains high-speed movement at a Stamina cost. Plunging Attack: Plunges from mid-air, dealing AoE DMG on impact. Masque of the Red Death: once her Bond of Life reaches 30% of Max HP, her Normal/Charged/Plunging Attacks convert to Pyro DMG that cannot be overridden, and her Normal Attacks deal extra DMG scaling off her ATK multiplied by the Masque Increase ratio of her current Bond of Life percentage (base DMG = ATK × (Talent% + Masque% × BoL/Max HP)), consuming 7.5% of the Bond of Life per hit."
    },
    {
      name: "All Is Ash",
      type: "Elemental Skill",
      description: "Deals AoE Pyro DMG (Spike) and a dash-cleave against one target (Cleave), marking enemies with a Blood-Debt Directive that periodically ticks Pyro DMG. After 5s a Directive upgrades to a Blood-Debt Due. Charged Attacks or the Elemental Burst absorb nearby Directives/Dues, granting Bond of Life (~65% Max HP per Directive, ~130% per Due, capped ~145% within the post-cast window)."
    },
    {
      name: "Balemoon Rising",
      type: "Elemental Burst",
      description: "A wide AoE Pyro nuke that absorbs remaining Directives/Dues, resets the Elemental Skill cooldown, and heals Arlecchino for 150% of her Bond of Life plus 150% of her ATK."
    },
    {
      name: "Agony Alone May Be Repaid",
      type: "Passive Talent",
      description: "Blood-Debt Directives grant a Bond of Life worth 130% of Max HP when a marked opponent is defeated; Dues grant 130% when absorbed (within the original cap)."
    },
    {
      name: "Strength Alone Can Defend",
      type: "Passive Talent",
      description: "Gains 1% All Elemental and Physical RES for every 100 ATK above 1,000, up to a maximum of 20%."
    },
    {
      name: "The Balemoon Alone May Know",
      type: "Passive Talent",
      description: "While in combat, Arlecchino gains a 40% Pyro DMG Bonus, and can only be healed through Balemoon Rising."
    }
  ],
  // Numeric constellation effects (C1 Masque +100pp, C6 Burst/CRIT bonuses) are applied
  // by the mechanics resolver (src/lib/engine/mechanics.ts) using the selected C-level.
  constellations: [
    {
      level: 1, name: "\"All Reprisals and Arrears, Mine to Bear...\"",
      description: "Masque of the Red Death is further enhanced: the value of the increase gains +100%. Interruption resistance up while attacking under the Masque.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "\"All Rewards and Retribution, Mine to Bestow...\"",
      description: "Blood-Debt Directives are applied already upgraded to Dues. Absorbing one unleashes Balemoon Bloodfire: 900% ATK AoE Pyro DMG, +20% All RES for 15s (once every 10s).",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "\"You Shall Become a New Member of Our Family...\"",
      description: "Increases the Level of Normal Attack: Invitation to a Beheading by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "normal" }]
    },
    {
      level: 4, name: "\"You Shall Love and Protect Each Other Henceforth...\"",
      description: "Absorbing a Blood-Debt Directive decreases Balemoon Rising's CD by 2s and restores 15 Energy (once every 10s).",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "\"For Alone, We Are as Good as Dead...\"",
      description: "Increases the Level of Balemoon Rising by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "\"From This Day On, We Shall Delight in New Life Together.\"",
      description: "Balemoon Rising DMG increased by ATK × 700% of current Bond of Life percentage. For 20s after All Is Ash: Normal Attacks and Burst gain +10% CRIT Rate and +70% CRIT DMG (once every 15s).",
      effects: [{ type: "informational" }]
    },
  ],
};
