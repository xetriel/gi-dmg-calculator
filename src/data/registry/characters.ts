import type { CharacterConfig, TalentHit } from "./types";
import { coreStats } from "./core-stats";

// Helpers: build a hit that scales off ATK or HP. `key` is the stable id joined
// to the TalentScaling table; `name` is the display label. Per-hit scaling matters
// because a character's hits are not always uniform (see Neuvillette below).
const atk = (key: string, name: string): TalentHit => ({ key, name, scaling: "atk" });
const hp = (key: string, name: string): TalentHit => ({ key, name, scaling: "hp" });

export const arlecchino: CharacterConfig = {
  id: "arlecchino", name: "Arlecchino", rarity: 5,
  element: "Pyro", weapon: "Polearm", scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "DMG Bonus%",
  stats: coreStats("DMG Bonus%"),
  talents: [
    { type: "normal", name: "Normal Attack", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
      atk("4-hit-a", "4-Hit A"), atk("4-hit-b", "4-Hit B"),
      atk("5-hit", "5-Hit"), atk("6-hit", "6-Hit"),
      atk("charged", "Charged Attack"), atk("plunge", "Plunge"),
      atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    // Skill has no per-level multiplier table (fixed values only) — stays manual.
    { type: "skill", name: "Elemental Skill", hits: [
      atk("spike", "Spike"), atk("cleave", "Cleave"), atk("blood-debt-directive", "Blood-Debt Directive"),
    ] },
    { type: "burst", name: "Elemental Burst", hits: [atk("skill-dmg", "Skill DMG")] },
  ],
  mechanics: ["Masque of the Red Death Increase%","Bond of Life% (max 200)","Additional DMG (Normal Attack)","Additional DMG (Elemental Burst)","Normal Attack Type flag"],
  notes: ["Has ICD — amplifying (Vaporize/Melt) totals may be approximate."],
};

export const huTao: CharacterConfig = {
  id: "hu-tao", name: "Hu Tao", rarity: 5,
  element: "Pyro", weapon: "Polearm", scalingSource: "hp",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  // Hits scale on ATK; her skill converts Max HP into bonus ATK, so enter the
  // in-Paramita total ATK. (scalingSource stays "hp" as the conceptual source.)
  talents: [
    { type: "normal", name: "Normal Attack", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit"),
      atk("4-hit", "4-Hit"), atk("5-hit", "5-Hit"), atk("6-hit", "6-Hit"),
      atk("charged", "Charged Attack"), atk("plunge", "Plunge"),
      atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill — Blood Blossom", hits: [atk("blood-blossom", "Blood Blossom")] },
    { type: "burst", name: "Elemental Burst — Spirit Soother", hits: [
      atk("skill-dmg", "Skill DMG"), atk("low-hp-skill-dmg", "Low-HP Skill DMG"),
    ] },
  ],
  panels: ["Party panel (Xianyun / Furina / Yelan)","Signature Weapon + Refinement","HP ≤ 50% Paramita state toggle"],
  wikiTalents: [
    {
      name: "Secret Spear of Wangsheng",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 6 rapid spear strikes. Charged Attack: Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the path. Plunging Attack: Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact."
    },
    {
      name: "Guide to Afterlife",
      type: "Elemental Skill",
      description: "Hu Tao consumes a set portion of her HP to knock the surrounding enemies back and enter the Paramita Papilio state. Paramita Papilio: Increases Hu Tao's ATK based on her Max HP at the time of entering this state. ATK Bonus gained this way cannot exceed 400% of Hu Tao's Base ATK. Converts Attack DMG to Pyro DMG, which cannot be overridden by any other elemental infusion. Charged Attacks apply the Blood Blossom effect to enemies hit. Increases Hu Tao's resistance to interruption. Blood Blossom: Enemies affected by Blood Blossom will take Pyro DMG every 4s. This DMG is considered Elemental Skill DMG. Each enemy can be affected by only one Blood Blossom effect at a time, and its duration may only be refreshed by Hu Tao herself."
    },
    {
      name: "Spirit Soother",
      type: "Elemental Burst",
      description: "Commands a blazing spirit to attack, dealing Pyro DMG in a large AoE. Upon striking enemies, regenerates a percentage of Hu Tao's Max HP. This effect can be triggered up to 5 times, based on the number of enemies hit. If Hu Tao's HP is equal to or less than 50% when the skill hits, both the DMG and HP Regeneration are increased."
    },
    {
      name: "Flutter By",
      type: "Passive Talent",
      description: "When a Paramita Papilio state activated by Guide to Afterlife ends, all allies in the party (excluding Hu Tao herself) will have their CRIT Rate increased by 12% for 8s."
    },
    {
      name: "Sanguine Rouge",
      type: "Passive Talent",
      description: "When Hu Tao's HP is equal to or less than 50%, her Pyro DMG Bonus is increased by 33%."
    },
    {
      name: "The More the Merrier",
      type: "Passive Talent",
      description: "When Hu Tao cooks a dish perfectly, she has a 18% chance to receive an additional 'Suspicious' dish of the same type."
    }
  ],
  constellations: [
    {
      level: 1, name: "Crimson Bouquet",
      description: "While in Paramita Papilio state, Hu Tao's Charged Attacks do not consume Stamina.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "Ominous Rainfall",
      description: "Increases Blood Blossom DMG by 10% of Hu Tao's Max HP. Spirit Soother also applies Blood Blossom.",
      effects: [{
        type: "flat_dmg_bonus",
        affectedHitKeys: ["blood-blossom"],
        bonusScaling: "hp",
        bonusPercent: 10,
      }]
    },
    {
      level: 3, name: "Lingering Carmine",
      description: "Increases the Level of Guide to Afterlife by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "Garden of Eternal Rest",
      description: "Upon defeating an enemy affected by Blood Blossom, all nearby allies' CRIT Rate +12% for 15s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Floral Incense",
      description: "Increases the Level of Spirit Soother by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "Butterfly's Embrace",
      description: "When HP drops below 25%: CRIT Rate +100%, Elemental & Physical RES +200% for 10s. 60s cooldown.",
      effects: [{
        type: "stat_bonus",
        statKey: "critRate",
        statValue: 100,
        condition: "HP < 25%"
      }]
    },
  ]
};

export const neuvillette: CharacterConfig = {
  id: "neuvillette", name: "Neuvillette", rarity: 5,
  element: "Hydro", weapon: "Catalyst", scalingSource: "hp",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "All DMG Bonus%",
  stats: coreStats("All DMG Bonus%"),
  // Mixed scaling: basic NA / regular Charged / Plunges scale on ATK; Equitable
  // Judgment, Skill, and Burst scale on Max HP.
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

export const clorinde: CharacterConfig = {
  id: "clorinde", name: "Clorinde", rarity: 5,
  // Corrected from the Excel's leftover metadata (it carried Arlecchino's Pyro/Polearm/CRIT DMG).
  element: "Electro", weapon: "Sword", scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "DMG Bonus%",
  stats: coreStats("DMG Bonus%"),
  // No per-level tables retrievable yet — all hits stay manual until fetched.
  talents: [
    { type: "normal", name: "Normal Attack", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit-x2", "3-Hit ×2"),
      atk("4-hit-x3", "4-Hit ×3"), atk("5-hit", "5-Hit"),
      atk("charged", "Charged Attack (Stamina 20)"),
      atk("plunge", "Plunge"), atk("low-plunge", "Low Plunge"), atk("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill", hits: [
      atk("swift-hunt-1", "Swift Hunt 1"), atk("swift-hunt-2", "Swift Hunt 2"),
      atk("impale-1", "Impale the Night 1"), atk("impale-2", "Impale the Night 2"),
      atk("impale-3", "Impale the Night 3"), atk("surging-blade", "Surging Blade"),
    ] },
    { type: "burst", name: "Elemental Burst", hits: [atk("skill-dmg-x5", "Skill DMG ×5")] },
  ],
  mechanics: ["Bond of Life thresholds (≥100% / <100% / 0%) select skill variants","Passive CRIT Rate bonus"],
  panels: ["Nahida support panel"],
};

export const CHARACTERS: CharacterConfig[] = [arlecchino, huTao, neuvillette, clorinde];
export const byId = (id: string) => CHARACTERS.find(c => c.id === id);
