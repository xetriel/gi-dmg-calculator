import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge, hp } from "./hit-helpers";

export const candace: CharacterConfig = {
  id: "candace",
  name: "Candace",
  rarity: 4,
  element: "Hydro",
  weapon: "Polearm",
  scalingSource: "hp",
  ascensionStat: { label: "HP%", maxValue: 24.0 },
  dmgBonusLabel: "Hydro DMG Bonus%",
  stats: coreStats("Hydro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack: Gleaming Spear - Guardian Stance",
      hits: [
        atk("1-hit", "1-Hit DMG"),
        atk("2-hit", "2-Hit DMG"),
        atk("3-hit-1", "3-Hit DMG (1/2)"),
        atk("3-hit-2", "3-Hit DMG (2/2)"),
        atk("4-hit", "4-Hit DMG"),
        atkCharged("charged", "Charged Attack DMG"),
        atkPlunge("plunge", "Plunge DMG"),
        atkPlunge("low-plunge", "Low Plunge DMG"),
        atkPlunge("high-plunge", "High Plunge DMG"),
      ],
    },
    {
      type: "skill",
      name: "Sacred Rite: Heron's Sanctum",
      hits: [
        hp("basic-dmg", "Basic DMG (Tap)"),
        hp("charged-up-dmg", "Charged Up DMG (Hold)"),
        { key: "shield", name: "Shield DMG Absorption", scaling: "hp", kind: "shield" },
      ],
    },
    {
      type: "burst",
      name: "Sacred Rite: Wagtail's Tide",
      hits: [
        hp("skill-dmg", "Skill DMG"),
        hp("wave-impact-dmg", "Wave Impact DMG"),
        { key: "c6-the-overflow", name: "The Overflow DMG (C6)", scaling: "hp", hitCategory: "burst", element: "Hydro" },
      ],
    },
  ],
  mechanics: [
    "Sacred Rite: Wagtail's Tide: Grants Prayer of the Crimson Crown. Active characters deal +20% increased Elemental DMG with Normal Attacks, and Sword, Claymore, and Polearm characters obtain Hydro Infusion.",
    "Celestial Dome of Sand (A4): Characters affected by Prayer of the Crimson Crown deal an additional 0.5% increased DMG for every 1,000 points of Candace's Max HP when dealing Elemental DMG with Normal Attacks.",
    "Moon-Piercing Brilliance (C2): When Sacred Rite: Heron's Sanctum hits opponents, Candace's Max HP is increased by 20% for 15s.",
    "The Overflow (C6): When characters (excluding Candace) deal Elemental DMG with Normal Attacks under Prayer of the Crimson Crown, an attack wave is unleashed dealing 15% of Candace's Max HP as AoE Hydro Burst DMG (every 2.3s).",
  ],
  mechanicDefs: [
    {
      id: "prayer-of-crimson-crown",
      label: "Prayer of the Crimson Crown (Burst Active)",
      control: "toggle",
      defaultValue: 1,
      hint: "Active characters deal increased Elemental DMG with Normal Attacks (+20% base + 0.5% per 1,000 Max HP from A4). Candace gains Hydro Infusion.",
    },
    {
      id: "c2-max-hp-buff",
      label: "C2: Moon-Piercing Brilliance (+20% Max HP)",
      control: "toggle",
      defaultValue: 1,
      hint: "When Sacred Rite: Heron's Sanctum hits opponents, Candace's Max HP is increased by 20% for 15s. Requires C2.",
    },
  ],
  wikiTalents: [
    {
      name: "Gleaming Spear - Guardian Stance",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 4 consecutive spear strikes. Charged Attack: Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way. Plunging Attack: Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.",
    },
    {
      name: "Sacred Rite: Heron's Sanctum",
      type: "Elemental Skill",
      description: "Tap: Rushes forward with her shield, dealing Hydro DMG to opponents in front of her. Hold: Raises her shield to block incoming attacks from nearby opponents, forming a barrier that absorbs DMG based on her Max HP (250% effective against Hydro DMG). Releases a leaping strike dealing Hydro DMG upon release, expiration, or barrier breaking.",
    },
    {
      name: "Sacred Rite: Wagtail's Tide",
      type: "Elemental Burst",
      description: "Deals AoE Hydro DMG based on Max HP and confers Prayer of the Crimson Crown on the active character: Characters deal increased Elemental DMG with Normal Attacks; unleashing a rippling wave dealing Hydro DMG when switching characters (up to 3 times); Sword, Claymore, and Polearm characters gain Hydro Infusion.",
    },
    {
      name: "Aegis of Crossed Arrows",
      type: "Passive Talent",
      description: "If Candace is hit by an attack in the Hold duration of Sacred Rite: Heron's Sanctum, that skill will finish charging instantly.",
    },
    {
      name: "Celestial Dome of Sand",
      type: "Passive Talent",
      description: "Characters affected by the Prayer of the Crimson Crown caused by Sacred Rite: Wagtail's Tide will deal 0.5% increased DMG to opponents for every 1,000 points of Candace's Max HP when they deal Elemental DMG with their Normal Attacks.",
    },
    {
      name: "To Dawn's First Light",
      type: "Utility Passive",
      description: "Decreases climbing Stamina consumption for your own party members by 20%. Not stackable with Passive Talents that provide the exact same effects.",
    },
  ],
  constellations: [
    {
      level: 1,
      name: "Returning Heiress of the Scarlet Sands",
      description: "The duration of Prayer of the Crimson Crown effect triggered by Sacred Rite: Wagtail's Tide is increased by 3s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "Moon-Piercing Brilliance",
      description: "When Sacred Rite: Heron's Sanctum hits opponents, Candace's Max HP will be increased by 20% for 15s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "Hunter's Supplication",
      description: "Increases the Level of Sacred Rite: Wagtail's Tide by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 4,
      name: "Sentinel Oath",
      description: "Shortens the Hold CD of Sacred Rite: Heron's Sanctum to be the same as that of the Tapping CD (9s to 6s).",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "Heterochromatic Gaze",
      description: "Increases the Level of Sacred Rite: Heron's Sanctum by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 6,
      name: "The Overflow",
      description: "When characters (excluding Candace herself) affected by the Prayer of the Crimson Crown caused by Sacred Rite: Wagtail's Tide deal Elemental DMG to opponents using Normal Attacks, an attack wave will be unleashed that deals AoE Hydro DMG equal to 15% of Candace's Max HP. This effect can trigger once every 2.3s and is considered Elemental Burst DMG.",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description: "Hydro buffer and normal attack enabler. Grants Prayer of the Crimson Crown (+20% Normal Attack Elemental DMG Bonus + 0.5% per 1,000 Max HP from A4) and Hydro Infusion to melee characters, plus off-field AoE Hydro DMG at C6.",
    buffExplanations: [
      {
        name: "Prayer of the Crimson Crown & A4 Celestial Dome of Sand",
        brief: "+20% Normal Attack DMG + 0.5% per 1,000 Max HP",
        full: "Active characters deal +20% increased Elemental DMG with their Normal Attacks. A4 Celestial Dome of Sand increases this by an additional 0.5% for every 1,000 points of Candace's Max HP.",
        category: "dmg_bonus",
      },
      {
        name: "Hydro Infusion",
        brief: "Hydro Infusion for Sword, Claymore, Polearm",
        full: "Sword, Claymore, and Polearm-wielding characters under Prayer of the Crimson Crown gain Hydro Infusion.",
        category: "elemental",
      },
      {
        name: "C6: The Overflow",
        brief: "15% Max HP AoE Hydro Burst DMG wave (every 2.3s)",
        full: "When characters (excluding Candace herself) affected by Prayer of the Crimson Crown deal Elemental DMG using Normal Attacks, unleashes an attack wave dealing 15% Max HP as AoE Hydro Burst DMG.",
        category: "flat_dmg",
      },
    ],
    statFields: [
      { key: "hp", label: "Max HP", defaultValue: "35000" },
      { key: "baseHp", label: "Base HP", defaultValue: "10875" },
      { key: "critRate", label: "CRIT Rate%", defaultValue: "50" },
      { key: "critDmg", label: "CRIT DMG%", defaultValue: "100" },
      { key: "energyRecharge", label: "Energy Recharge%", defaultValue: "180" },
    ],
    buffs: [
      {
        stat: "normalDmgBonus",
        label: "Normal ATK DMG (Candace Burst + A4)",
        compute: (ctx) => {
          if ((ctx.inputs["prayer-of-crimson-crown"] ?? 1) <= 0) return 0;
          const c2Bonus = ctx.constellationLevel >= 2 && (ctx.inputs["c2-max-hp-buff"] ?? 1) > 0
            ? (ctx.baseHp || 10875) * 0.20
            : 0;
          const effectiveHp = (ctx.hp || 35000) + c2Bonus;
          const baseBonus = 20;
          const a4Bonus = (effectiveHp / 1000) * 0.5;
          return baseBonus + a4Bonus;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      const c2Bonus = ctx.constellationLevel >= 2 && (ctx.inputs["c2-max-hp-buff"] ?? 1) > 0
        ? (ctx.baseHp || 10875) * 0.20
        : 0;
      const totalHp = (ctx.hp || 35000) + c2Bonus;
      const naBuff = 20 + (totalHp / 1000) * 0.5;
      return [
        { label: "Max HP", value: fmt(totalHp) },
        { label: "NA Buff", value: `+${fmt(naBuff)}%` },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
