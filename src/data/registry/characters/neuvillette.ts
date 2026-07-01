import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, hp } from "./hit-helpers";

// Mixed scaling: basic NA / regular Charged / Plunges scale on ATK; Equitable
// Judgment, Skill, and Burst scale on Max HP.
export const neuvillette: CharacterConfig = {
  id: "neuvillette", name: "Neuvillette", rarity: 5,
  element: "Hydro", weapon: "Catalyst", scalingSource: "hp",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "All DMG Bonus%",
  stats: coreStats("All DMG Bonus%"),
  talents: [
    { type: "normal", name: "Normal Attack", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
      atk("charged", "Charged Attack"),
      hp("equitable-judgment", "Charged Attack: Equitable Judgment (% Max HP)"),
      atk("plunge", "Plunge"), atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill", hits: [
      hp("skill-dmg", "Skill DMG (% Max HP)"), hp("spiritbreath-thorn", "Spiritbreath Thorn"),
    ] },
    // Burst per-level table not yet captured — stays manual until fetched.
    { type: "burst", name: "Elemental Burst", hits: [
      hp("skill-dmg", "Skill DMG (% Max HP)"), hp("waterfall", "Waterfall (% Max HP)"),
    ] },
  ],
  mechanics: ["Past Draconic Glories Stacks (0–3)","Max HP% buff"],
  panels: ["Active / Inactive + Refinement panel"],
  wikiTalents: [
    {
      name: "As the Water Seeks Equilibrium",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 3 attacks that deal Hydro DMG. Charged Attack: Consumes a certain amount of Stamina to unleash a surging Ring of Water, dealing AoE Hydro DMG. Charged Attack Charge: Insignia of Arbitration: While charging, Neuvillette will gather the power of water, gradually forming an Insignia of Arbitration. Under this state, he can move and change orientation, and will absorb any Sourcewater Droplets in a certain AoE. Each Droplet he absorbs will increase the formation speed of the Insignia, and will heal Neuvillette based on his Max HP. If the charging is stopped before the Insignia is fully formed, he will unleash a Charged Attack. If it is fully formed, he will unleash a Charged Attack: Equitable Judgment. Charged Attack: Equitable Judgment: Unleashes torrents of raging water, dealing continuous AoE Hydro DMG to all opponents in a straight line area in front of him. Equitable Judgment will not consume any Stamina and lasts for 3s. If Neuvillette's HP is above 50%, he will continuously lose HP while using this attack. Plunging Attack: Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE Hydro DMG upon impact."
    },
    {
      name: "O Tears, I Shall Repay",
      type: "Elemental Skill",
      description: "Summons a Raging Waterfall that deals AoE Hydro DMG to opponents in front of him based on Neuvillette's Max HP. After hitting an opponent, this skill will generate 3 Sourcewater Droplets near that opponent. Arkhe: Pneuma: At certain intervals, when the Raging Waterfall descends, a Spiritbreath Thorn will descend and pierce opponents, dealing Pneuma-aligned Hydro DMG."
    },
    {
      name: "O Tides, I Have Returned",
      type: "Elemental Burst",
      description: "Unleashes a rupturing wave that deals AoE Hydro DMG based on Neuvillette's Max HP. After a short interval, 2 waterfalls will descend and deal Hydro DMG in a smaller AoE, and will generate 6 Sourcewater Droplets within a forward-pointing area."
    },
    {
      name: "Heir to the Ancient Sea's Authority",
      type: "Passive Talent",
      description: "When a party member triggers a Vaporize, Freeze, Electro-Charged, Bloom, Hydro Swirl, or Hydro Crystallize reaction on an opponent, Neuvillette gains 1 stack of Past Draconic Glories for 30s. Max 3 stacks. This will increase the DMG dealt by Charged Attack: Equitable Judgment by 110%/125%/160% of its original DMG. Stacks created by each reaction type are independent of each other."
    },
    {
      name: "Discipline of the Supreme Arbitration",
      type: "Passive Talent",
      description: "For every 1% of Neuvillette's current HP that exceeds 30% of his Max HP, he gains 0.6% Hydro DMG Bonus. Max 30% bonus can be obtained in this way."
    },
    {
      name: "Gather Like the Tide",
      type: "Passive Talent",
      description: "Increases underwater sprint SPD for your own party members by 15%. Not stackable with other Passive Talents that provide the exact same effect."
    }
  ]
};
