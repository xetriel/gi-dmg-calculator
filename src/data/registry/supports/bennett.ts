import type { SupportConfig } from "./types";

export const bennettSupport: SupportConfig = {
  id: "bennett-support",
  characterId: "bennett",
  name: "Bennett",
  rarity: 4,
  element: "Pyro",
  weapon: "Sword",
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

  // Limited stat inputs — only stats that affect Bennett's support output
  statFields: [
    { key: "baseAtk", label: "Base ATK", defaultValue: "800" },
    { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
    { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
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

  // Buffs provided to the active DPS
  buffs: [
    {
      stat: "atk",
      label: "ATK (Bennett Fantastic Voyage)",
      compute: (ctx) => {
        if ((ctx.inputs["fantastic-voyage-active"] ?? 0) <= 0) return 0;
        const burstLv = ctx.constellationLevel >= 5 ? 13 : 10;
        const ratio = burstLv === 13 ? 119.0 : 100.8;
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

  // Brief stat pills for remastered support card UI
  formatBriefStats: (ctx) => {
    const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
    return [
      { label: "Base ATK", value: fmt(ctx.baseAtk) },
      { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
    ];
  },
};
