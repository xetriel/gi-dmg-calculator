import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const aino: CharacterConfig = {
  id: "aino",
  name: "Aino",
  rarity: 4,
  element: "Hydro",
  weapon: "Claymore",
  scalingSource: "atk",
  ascensionStat: { label: "Elemental Mastery", maxValue: 96 },
  dmgBonusLabel: "Hydro DMG Bonus%",
  stats: coreStats("Hydro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Bish-Bash-Bosh Repair",
      hits: [
        atk("1-hit", "1-Hit DMG"),
        atk("2-hit", "2-Hit DMG"),
        atk("3-hit-a", "3-Hit DMG (Hit 1)"),
        atk("3-hit-b", "3-Hit DMG (Hit 2)"),
        atkCharged("charged-loop", "Charged Attack Loop DMG"),
        atkCharged("charged-final", "Charged Attack Final DMG"),
        atkPlunge("plunge", "Plunge DMG"),
        atkPlunge("low-plunge", "Low Plunge DMG"),
        atkPlunge("high-plunge", "High Plunge DMG"),
      ],
    },
    {
      type: "skill",
      name: "Elemental Skill — Musecatcher",
      hits: [
        atk("skill-stage-1", "Stage 1 DMG"),
        atk("skill-stage-2", "Stage 2 DMG (AoE)"),
      ],
    },
    {
      type: "burst",
      name: "Elemental Burst — Precision Hydronic Cooler",
      hits: [
        { key: "water-ball", name: "Water Ball DMG", scaling: "atk", hitCategory: "burst" },
        { key: "water-ball-enhanced", name: "Water Ball DMG (Ascendant Gleam)", scaling: "atk", hitCategory: "burst" },
        { key: "c2-water-ball", name: "C2 Principle of Transference Water Ball", scaling: "atk", hitCategory: "burst" },
      ],
    },
  ],
  mechanics: [
    "Structured Power Booster (A4): Increases Elemental Burst DMG by 50% of her Elemental Mastery as additive base DMG.",
    "Modular Efficiency Protocol (A1): Under Moonsign: Ascendant Gleam, Burst fires water balls every 0.75s (up to 20 shots) across a larger AoE.",
    "Force Limit Analysis (Moonsign Benediction): When Aino is in the party, the party's Moonsign increases by 1 level.",
    "The Principle of Transference in Gear Differentials (C2): While Aino is off-field during Burst, active teammate hits trigger a water ball dealing 25% ATK + 100% EM (Burst DMG, 5s CD).",
    "The Burden of Creative Genius (C6): Burst cast elevates active characters' Electro-Charged, Bloom, Lunar-Charged, Lunar-Bloom, and Lunar-Crystallize reaction DMG by 15% (35% under Ascendant Gleam) for 15s.",
  ],
  mechanicDefs: [
    {
      id: "moonsign-ascendant-gleam",
      label: "Moonsign: Ascendant Gleam",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: Burst fires water balls every 0.75s (20 total) across wider AoE. C6: Further elevates reaction DMG bonus to +35% total.",
    },
    {
      id: "off-field-state",
      label: "Aino Off-Field State",
      control: "toggle",
      defaultValue: 1,
      hint: "Enables C2 Principle of Transference water ball procs (fires every 5s while off-field during Burst).",
    },
    {
      id: "c1-ash-field-em",
      label: "Ash—Field Equilibrium active (C1 EM Boost)",
      control: "toggle",
      defaultValue: 1,
      hint: "Skill/Burst cast grants +80 EM to Aino and active party members for 15s. Requires C1.",
    },
    {
      id: "c6-creative-genius",
      label: "The Burden of Creative Genius active (C6 Reaction Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "After Burst: +15% Reaction DMG (+35% with Ascendant Gleam) to Electro-Charged, Bloom, Lunar-Charged, Lunar-Bloom, and Lunar-Crystallize for 15s. Requires C6.",
    },
  ],
  wikiTalents: [
    {
      name: "Bish-Bash-Bosh Repair",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 3 consecutive strikes. Charged Attack: Drains Stamina over time to perform continuous spinning attacks against all nearby opponents. At the end of the sequence, performs a more powerful slash. Plunging Attack: Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.",
    },
    {
      name: "Musecatcher",
      type: "Elemental Skill",
      description: "Aino throws a Musecatcher forward, dealing Hydro DMG and dragging her along behind it. When the dragging stops, Aino deals AoE Hydro DMG to nearby opponents. Holding the Skill enters Aiming Mode to adjust throwing direction. CD 10s. Generates 3 Elemental Particles on hit.",
    },
    {
      name: "Precision Hydronic Cooler",
      type: "Elemental Burst",
      description: "Aino deploys a custom water-spraying device, the Cool Your Jets Ducky, to establish a Focused Hydronic Cooling Zone for 14s. While active, the Cool Your Jets Ducky periodically fires water balls at nearby opponents, dealing Hydro DMG. Normal interval: 1.5s (up to 9 shots). CD 13.5s, Energy Cost 50.",
    },
    {
      name: "Modular Efficiency Protocol",
      type: "1st Ascension Passive",
      description: "Aino will be granted the corresponding buff effects based on the party's Moonsign. Moonsign: Ascendant Gleam: Her Elemental Burst Precision Hydronic Cooler is enhanced: The Cool Your Jets Ducky will fire water balls more frequently (every 0.75s, up to 20 shots), and the water balls will deal AoE Hydro DMG over a larger area of effect.",
    },
    {
      name: "Structured Power Booster",
      type: "4th Ascension Passive",
      description: "Aino's Elemental Burst DMG is increased by 50% of her Elemental Mastery (additive base damage buff).",
    },
    {
      name: "Force Limit Analysis",
      type: "Moonsign Benediction Passive",
      description: "When Aino is in the party, the party's Moonsign will increase by 1 level.",
    },
    {
      name: "Miniaturized Detection Sensor",
      type: "Utility Passive",
      description: "Displays the location of nearby resources unique to Nod-Krai on the mini-map. Additionally, the appearance of the Cool Your Jets Ducky can be altered by purchasing Aino's Toolbox from the Workshop's Trove.",
    },
  ],
  constellations: [
    {
      level: 1,
      name: "The Theory of Ash—Field Equilibrium",
      description: "After Aino uses her Elemental Skill Musecatcher or her Elemental Burst Precision Hydronic Cooler, her Elemental Mastery will be increased by 80. The Elemental Mastery of other nearby active party members will be increased by 80 for 15s. The Elemental Mastery-increasing effects of this Constellation do not stack.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "The Principle of Transference in Gear Differentials",
      description: "If Aino is off-field while the Focused Hydronic Cooling Zone of her Elemental Burst Precision Hydronic Cooler is active, when your active party member hits a nearby opponent with an attack, the Cool Your Jets Ducky will fire an additional water ball at that opponent, dealing AoE Hydro DMG equal to 25% of Aino's ATK and 100% of her Elemental Mastery. This DMG is considered Elemental Burst DMG. This effect can be triggered once every 5s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "Cake and the Art of Mechanism Repair",
      description: "Increases the Level of Precision Hydronic Cooler by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 4,
      name: "Butter and Cats and the Law of Energy Supply",
      description: "When the Elemental Skill Musecatcher hits an opponent, it will restore 10 Elemental Energy for Aino. Energy can be restored to her in this manner once every 10s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "Perpetual Turbine of Metal and Light",
      description: "Increases the Level of Musecatcher by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 6,
      name: "The Burden of Creative Genius",
      description: "For the next 15s after using the Elemental Burst Precision Hydronic Cooler, DMG from nearby active characters' Electro-Charged, Bloom, Lunar-Charged, Lunar-Bloom, and Lunar-Crystallize reactions is increased by 15%. Moonsign: Ascendant Gleam: DMG from the aforementioned reactions will be further increased by 20%.",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description: "Moonsign Hydro sub-DPS and reaction amplifier. Shares EM with active characters via C1, increases party Moonsign level by 1, and elevates party Electro-Charged, Bloom, Lunar-Charged, Lunar-Bloom, and Lunar-Crystallize reaction DMG at C6.",
    buffExplanations: [
      {
        name: "C1: Ash—Field Equilibrium",
        brief: "+80 EM to party",
        full: "After using Skill or Burst, increases Aino and nearby active party members' Elemental Mastery by 80 for 15s. Requires C1.",
        category: "stat_share",
      },
      {
        name: "C6: Creative Genius",
        brief: "+15% / +35% Reaction DMG",
        full: "For 15s after using Burst, increases active character's Electro-Charged, Bloom, Lunar-Charged, Lunar-Bloom, and Lunar-Crystallize reaction DMG by 15% (elevated to +35% with Moonsign: Ascendant Gleam). Requires C6.",
        category: "lunar",
      },
      {
        name: "Moonsign Benediction",
        brief: "+1 Moonsign Level",
        full: "Increases the party's Moonsign by 1 level when in the party.",
        category: "lunar",
      },
    ],
    statFields: [
      { key: "atk", label: "Total ATK", defaultValue: "1400" },
      { key: "em", label: "Elemental Mastery", defaultValue: "600" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "50" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "100" },
      { key: "energyRecharge", label: "Energy Recharge", defaultValue: "180" },
    ],
    buffs: [
      {
        stat: "em",
        label: "EM (Aino C1)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 1) return 0;
          if ((ctx.inputs["c1-ash-field-em"] ?? 1) <= 0) return 0;
          return 80;
        },
      },
      {
        stat: "electroChargedDmgBonus",
        label: "Electro-Charged DMG (Aino C6)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-creative-genius"] ?? 1) <= 0) return 0;
          return (ctx.inputs["moonsign-ascendant-gleam"] ?? 1) > 0 ? 35 : 15;
        },
      },
      {
        stat: "bloomDmgBonus",
        label: "Bloom DMG (Aino C6)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-creative-genius"] ?? 1) <= 0) return 0;
          return (ctx.inputs["moonsign-ascendant-gleam"] ?? 1) > 0 ? 35 : 15;
        },
      },
      {
        stat: "lunarChargedDmgBonus",
        label: "Lunar-Charged DMG (Aino C6)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-creative-genius"] ?? 1) <= 0) return 0;
          return (ctx.inputs["moonsign-ascendant-gleam"] ?? 1) > 0 ? 35 : 15;
        },
      },
      {
        stat: "lunarBloomDmgBonus",
        label: "Lunar-Bloom DMG (Aino C6)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-creative-genius"] ?? 1) <= 0) return 0;
          return (ctx.inputs["moonsign-ascendant-gleam"] ?? 1) > 0 ? 35 : 15;
        },
      },
      {
        stat: "lunarCrystallizeDmgBonus",
        label: "Lunar-Crystallize DMG (Aino C6)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-creative-genius"] ?? 1) <= 0) return 0;
          return (ctx.inputs["moonsign-ascendant-gleam"] ?? 1) > 0 ? 35 : 15;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "EM", value: fmt(ctx.em) },
        { label: "Total ATK", value: fmt(ctx.atk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
        { label: "ER", value: `${fmt(ctx.inputs["energyRecharge"] ?? 180)}%` },
      ];
    },
  },
};
