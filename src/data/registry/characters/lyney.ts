import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const lyney: CharacterConfig = {
  id: "lyney",
  name: "Lyney",
  rarity: 5,
  element: "Pyro",
  weapon: "Bow",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate%", maxValue: 19.2 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("CRIT Rate%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Forceful Prop Card",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit-1", name: "3-Hit DMG (Hit 1)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit-2", name: "3-Hit DMG (Hit 2)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "aimed", name: "Aimed Shot", scaling: "atk", hitCategory: "charged", element: "Physical" },
        { key: "charged-1", name: "Fully Charged Aimed Shot", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "prop-arrow", name: "Prop Arrow DMG", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "pyrotechnic-strike", name: "Pyrotechnic Strike DMG", scaling: "atk", hitCategory: "charged", element: "Pyro" },
        { key: "c6-reprise", name: "Pyrotechnic Strike: Reprise DMG (C6)", scaling: "atk", hitCategory: "charged", element: "Pyro", minConstellation: 6 },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Physical" },
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Bewildering Lights",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill", element: "Pyro" },
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Wondrous Trick: Miracle Parade",
      hits: [
        { key: "burst-cat", name: "Grin-Malkin Cat DMG", scaling: "atk", hitCategory: "burst", element: "Pyro" },
        { key: "burst-fireworks", name: "Fireworks Flare DMG", scaling: "atk", hitCategory: "burst", element: "Pyro" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "prop-surplus-stacks",
      label: "Prop Surplus Stacks (0–5 Stacks)",
      control: "stacks",
      max: 5,
      defaultValue: 5,
      hint: "Prop Arrow fires consume HP to grant Prop Surplus stacks, increasing Bewildering Lights DMG."
    },
    {
      id: "a1-hp-consumed",
      label: "A1 Perilous Performance (+80% ATK Flat DMG to Pyrotechnic Strike)",
      control: "toggle",
      defaultValue: 1,
      hint: "A1: When Prop Arrow consumes HP, the Grin-Malkin Hat DMG increases by 80% of Lyney's ATK."
    },
    {
      id: "a4-pyro-members",
      label: "A4 Conclusive Ovation (Pyro-affected opponent: 0=Off, 1–3 Pyro Members)",
      control: "stacks",
      max: 3,
      defaultValue: 3,
      hint: "A4: Against Pyro-affected opponents, grants +60% Pyro DMG Bonus + 20% per additional Pyro ally (max +100%)."
    },
    {
      id: "c2-focus-stacks",
      label: "C2 Crisp Focus Stacks (0–3 Stacks, +20%/+40%/+60% CRIT DMG)",
      control: "stacks",
      max: 3,
      defaultValue: 3,
      hint: "C2: Every 2s on field, Lyney gains +20% CRIT DMG per stack (max 3 stacks = +60% CRIT DMG)."
    },
    {
      id: "c4-pyro-res-shred",
      label: "C4 Well-Rehearsed Verses (-20% Enemy Pyro RES)",
      control: "toggle",
      defaultValue: 1,
      hint: "C4: After a Pyro Charged Attack hits an opponent, that opponent's Pyro RES is decreased by 20% for 6s."
    }
  ],
  mechanics: [
    "Prop Surplus Stacks (0–5 Stacks): Firing Prop Arrows above 60% HP consumes 20% Max HP to gain 1 stack, increasing Skill DMG.",
    "Perilous Performance (A1): When Prop Arrow consumes HP, Pyrotechnic Strike gains +80% ATK as flat DMG and restores 3 Energy.",
    "Conclusive Ovation (A4): Against opponents affected by Pyro, grants +60% DMG Bonus + 20% per additional Pyro member (max +100% total).",
    "Whimsical Wonders (C1): Max 2 Grin-Malkin Hats. Prop Arrow summons 2 hats and grants 1 extra Prop Surplus stack.",
    "Loquacious Lure (C2): Every 2s on field, gains +20% CRIT DMG per stack (max 3 stacks = +60% CRIT DMG).",
    "Well-Rehearsed Verses (C4): Pyro Charged Attack hits decrease enemy Pyro RES by 20% for 6s.",
    "A Contrary Smile (C6): Prop Arrow fires a Pyrotechnic Strike: Reprise dealing 80% of Pyrotechnic Strike's DMG as Charged Attack DMG."
  ],
  constellations: [
    {
      level: 1,
      name: "Whimsical Wonders",
      description: "Lyney can have up to 2 Grin-Malkin Hats present at once. In addition, Prop Arrows will summon 2 Grin-Malkin Hats and grant Lyney 1 extra stack of Prop Surplus.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Loquacious Lure",
      description: "When Lyney is on the field, he will gain a stack of Crisp Focus every 2s. This will increase his CRIT DMG by 20%. Max 3 stacks.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Prestigitation",
      description: "Increases the Level of Normal Attack: Forceful Prop Card by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "normal" }]
    },
    {
      level: 4,
      name: "Well-Rehearsed Verses",
      description: "After Lyney's Pyro Charged Attack hits an opponent, that opponent's Pyro RES is decreased by 20% for 6s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "To Pierce Enigmas",
      description: "Increases the Level of Wondrous Trick: Miracle Parade by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "A Contrary Smile",
      description: "When Lyney fires a Prop Arrow, he will fire a Pyrotechnic Strike: Reprise that deals 80% of Pyrotechnic Strike's DMG as Charged Attack DMG.",
      effects: [{ type: "informational" }]
    }
  ]
};
