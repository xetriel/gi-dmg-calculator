import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const mavuika: CharacterConfig = {
  id: "mavuika",
  name: "Mavuika",
  rarity: 5,
  element: "Pyro",
  weapon: "Claymore",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Flames Weave Life",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit (×2)"),
        atk("3-hit", "3-Hit (×3)"),
        atk("4-hit", "4-Hit"),
        atkCharged("charged-cyclic", "Charged Attack Cyclic DMG"),
        atkCharged("charged-final", "Charged Attack Final DMG"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — The Named Moment",
      hits: [
        { key: "skill-dmg", name: "Skill DMG (Tap)", scaling: "atk" as const, hitCategory: "skill" as const },
        { key: "ring-dmg", name: "Ring of Searing Radiance DMG", scaling: "atk" as const, hitCategory: "skill" as const },
        { key: "flamestrider-1-hit", name: "Flamestrider 1-Hit", scaling: "atk" as const, hitCategory: "normal" as const },
        { key: "flamestrider-2-hit", name: "Flamestrider 2-Hit", scaling: "atk" as const, hitCategory: "normal" as const },
        { key: "flamestrider-3-hit", name: "Flamestrider 3-Hit", scaling: "atk" as const, hitCategory: "normal" as const },
        { key: "flamestrider-4-hit", name: "Flamestrider 4-Hit", scaling: "atk" as const, hitCategory: "normal" as const },
        { key: "flamestrider-5-hit", name: "Flamestrider 5-Hit", scaling: "atk" as const, hitCategory: "normal" as const },
        { key: "flamestrider-charged-cyclic", name: "Flamestrider Charged Cyclic DMG", scaling: "atk" as const, hitCategory: "charged" as const },
        { key: "flamestrider-charged-final", name: "Flamestrider Charged Final DMG", scaling: "atk" as const, hitCategory: "charged" as const },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Hour of Burning Skies",
      hits: [
        { key: "sunfell-slice", name: "Sunfell Slice DMG", scaling: "atk" as const, hitCategory: "burst" as const },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "flamestrider-active",
      label: "Flamestrider Active",
      control: "toggle",
      defaultValue: 0,
      hint: "Flamestrider motorcycle form (Hold Skill). Enables C2 flat DMG bonuses on Flamestrider attacks."
    },
    {
      id: "burst-active",
      label: "Crucible of Death and Life",
      control: "toggle",
      defaultValue: 0,
      hint: "After Hour of Burning Skies. Adds Fighting Spirit flat DMG bonuses to Sunfell Slice and Flamestrider attacks."
    },
    {
      id: "fighting-spirit",
      label: "Fighting Spirit",
      control: "percent",
      max: 200,
      defaultValue: 200,
      hint: "Resource consumed by Burst. Affects A4 Kiongozi DMG buff and burst flat DMG bonuses (0.26%/0.52%/1.6% ATK per point for NA/CA/Sunfell)."
    },
    {
      id: "a1-nightsoul-burst",
      label: "A1: Gift of Flaming Flowers",
      control: "toggle",
      defaultValue: 1,
      hint: "Nearby party member triggered Nightsoul Burst → ATK +30% for 10s."
    },
    {
      id: "a4-kiongozi",
      label: "A4: Kiongozi DMG Buff",
      control: "toggle",
      defaultValue: 1,
      hint: "After Burst, DMG +0.2% per Fighting Spirit point (max 40%). C4: no decay + extra 10%."
    },
    {
      id: "c1-atk-buff",
      label: "C1: ATK +40%",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: +40% ATK for 8s after gaining Fighting Spirit."
    },
    {
      id: "c2-def-shred",
      label: "C2: Ring DEF −20%",
      control: "toggle",
      defaultValue: 0,
      hint: "C2: Ring of Searing Radiance reduces nearby opponents' DEF by 20%."
    }
  ],
  mechanics: [
    "Gift of Flaming Flowers (A1): When a nearby party member triggers Nightsoul Burst, ATK is increased by 30% for 10s.",
    "Kiongozi (A4): After Burst, each point of Fighting Spirit increases DMG by 0.2% (max 40%). Decays over 20s.",
    "The Night-Lord's Explication (C1): +40% ATK for 8s after gaining Fighting Spirit.",
    "The Ashen Price (C2): In Nightsoul's Blessing, Base ATK +200. Ring: nearby enemies DEF −20%. Flamestrider: NA +60% ATK, CA +90% ATK, Sunfell Slice +120% ATK flat DMG.",
    "The Burning Sun (C3): Burst +3 levels (max 15).",
    "The Leader's Resolve (C4): Kiongozi DMG buff no longer decays; gains additional +10% DMG Bonus.",
    "The Meaning of Truth (C5): Skill +3 levels (max 15).",
    "\"Humanity's Name\" Unfettered (C6): Ring hits → Flamestrider crash (200% ATK Pyro DMG). Flamestrider → Scorching Ring (DEF −20%, 500% ATK Pyro DMG every 3s)."
  ],
  constellations: [
    {
      level: 1,
      name: "The Night-Lord's Explication",
      description: "ATK is increased by 40% for 8s after gaining Fighting Spirit.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "The Ashen Price",
      description: "In Nightsoul's Blessing, Base ATK +200. Ring: nearby enemies DEF −20%. Flamestrider: NA +60% ATK, CA +90% ATK, Sunfell Slice +120% ATK.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "The Burning Sun",
      description: "Increases the Level of Elemental Burst: Hour of Burning Skies by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4,
      name: "The Leader's Resolve",
      description: "Kiongozi DMG buff no longer decays. Gains an additional 10% DMG Bonus.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "The Meaning of Truth",
      description: "Increases the Level of Elemental Skill: The Named Moment by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6,
      name: "\"Humanity's Name\" Unfettered",
      description: "Ring hits summon Flamestrider crash (200% ATK AoE Pyro). Flamestrider summons Scorching Ring (DEF −20%, 500% ATK AoE Pyro every 3s).",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Pyro Archon sub-DPS and team offensive amplifier. Provides up to +40% All DMG Bonus to active character via Kiongozi (+50% at C4), and shreds nearby enemy DEF by 20% at C2.",
    buffExplanations: [
      {
        name: "Kiongozi (Burst)",
        brief: "Up to +40% All DMG Bonus (+10% at C4)",
        full: "After casting Burst, each point of Fighting Spirit grants active characters an All DMG Bonus up to +40%. C4 The Leader's Resolve prevents decay and adds an extra +10% DMG Bonus (total +50%).",
        category: "dmg_bonus",
      },
      {
        name: "C2: The Ashen Price",
        brief: "-20% Enemy DEF",
        full: "The Ring of Searing Radiance decreases nearby opponents' DEF by 20%.",
        category: "dmg_bonus",
      },
    ],
    statFields: [
      { key: "atk", label: "Total ATK", defaultValue: "2400" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "dmgBonus",
        label: "All DMG Bonus (Mavuika Kiongozi)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-kiongozi"] ?? 0) <= 0) return 0;
          const base = 40;
          const c4Bonus = ctx.constellationLevel >= 4 ? 10 : 0;
          return base + c4Bonus;
        },
      },
      {
        stat: "defReduction",
        label: "DEF Shred (Mavuika C2)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 2) return 0;
          if ((ctx.inputs["c2-def-shred"] ?? 0) <= 0) return 0;
          return 20;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Total ATK", value: fmt(ctx.atk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
