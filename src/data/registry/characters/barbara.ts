import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const barbara: CharacterConfig = {
  id: "barbara",
  name: "Barbara",
  rarity: 4,
  element: "Hydro",
  weapon: "Catalyst",
  scalingSource: "hp",
  ascensionStat: { label: "HP%", maxValue: 24.0 },
  dmgBonusLabel: "Hydro DMG Bonus%",
  stats: coreStats("Hydro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Whisper of Water",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Hydro" },
        { key: "charged", name: "Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Hydro" },
        { key: "plunge", name: "Plunge Collision DMG", scaling: "atk", hitCategory: "plunge", element: "Hydro", plungeSubtype: "collision" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Hydro", plungeSubtype: "impact" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Hydro", plungeSubtype: "impact" },
      ],
    },
    {
      type: "skill",
      name: "Elemental Skill — Let the Show Begin♪",
      hits: [
        { key: "droplet-dmg", name: "Droplet DMG", scaling: "atk", hitCategory: "skill", element: "Hydro" },
        { key: "skill-heal-per-hit", name: "HP Regeneration Per Hit", scaling: "hp", kind: "heal" },
        { key: "skill-charged-heal", name: "HP Regeneration (Charged Attack)", scaling: "hp", kind: "heal" },
        { key: "skill-continuous-heal", name: "Continuous HP Regeneration", scaling: "hp", kind: "heal" },
      ],
    },
    {
      type: "burst",
      name: "Elemental Burst — Shining Miracle♪",
      hits: [
        { key: "burst-heal", name: "Regeneration", scaling: "hp", kind: "heal" },
      ],
    },
  ],
  mechanicDefs: [
    {
      id: "melody-loop-active",
      label: "Melody Loop Active (Let the Show Begin♪)",
      control: "toggle",
      defaultValue: 1,
      hint: "While Melody Loop is active, Barbara's attacks heal the party, active character regenerates HP continuously, and Stamina Consumption is decreased by 12% (A1 Glorious Season).",
    },
    {
      id: "c2-hydro-bonus",
      label: "C2 Vitality Burst (+15% Hydro DMG Bonus)",
      control: "toggle",
      defaultValue: 1,
      minConstellation: 2,
      hint: "During Let the Show Begin♪'s Melody Loop, active character gains a 15% Hydro DMG Bonus. Requires C2.",
    },
  ],
  mechanics: [
    "Glorious Season (A1): The Stamina Consumption of characters within Let the Show Begin♪'s Melody Loop is decreased by 12%.",
    "Encore (A4): When your active character gains an Elemental Orb/Particle, the duration of Let the Show Begin♪'s Melody Loop is extended by 1s (max 5s).",
    "With All My Heart♪: When a Perfect Cooking is achieved on a dish with restorative effects, there is a 12% chance to obtain double the product.",
    "Gleeful Songs (C1): Barbara regenerates 1 Energy every 10s.",
    "Vitality Burst (C2): Decreases the CD of Let the Show Begin♪ by 15%. During the ability's duration, your active character gains a 15% Hydro DMG Bonus.",
    "Star of Tomorrow (C3): Increases the Level of Shining Miracle♪ by 3. Maximum upgrade level is 15.",
    "Attentiveness be My Power (C4): Every opponent Barbara hits with her Charged Attack regenerates 1 Energy for her (max 5 Energy per Charged Attack).",
    "The Purest Companionship (C5): Increases the Level of Let the Show Begin♪ by 3. Maximum upgrade level is 15.",
    "Dedicating Everything to You (C6): When Barbara is in the party but not on the field, and one of your own party members falls, automatically revives the fallen character with 100% HP (once every 15 mins).",
  ],
  constellations: [
    {
      level: 1,
      name: "Gleeful Songs",
      description: "Barbara regenerates 1 Energy every 10s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "Vitality Burst",
      description: "Decreases the CD of Let the Show Begin♪ by 15%. During the ability's duration, your active character gains a 15% Hydro DMG Bonus.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "Star of Tomorrow",
      description: "Increases the Level of Shining Miracle♪ by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 4,
      name: "Attentiveness be My Power",
      description: "Every opponent Barbara hits with her Charged Attack regenerates 1 Energy for her. A maximum of 5 energy can be regenerated in this manner with one Charged Attack.",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "The Purest Companionship",
      description: "Increases the Level of Let the Show Begin♪ by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 6,
      name: "Dedicating Everything to You",
      description: "When Barbara is in the party but not on the field, and one of your own party members falls: Automatically revives the fallen character. Fully regenerates the revived character's HP to 100%. This effect can only occur once every 15 mins.",
      effects: [{ type: "informational" }],
    },
  ],
  wikiTalents: [
    {
      name: "Whisper of Water",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 4 water splash attacks that deal Hydro DMG. Charged Attack: Consumes a certain amount of Stamina to deal AoE Hydro DMG after a short casting time. Plunging Attack: Gathering the might of Hydro, Barbara plunges towards the ground from mid-air, damaging all opponents in her path. Deals AoE Hydro DMG upon impact with the ground.",
    },
    {
      name: "Let the Show Begin♪",
      type: "Elemental Skill",
      description: "Summons water droplets resembling musical notes that form a Melody Loop, dealing Hydro DMG to surrounding opponents and applying the Wet status to them. Melody Loop: Barbara's Normal Attacks heal all party members and nearby teammates for a certain amount of HP, which scales with Barbara's Max HP. Her Charged Attack generates 4 times the amount of healing. Periodically regenerates HP for the active character. Applies the Wet status to the character and opponents who come into contact with them.",
    },
    {
      name: "Shining Miracle♪",
      type: "Elemental Burst",
      description: "Heals nearby allied characters and your own party members for a large amount of HP that scales with Barbara's Max HP.",
    },
    {
      name: "Glorious Season",
      type: "Passive Talent",
      description: "The Stamina Consumption of characters within Let the Show Begin♪'s Melody Loop is decreased by 12%.",
    },
    {
      name: "Encore",
      type: "Passive Talent",
      description: "When your active character gains an Elemental Orb/Particle, the duration of Let the Show Begin♪'s Melody Loop is extended by 1s. The maximum extension is 5s.",
    },
    {
      name: "With All My Heart♪",
      type: "Utility Passive",
      description: "When a Perfect Cooking is achieved on a dish with restorative effects, there is a 12% chance to obtain double the product.",
    },
  ],
  support: {
    description: "Premier 4-star Hydro healer providing mobile continuous healing, team-wide emergency burst healing, stamina consumption reduction (-12%), and a +15% Hydro DMG Bonus to the active character (C2 Vitality Burst).",
    buffExplanations: [
      {
        name: "C2: Vitality Burst",
        brief: "+15% Hydro DMG to active character during Melody Loop",
        full: "During Let the Show Begin♪'s Melody Loop, your active character gains a 15% Hydro DMG Bonus. Requires C2.",
        category: "dmg_bonus",
      },
      {
        name: "A1: Glorious Season",
        brief: "-12% Stamina consumption within Melody Loop",
        full: "The Stamina Consumption of characters within Let the Show Begin♪'s Melody Loop is decreased by 12%.",
      },
      {
        name: "C6: Dedicating Everything to You",
        brief: "Revives fallen party member to 100% HP (15m CD)",
        full: "When Barbara is off the field, automatically revives a fallen party member to 100% HP once every 15 minutes. Requires C6.",
      },
    ],
    statFields: [
      { key: "hp", label: "Total HP", defaultValue: "28000" },
      { key: "baseHp", label: "Base HP", defaultValue: "9787" },
      { key: "energyRecharge", label: "Energy Recharge%", defaultValue: "140" },
      { key: "healingBonus", label: "Healing Bonus%", defaultValue: "35.9" },
      { key: "em", label: "Elemental Mastery", defaultValue: "80" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "40" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "80" },
      { key: "baseAtk", label: "Base ATK", defaultValue: "159" },
    ],
    buffs: [
      {
        stat: "hydroDmgBonus",
        label: "Hydro DMG (Barbara C2 Vitality Burst)",
        compute: (ctx) =>
          ctx.constellationLevel >= 2 &&
          (ctx.inputs["c2-hydro-bonus"] ?? 1) > 0 &&
          (ctx.inputs["melody-loop-active"] ?? 1) > 0
            ? 15
            : 0,
      },
    ],
    formatBriefStats: (ctx) => {
      const pills = [
        { label: "Total HP", value: Math.round(ctx.hp).toLocaleString("en-US") },
      ];
      if (ctx.constellationLevel >= 2 && (ctx.inputs["c2-hydro-bonus"] ?? 1) > 0) {
        pills.push({ label: "C2 Hydro", value: "+15.0% Hydro DMG" });
      }
      pills.push({ label: "Healing", value: `${(ctx.inputs["healingBonus"] ?? 35.9).toFixed(1)}%` });
      pills.push({ label: "ER", value: "140%" });
      return pills;
    },
  },
};
