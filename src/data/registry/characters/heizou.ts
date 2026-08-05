import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const heizou: CharacterConfig = {
  id: "heizou",
  name: "Shikanoin Heizou",
  rarity: 4,
  element: "Anemo",
  weapon: "Catalyst",
  scalingSource: "atk",
  ascensionStat: { label: "Anemo DMG Bonus%", maxValue: 24.0 },
  dmgBonusLabel: "Anemo DMG Bonus%",
  stats: coreStats("Anemo DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Fudou Style Martial Arts",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "4-hit-a", name: "4-Hit A DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "4-hit-b", name: "4-Hit B DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "4-hit-c", name: "4-Hit C DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "charged", name: "Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Anemo" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Anemo" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Anemo" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Anemo" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Heartstopper Strike",
      hits: [
        { key: "skill-dmg", name: "Heartstopper Strike DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
        { key: "declension-dmg", name: "Declension DMG Bonus (per stack)", scaling: "atk", hitCategory: "skill", element: "Anemo" },
        { key: "conviction-dmg", name: "Conviction DMG Bonus (at 4 stacks)", scaling: "atk", hitCategory: "skill", element: "Anemo" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Windmuster Kick",
      hits: [
        { key: "burst-dmg", name: "Fudou Style Vacuum Slugger DMG", scaling: "atk", hitCategory: "burst", element: "Anemo" },
        { key: "iris-pyro", name: "Windmuster Iris DMG (Pyro)", scaling: "atk", hitCategory: "burst", element: "Pyro" },
        { key: "iris-hydro", name: "Windmuster Iris DMG (Hydro)", scaling: "atk", hitCategory: "burst", element: "Hydro" },
        { key: "iris-cryo", name: "Windmuster Iris DMG (Cryo)", scaling: "atk", hitCategory: "burst", element: "Cryo" },
        { key: "iris-electro", name: "Windmuster Iris DMG (Electro)", scaling: "atk", hitCategory: "burst", element: "Electro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "declension-stacks",
      label: "Declension Stacks (0–4 Stacks & Conviction)",
      control: "stacks",
      max: 4,
      defaultValue: 4,
      hint: "Declension stacks increase Heartstopper Strike DMG. 4 stacks grant Conviction effect for extra DMG and larger AoE."
    },
    {
      id: "a4-em-buff",
      label: "A4 Penetrative Reasoning Teammate EM Buff (+80 EM)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: Hitting an opponent with Heartstopper Strike increases all other party members' EM by 80 for 10s."
    },
    {
      id: "c1-na-spd",
      label: "C1 Named Juvenile Casebook NA SPD (+15%)",
      control: "toggle",
      defaultValue: 0,
      hint: "C1: Taking the field increases Normal Attack SPD by 15% for 5s and grants 1 Declension stack."
    }
  ],
  mechanics: [
    "Paradoxical Practice (A1): Triggering a Swirl reaction on the field grants 1 stack of Declension (0.1s cooldown).",
    "Penetrative Reasoning (A4): Heartstopper Strike hits grant +80 EM to all other party members for 10s.",
    "Declension & Conviction: Each Declension stack increases Heartstopper Strike DMG. 4 stacks activate Conviction for an additional DMG boost.",
    "Curious Casefiles (C6): Each Declension stack increases Heartstopper Strike CRIT Rate by 4%. Conviction (4 stacks) grants +32% CRIT DMG."
  ],
  constellations: [
    {
      level: 1,
      name: "Named Juvenile Casebook",
      description: "For 5s after Shikanoin Heizou takes the field, his Normal Attack SPD is increased by 15%. He also gains 1 Declension stack.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Investigative Collection",
      description: "The pull effect of the Fudou Style Vacuum Slugger created by Windmuster Kick is enhanced, and its duration is extended to 1s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Esoteric Puzzle Book",
      description: "Increases the Level of Heartstopper Strike by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Tome of Lies",
      description: "The first Windmuster Iris explosion in each Windmuster Kick regenerates 9 Energy for Heizou. Each subsequent explosion regenerates an additional 1.5 Energy.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Secret Archive",
      description: "Increases the Level of Windmuster Kick by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "Curious Casefiles",
      description: "Each Declension stack increases the CRIT Rate of Heartstopper Strike by 4%. When Heizou has Conviction (4 stacks), its CRIT DMG is increased by 32%.",
      effects: [{ type: "informational" }]
    }
  ]
};
