import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const bennett: CharacterConfig = {
  id: "bennett",
  name: "Bennett",
  rarity: 4,
  element: "Pyro",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "Energy Recharge", maxValue: 26.7 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack: Strike of Fortune",
      hits: [
        atk("1-hit", "1-Hit DMG"),
        atk("2-hit", "2-Hit DMG"),
        atk("3-hit", "3-Hit DMG"),
        atk("4-hit", "4-Hit DMG"),
        atk("5-hit", "5-Hit DMG"),
        atkCharged("charged-1", "Charged Attack 1-Hit DMG"),
        atkCharged("charged-2", "Charged Attack 2-Hit DMG"),
        atkPlunge("plunge", "Plunge DMG"),
        atkPlunge("low-plunge", "Low Plunge DMG"),
        atkPlunge("high-plunge", "High Plunge DMG"),
      ],
    },
    {
      type: "skill",
      name: "Passion Overload",
      hits: [
        atk("press-dmg", "Press DMG"),
        atk("charge1-1", "Charge 1 Hit 1 DMG"),
        atk("charge1-2", "Charge 1 Hit 2 DMG"),
        atk("charge2-1", "Charge 2 Hit 1 DMG"),
        atk("charge2-2", "Charge 2 Hit 2 DMG"),
        atk("explosion-dmg", "Explosion DMG"),
      ],
    },
    {
      type: "burst",
      name: "Fantastic Voyage",
      hits: [
        atk("burst-dmg", "Skill DMG"),
        { key: "regen", name: "Continuous Regeneration Per Sec", scaling: "hp", kind: "heal" },
        { key: "atk-ratio", name: "ATK Bonus Ratio", scaling: "atk", kind: "buff" },
      ],
    },
  ],
  mechanics: [
    "Fantastic Voyage: Inspiration Field grants active characters an ATK Bonus scaling with Bennett's Base ATK (100.8% at Lv10, 119.0% at Lv13). C1 Grand Expectation adds an extra +20% Base ATK ratio and removes the HP restriction.",
    "Fire Ventures with Me (C6): Sword, Claymore, and Polearm characters within Inspiration Field gain +15% Pyro DMG Bonus and Pyro Infusion.",
  ],
  mechanicDefs: [
    {
      id: "fantastic-voyage-active",
      label: "Fantastic Voyage Active",
      control: "toggle",
      defaultValue: 1,
      hint: "Inspiration Field grants ATK Bonus based on Bennett's Base ATK.",
    },
    {
      id: "c6-pyro-bonus",
      label: "C6: Fire Ventures with Me (+15% Pyro DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Sword, Claymore, and Polearm characters inside Inspiration Field gain +15% Pyro DMG Bonus. Requires C6.",
    },
  ],
  wikiTalents: [
    {
      name: "Strike of Fortune",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 5 rapid strikes. Charged Attack: Consumes a certain amount of Stamina to unleash 2 rapid sword strikes. Plunging Attack: Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.",
    },
    {
      name: "Passion Overload",
      type: "Elemental Skill",
      description: "Bennett puts all his fire and passion for adventure into his sword. Results may vary based on how charged up he is. Press: A single, swift flame strike that deals Pyro DMG. Hold (Short): Charges up, unleashing 2 strikes that deal Pyro DMG and launch opponents. Hold (Long): Charges up 3 consecutive strikes that deal Pyro DMG, with the last strike triggering an explosion that launches both Bennett and the enemy.",
    },
    {
      name: "Fantastic Voyage",
      type: "Elemental Burst",
      description: "Bennett performs a jumping attack that deals Pyro DMG, creating an Inspiration Field for 12s. If the HP of a character in the circle is equal to or falls below 70%, their HP will continuously regenerate based on Bennett's Max HP. If their HP is above 70%, they gain an ATK Bonus based on Bennett's Base ATK.",
    },
    {
      name: "Rekindle",
      type: "Passive Talent",
      description: "Decreases Passion Overload's CD by 20%.",
    },
    {
      name: "Fearnaught",
      type: "Passive Talent",
      description: "When inside the area created by Fantastic Voyage, Passion Overload's CD is decreased by 50% and Bennett cannot be launched by the explosion.",
    },
    {
      name: "It Should Be Safe...",
      type: "Utility Passive",
      description: "When dispatched on an expedition in Mondstadt, time consumed is decreased by 25%.",
    },
  ],
  constellations: [
    {
      level: 1,
      name: "Grand Expectation",
      description: "Fantastic Voyage's ATK increase no longer has an HP restriction, and gains an additional 20% of Bennett's Base ATK.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "Impasse Conqueror",
      description: "When Bennett's HP falls below 70%, his Energy Recharge is increased by 30%.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "Unstoppable Fervor",
      description: "Increases the Level of Passion Overload by 3 (max 15).",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 4,
      name: "Unexpected Odyssey",
      description: "Short-hold Passion Overload can trigger an additional attack.",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "True Explorer",
      description: "Increases the Level of Fantastic Voyage by 3 (max 15).",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 6,
      name: "Fire Ventures with Me",
      description: "Sword, Claymore, or Polearm-wielding characters inside Fantastic Voyage's radius gain a 15% Pyro DMG Bonus and their weapons are infused with Pyro.",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description: "Premier Pyro ATK buffer and healer. Fantastic Voyage provides a massive Flat ATK bonus based on Bennett's Base ATK, and C6 grants +15% Pyro DMG Bonus with Pyro Infusion to melee characters.",
    buffExplanations: [
      {
        name: "Fantastic Voyage (Burst)",
        brief: "Up to 119% Base ATK as Flat ATK (+20% from C1)",
        full: "Fantastic Voyage: Inspiration Field grants active characters an ATK Bonus scaling with Bennett's Base ATK (100.8% at Lv10, 119.0% at Lv13). C1 Grand Expectation adds an extra +20% Base ATK ratio and removes the HP restriction.",
        category: "flat_dmg",
      },
      {
        name: "C6: Fire Ventures with Me",
        brief: "+15% Pyro DMG Bonus & Pyro Infusion",
        full: "Fire Ventures with Me: Sword, Claymore, and Polearm characters within Fantastic Voyage's Inspiration Field gain a +15% Pyro DMG Bonus and have their normal/charged/plunge attacks infused with Pyro. Requires C6.",
        category: "dmg_bonus",
      },
    ],
    statFields: [
      { key: "baseAtk", label: "Base ATK", defaultValue: "800" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "atk",
        label: "ATK (Bennett Fantastic Voyage)",
        compute: (ctx) => {
          if ((ctx.inputs["fantastic-voyage-active"] ?? 0) <= 0) return 0;
          const burstLv = ctx.talentLevels?.burst ?? (ctx.constellationLevel >= 5 ? 13 : 10);
          const ratio = burstLv >= 13 ? 119.0 : 100.8;
          const c1Bonus = ctx.constellationLevel >= 1 ? 20.0 : 0;
          const totalRatio = (ratio + c1Bonus) / 100;
          const baseAtk = ctx.baseAtk || ctx.atk;
          return totalRatio * baseAtk;
        },
      },
      {
        stat: "pyroDmgBonus",
        label: "Pyro DMG (Bennett C6)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-pyro-bonus"] ?? 0) <= 0) return 0;
          return 15;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Base ATK", value: fmt(ctx.baseAtk || ctx.atk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
