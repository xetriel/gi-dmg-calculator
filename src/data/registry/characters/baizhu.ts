import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const baizhu: CharacterConfig = {
  id: "baizhu",
  name: "Baizhu",
  rarity: 5,
  element: "Dendro",
  weapon: "Catalyst",
  scalingSource: "hp",
  ascensionStat: { label: "HP%", maxValue: 28.8 },
  dmgBonusLabel: "Dendro DMG Bonus%",
  stats: coreStats("Dendro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — The Classics of Acupuncture",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Dendro" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Dendro" },
        { key: "3-hit-a", name: "3-Hit DMG (Hit 1)", scaling: "atk", hitCategory: "normal", element: "Dendro" },
        { key: "3-hit-b", name: "3-Hit DMG (Hit 2)", scaling: "atk", hitCategory: "normal", element: "Dendro" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Dendro" },
        { key: "charged", name: "Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Dendro" },
        { key: "plunge", name: "Plunge Collision DMG", scaling: "atk", hitCategory: "plunge", element: "Dendro", plungeSubtype: "collision" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Dendro", plungeSubtype: "impact" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Dendro", plungeSubtype: "impact" },
      ],
    },
    {
      type: "skill",
      name: "Elemental Skill — Universal Diagnosis",
      hits: [
        { key: "skill-dmg", name: "Gossamer Sprite DMG", scaling: "atk", hitCategory: "skill", element: "Dendro" },
        { key: "skill-heal", name: "Gossamer Sprite Healing", scaling: "hp", kind: "heal" },
        { key: "c2-splice-dmg", name: "Gossamer Sprite: Splice DMG (C2)", scaling: "atk", hitCategory: "skill", element: "Dendro", minConstellation: 2 },
      ],
    },
    {
      type: "burst",
      name: "Elemental Burst — Holistic Revivification",
      hits: [
        { key: "burst-spiritvein", name: "Spiritvein DMG", scaling: "atk", hitCategory: "burst", element: "Dendro" },
        { key: "burst-heal", name: "Seamless Shield Healing", scaling: "hp", kind: "heal" },
        { key: "burst-shield", name: "Seamless Shield Base Absorption", scaling: "hp", kind: "shield" },
      ],
    },
  ],
  mechanicDefs: [
    {
      id: "a1-hp-threshold",
      label: "A1 Five Fortunes Forever (HP ≥ 50%)",
      control: "toggle",
      defaultValue: 1,
      hint: "Active Character HP ≥ 50%: Baizhu gains +25% Dendro DMG Bonus. When toggled off (HP < 50%): Baizhu gains +20% Healing Bonus.",
    },
    {
      id: "a4-verdant-favor",
      label: "A4 Year of Verdant Favor (Seamless Shield Heals)",
      control: "toggle",
      defaultValue: 1,
      hint: "Characters healed by Seamless Shields gain reaction DMG bonuses based on Baizhu's Max HP (capped at 50,000 HP): +2% Burning/Bloom/Hyperbloom/Burgeon, +0.7% Lunar-Bloom, and +0.8% Aggravate/Spread per 1,000 HP for 6s.",
    },
    {
      id: "c4-art-of-perception",
      label: "C4 Ancient Art of Perception (+80 EM after Burst)",
      control: "toggle",
      defaultValue: 1,
      minConstellation: 4,
      hint: "For 15s after Holistic Revivification is used, increases all nearby party members' Elemental Mastery by 80. Requires C4.",
    },
  ],
  mechanics: [
    "Five Fortunes Forever (A1): Baizhu gains different effects according to the current HP of your active character: HP < 50% grants 20% Healing Bonus; HP ≥ 50% grants 25% Dendro DMG Bonus.",
    "All Things Are of the Earth (A4): Characters healed by Seamless Shields gain Year of Verdant Favor: Each 1,000 Max HP (up to 50,000) increases Burning, Bloom, Hyperbloom, and Burgeon DMG by 2%, Lunar-Bloom DMG by 0.7%, and Aggravate and Spread DMG Bonus by 0.8% for 6s.",
    "Herbal Nourishment: Interacting with certain harvestable items heals the active character for 2.5% of Baizhu's Max HP.",
    "Attentive Observation (C1): Universal Diagnosis gains 1 additional charge.",
    "Incisive Discernment (C2): When your active character hits a nearby opponent, Baizhu unleashes a Gossamer Sprite: Splice dealing 250% ATK as Dendro DMG (Skill DMG) and healing for 20% of Gossamer Sprite normal healing (once every 5s).",
    "All Aspects Stabilized (C3): Increases the Level of Holistic Revivification by 3. Maximum upgrade level is 15.",
    "Ancient Art of Perception (C4): For 15s after Holistic Revivification is used, Baizhu increases all nearby party members' Elemental Mastery by 80.",
    "The Hidden Ebb and Flow (C5): Increases the Level of Universal Diagnosis by 3. Maximum upgrade level is 15.",
    "Elimination of Malicious Qi (C6): Increases the DMG dealt by Holistic Revivification's Spiritveins by 8% of Baizhu's Max HP. Additionally, Gossamer Sprite or Gossamer Sprite: Splice hits have a 100% chance of generating a Seamless Shield.",
  ],
  constellations: [
    {
      level: 1,
      name: "Attentive Observation",
      description: "Universal Diagnosis gains 1 additional charge.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "Incisive Discernment",
      description: "When your own active character hits a nearby opponent with their attacks, Baizhu will unleash a Gossamer Sprite: Splice. Gossamer Sprite: Splice will initiate 1 attack before returning, dealing 250% of Baizhu's ATK as Dendro DMG and healing for 20% of Universal Diagnosis's Gossamer Sprite's normal healing. DMG dealt this way is considered Elemental Skill DMG. This effect can be triggered once every 5s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "All Aspects Stabilized",
      description: "Increases the Level of Holistic Revivification by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 4,
      name: "Ancient Art of Perception",
      description: "For 15s after Holistic Revivification is used, Baizhu will increase all nearby party members' Elemental Mastery by 80.",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "The Hidden Ebb and Flow",
      description: "Increases the Level of Universal Diagnosis by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 6,
      name: "Elimination of Malicious Qi",
      description: "Increases the DMG dealt by Holistic Revivification's Spiritveins by 8% of Baizhu's Max HP. Additionally, when a Gossamer Sprite or Gossamer Sprite: Splice hits opponents, there is a 100% chance of generating one of Holistic Revivification's Seamless Shields. This effect can only be triggered once by each Gossamer Sprite or Gossamer Sprite: Splice.",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description: "Premier 5-star Dendro healer and shielder providing interruption resistance, team HP sustain, Dendro reaction amplification (up to +100% Bloom/Burning, +35% Lunar-Bloom, +40% Spread/Aggravate via A4), and +80 party EM (C4).",
    buffExplanations: [
      {
        name: "A4: Year of Verdant Favor",
        brief: "Up to +100% Bloom/Burgeon, +35% Lunar-Bloom, +40% Spread/Aggravate",
        full: "Characters healed by Seamless Shields gain reaction DMG bonuses based on Baizhu's Max HP (capped at 50,000 HP): +2% Burning/Bloom/Hyperbloom/Burgeon, +0.7% Lunar-Bloom, and +0.8% Aggravate/Spread per 1,000 HP for 6s.",
        category: "dmg_bonus",
      },
      {
        name: "C4: Ancient Art of Perception",
        brief: "+80 EM to party for 15s after Burst",
        full: "For 15s after Holistic Revivification is used, Baizhu will increase all nearby party members' Elemental Mastery by 80. Requires C4.",
        category: "stat_share",
      },
    ],
    statFields: [
      { key: "hp", label: "Total HP", defaultValue: "50000" },
      { key: "baseHp", label: "Base HP", defaultValue: "13348" },
      { key: "energyRecharge", label: "Energy Recharge%", defaultValue: "180" },
      { key: "em", label: "Elemental Mastery", defaultValue: "120" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "40" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "90" },
      { key: "baseAtk", label: "Base ATK", defaultValue: "193" },
    ],
    buffs: [
      {
        stat: "burningDmgBonus",
        label: "Burning DMG (Baizhu A4 Year of Verdant Favor)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-verdant-favor"] ?? 1) <= 0) return 0;
          const effHp = Math.min(ctx.hp, 50000);
          return (effHp / 1000) * 2.0;
        },
      },
      {
        stat: "bloomDmgBonus",
        label: "Bloom DMG (Baizhu A4 Year of Verdant Favor)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-verdant-favor"] ?? 1) <= 0) return 0;
          const effHp = Math.min(ctx.hp, 50000);
          return (effHp / 1000) * 2.0;
        },
      },
      {
        stat: "hyperbloomDmgBonus",
        label: "Hyperbloom DMG (Baizhu A4 Year of Verdant Favor)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-verdant-favor"] ?? 1) <= 0) return 0;
          const effHp = Math.min(ctx.hp, 50000);
          return (effHp / 1000) * 2.0;
        },
      },
      {
        stat: "burgeonDmgBonus",
        label: "Burgeon DMG (Baizhu A4 Year of Verdant Favor)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-verdant-favor"] ?? 1) <= 0) return 0;
          const effHp = Math.min(ctx.hp, 50000);
          return (effHp / 1000) * 2.0;
        },
      },
      {
        stat: "lunarBloomDmgBonus",
        label: "Lunar-Bloom DMG (Baizhu A4 Year of Verdant Favor)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-verdant-favor"] ?? 1) <= 0) return 0;
          const effHp = Math.min(ctx.hp, 50000);
          return (effHp / 1000) * 0.7;
        },
      },
      {
        stat: "aggravateDmgBonus",
        label: "Aggravate DMG (Baizhu A4 Year of Verdant Favor)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-verdant-favor"] ?? 1) <= 0) return 0;
          const effHp = Math.min(ctx.hp, 50000);
          return (effHp / 1000) * 0.8;
        },
      },
      {
        stat: "spreadDmgBonus",
        label: "Spread DMG (Baizhu A4 Year of Verdant Favor)",
        compute: (ctx) => {
          if ((ctx.inputs["a4-verdant-favor"] ?? 1) <= 0) return 0;
          const effHp = Math.min(ctx.hp, 50000);
          return (effHp / 1000) * 0.8;
        },
      },
      {
        stat: "em",
        label: "Elemental Mastery (Baizhu C4 Ancient Art of Perception)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 4) return 0;
          if ((ctx.inputs["c4-art-of-perception"] ?? 1) <= 0) return 0;
          return 80;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
      const effHp = Math.min(ctx.hp, 50000);
      const bloomPct = ((effHp / 1000) * 2.0).toFixed(0);
      const spreadPct = ((effHp / 1000) * 0.8).toFixed(1);
      return [
        { label: "Total HP", value: fmt(ctx.hp) },
        { label: "A4 Bonus", value: `+${bloomPct}% Bloom / +${spreadPct}% Spread` },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
