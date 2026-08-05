import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const klee: CharacterConfig = {
  id: "klee",
  name: "Klee",
  rarity: 5,
  element: "Pyro",
  weapon: "Catalyst",
  scalingSource: "atk",
  ascensionStat: { label: "Pyro DMG Bonus%", maxValue: 28.8 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Kaboom!",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Pyro" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Pyro" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Pyro" },
        { key: "charged", name: "Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Pyro" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Pyro" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Pyro" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Jumpy Dumpty",
      hits: [
        { key: "jumpy-bounce", name: "Jumpy Dumpty Bounce DMG (each)", scaling: "atk", hitCategory: "skill", element: "Pyro" },
        { key: "mine-dmg", name: "Mine DMG (each)", scaling: "atk", hitCategory: "skill", element: "Pyro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Sparks 'n' Splash",
      hits: [
        { key: "burst-dmg", name: "Sparks 'n' Splash DMG (each)", scaling: "atk", hitCategory: "burst", element: "Pyro" },
        { key: "c1-chained-reaction", name: "Chained Reaction Spark DMG (C1)", scaling: "atk", hitCategory: "burst", element: "Pyro" },
        { key: "c4-sparkly-explosion", name: "Sparkly Explosion DMG (C4)", scaling: "atk", hitCategory: "burst", element: "Pyro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "hexerei-secret-rite",
      label: "Hexerei: Secret Rite Active (+15% Pyro DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Hexerei Synergy: Grants +15% Pyro DMG Bonus, enables Boom Badges, 50% spark retention, and NA Spark consumption."
    },
    {
      id: "hexerei-boom-badges",
      label: "Hexerei Boom Badges (0–3 Stacks)",
      control: "stacks",
      max: 3,
      defaultValue: 3,
      hint: "Gained when dealing DMG with NA, Skill, or Burst while Hexerei is active. Increases Charged Attack DMG multiplier to 115% / 130% / 150%."
    },
    {
      id: "a1-explosive-spark",
      label: "A1 Pounding Surprise (Explosive Spark +50% CA DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: Explosive Spark increases next Charged Attack DMG by 50% and consumes 0 Stamina."
    },
    {
      id: "c1-atk-buff",
      label: "C1 Thundering Spark ATK Buff (+60% ATK)",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: For 12s after triggering Chained Reaction spark, Klee's ATK is increased by 60%."
    },
    {
      id: "c2-def-shred",
      label: "C2 Explosive Frags (-23% Enemy DEF)",
      control: "toggle",
      defaultValue: 0,
      hint: "C2: Enemies hit by Jumpy Dumpty's mines have their DEF decreased by 23% for 10s."
    },
    {
      id: "c4-on-field",
      label: "C4 On-Field Explosion Boost (+100% DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "C4: If Klee is on-field when Sparkly Explosion occurs, its DMG is increased by 100%."
    },
    {
      id: "c6-pyro-buff",
      label: "C6 Blazing Delight (+10% Pyro DMG Bonus)",
      control: "toggle",
      defaultValue: 0,
      hint: "C6: Casting Sparks 'n' Splash grants all party members a 10% Pyro DMG Bonus for 25s."
    }
  ],
  mechanics: [
    "Hexerei: Secret Rite: Grants +15% Pyro DMG Bonus. Boom Badges (1–3 stacks) boost Charged Attack DMG to 115% / 130% / 150% original DMG.",
    "Pounding Surprise (A1): Explosive Spark increases Charged Attack DMG by 50% and reduces stamina cost to 0.",
    "Sparkling Burst (A4): Charged Attack CRIT hits regenerate 2 Energy for all party members.",
    "Chained Reaction (C1): Attacks/Skills have a chance to summon a spark dealing 120% Burst DMG and grant +60% ATK for 12s.",
    "Explosive Frags (C2): Mine hits decrease enemy DEF by 23% for 10s.",
    "Sparkly Explosion (C4): Leaving the field or Burst ending triggers an explosion dealing 555% ATK AoE Pyro DMG (+100% DMG if on-field).",
    "Blazing Delight (C6): Regenerates 3 Energy for team every 3s during Burst. Casting Burst grants all party members +10% Pyro DMG Bonus for 25s."
  ],
  constellations: [
    {
      level: 1,
      name: "Chained Reaction",
      description: "Attacks and Skills have a certain chance to summon sparks that bombard opponents, dealing DMG equal to 120% of Sparks 'n' Splash's DMG. For 12s after triggering, Klee's ATK is increased by 60%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Explosive Frags",
      description: "Being hit by Jumpy Dumpty's mines decreases opponents' DEF by 23% for 10s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Exquisite Compound",
      description: "Increases the Level of Jumpy Dumpty by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Sparkly Explosion",
      description: "An explosion will be triggered if Klee leaves the field while Sparks 'n' Splash is active or when Sparks 'n' Splash ends, dealing 555% of ATK as AoE Pyro DMG. If Klee is on-field when the explosion occurs, its DMG will be increased by 100%.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Nova Burst",
      description: "Increases the Level of Sparks 'n' Splash by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Blazing Delight",
      description: "While under the effects of Sparks 'n' Splash, Klee will regenerate 3 Energy for all members of the party (excluding Klee) every 3s. When Sparks 'n' Splash is used, all party members will gain a 10% Pyro DMG Bonus for 25s.",
      effects: [{ type: "informational" }]
    }
  ]
};
