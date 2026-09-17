import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";

export const sucrose: CharacterConfig = {
  id: "sucrose",
  name: "Sucrose",
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
      name: "Normal Attack — Wind Spirit Creation",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "3-hit", name: "3-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Anemo" },
        { key: "charged", name: "Charged Attack DMG", scaling: "atk", hitCategory: "charged", element: "Anemo" },
        { key: "plunge", name: "Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Anemo" },
        { key: "low-plunge", name: "Low Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Anemo" },
        { key: "high-plunge", name: "High Plunge DMG", scaling: "atk", hitCategory: "plunge", element: "Anemo" },
      ],
    },
    {
      type: "skill",
      name: "Elemental Skill — Astable Anemohypostasis Creation - 6308",
      hits: [
        { key: "skill-dmg", name: "Skill DMG", scaling: "atk", hitCategory: "skill", element: "Anemo" },
      ],
    },
    {
      type: "burst",
      name: "Elemental Burst — Forbidden Creation - Isomer 75 / Type II",
      hits: [
        { key: "burst-dot", name: "DoT", scaling: "atk", hitCategory: "burst", element: "Anemo" },
        { key: "burst-infusion", name: "Elemental Absorption DMG", scaling: "atk", hitCategory: "burst", element: "Anemo" },
      ],
    },
  ],
  mechanicDefs: [
    {
      id: "hexerei-secret-rite",
      label: "Hexerei: Secret Rite Active",
      control: "toggle",
      defaultValue: 1,
      hint: "Hexerei Synergy (requires >=2 Hexerei characters in the party). Unlocks passives from Witch's Homework: Of Wonderland Flowers (Version 6.2 Luna III).",
    },
    {
      id: "small-wind-spirit",
      label: "Small Wind Spirit Active (+5.71428% All Attacks)",
      control: "toggle",
      defaultValue: 1,
      hint: "After creating a Small Wind Spirit (Elemental Skill), party members gain +5.71428% (40/7%) Normal, Charged, Plunge, Skill, and Burst DMG for 15s under Hexerei: Secret Rite.",
    },
    {
      id: "large-wind-spirit",
      label: "Large Wind Spirit Active (+7.14285% Hexerei DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "After creating a Large Wind Spirit (Elemental Burst), Hexerei characters gain an additional +7.14285% (50/7%) Normal, Charged, Plunge, Skill, and Burst DMG for 20s under Hexerei: Secret Rite.",
    },
    {
      id: "burst-absorb-pyro",
      label: "Burst Absorption: Pyro",
      control: "toggle",
      defaultValue: 0,
      hint: "If the Large Wind Spirit comes into contact with Pyro, deals additional Pyro DMG. At C6, buffs Pyro DMG Bonus.",
    },
    {
      id: "burst-absorb-hydro",
      label: "Burst Absorption: Hydro",
      control: "toggle",
      defaultValue: 0,
      hint: "If the Large Wind Spirit comes into contact with Hydro, deals additional Hydro DMG. At C6, buffs Hydro DMG Bonus.",
    },
    {
      id: "burst-absorb-electro",
      label: "Burst Absorption: Electro",
      control: "toggle",
      defaultValue: 0,
      hint: "If the Large Wind Spirit comes into contact with Electro, deals additional Electro DMG. At C6, buffs Electro DMG Bonus.",
    },
    {
      id: "burst-absorb-cryo",
      label: "Burst Absorption: Cryo",
      control: "toggle",
      defaultValue: 0,
      hint: "If the Large Wind Spirit comes into contact with Cryo, deals additional Cryo DMG. At C6, buffs Cryo DMG Bonus.",
    },
    {
      id: "c6-absorption-buff",
      label: "C6 Chaotic Entropy Absorption Buff",
      control: "toggle",
      defaultValue: 1,
      minConstellation: 6,
      hint: "Grants +20% Elemental DMG Bonus for the absorbed element during Burst. If Hexerei: Secret Rite is active, Hexerei characters gain an additional +8.57142% (60/7%) DMG Bonus (total +28.57142%).",
    },
    {
      id: "a1-swirl-buff",
      label: "A1 Catalyst Conversion (+50 EM on Swirl)",
      control: "toggle",
      defaultValue: 1,
      hint: "When Sucrose triggers a Swirl reaction, all characters in the party with the matching element have their Elemental Mastery increased by 50 for 8s.",
    },
    {
      id: "a4-em-share",
      label: "A4 Mollis Favonius (+20% EM Share)",
      control: "toggle",
      defaultValue: 1,
      hint: "When Astable Anemohypostasis Creation - 6308 or Forbidden Creation - Isomer 75 / Type II hits an opponent, increases party members' EM by 20% of Sucrose's EM for 8s.",
    },
    {
      id: "hexerei-target-is-hexerei",
      label: "Target Ally is Hexerei Character",
      control: "toggle",
      defaultValue: 1,
      hint: "When acting as party support, grants the Large Wind Spirit (+7.14285%) and C6 extra bonus (+8.57142%) if the active DPS character belongs to the Hexerei faction.",
    },
  ],
  wikiTalents: [
    {
      name: "Wind Spirit Creation",
      type: "Normal Attack",
      description:
        "Normal Attack: Performs up to 4 attacks using Wind Spirits, dealing Anemo DMG. Charged Attack: Consumes a certain amount of Stamina and deals AoE Anemo DMG after a short casting time. Plunging Attack: Calling upon the power of her Wind Spirits, Sucrose plunges towards the ground from mid-air, damaging all opponents in her path. Deals AoE Anemo DMG upon impact with the ground.",
    },
    {
      name: "Astable Anemohypostasis Creation - 6308",
      type: "Elemental Skill",
      description:
        "Creates a small Wind Spirit that pulls opponents and objects towards its location, launches opponents within the AoE, and deals Anemo DMG.",
    },
    {
      name: "Forbidden Creation - Isomer 75 / Type II",
      type: "Elemental Burst",
      description:
        "Sucrose hurls an unstable concoction that creates a Large Wind Spirit. While it persists, the Large Wind Spirit will continuously pull in and launch nearby opponents, dealing AoE Anemo DMG. Elemental Absorption: If the Wind Spirit comes into contact with Hydro/Pyro/Cryo/Electro energy, it will deal additional elemental DMG of that type. Elemental Absorption may only occur once per use.",
    },
    {
      name: "Catalyst Conversion",
      type: "Passive Talent",
      description:
        "When Sucrose triggers a Swirl reaction, all characters in the party with the matching element (excluding Sucrose) have their Elemental Mastery increased by 50 for 8s.",
    },
    {
      name: "Mollis Favonius",
      type: "Passive Talent",
      description:
        "When Astable Anemohypostasis Creation - 6308 or Forbidden Creation - Isomer 75 / Type II hits an opponent, increases all party members' (excluding Sucrose) Elemental Mastery based on 20% of Sucrose's Elemental Mastery for 8s.",
    },
    {
      name: "Astable Invention",
      type: "Utility Passive",
      description:
        "When Sucrose crafts Character and Weapon Enhancement Materials, she has a 10% chance to obtain double the product.",
    },
    {
      name: "Witch's Eve Rite: Sevenfold Transmutation",
      type: "Passive Talent",
      description:
        "After completing 'Witch's Homework: Of Wonderland Flowers', Sucrose gains the Hexerei classification. When the party possesses Hexerei: Secret Rite (>= 2 Hexerei characters in the party): After creating a Small Wind Spirit, nearby party members' Normal, Charged, Plunging Attack, Elemental Skill, and Elemental Burst DMG are increased by 5.71428% (40/7%) for 15s. After creating a Large Wind Spirit, nearby Hexerei party members' Normal, Charged, Plunging Attack, Elemental Skill, and Elemental Burst DMG are increased by 7.14285% (50/7%) for 20s.",
    },
  ],
  constellations: [
    {
      level: 1,
      name: "Clustered Vacuum Field",
      description: "Astable Anemohypostasis Creation - 6308 gains 1 additional charge.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "Beth: Unbound Form",
      description: "The duration of Forbidden Creation - Isomer 75 / Type II is increased by 2s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "Flawless Alchemistress",
      description: "Increases the Level of Astable Anemohypostasis Creation - 6308 by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 4,
      name: "Alchemania",
      description: "Every 7 Normal and Charged Attacks, Sucrose will reduce the CD of Astable Anemohypostasis Creation - 6308 by 1-7s.",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "Caution: Standard Flask",
      description: "Increases the Level of Forbidden Creation - Isomer 75 / Type II by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 6,
      name: "Chaotic Entropy",
      description:
        "If Forbidden Creation - Isomer 75 / Type II triggers an Elemental Absorption, all party members gain a 20% Elemental DMG Bonus for the corresponding absorbed element during its duration. Luna III Hexerei Addition: Nearby Hexerei characters in the party gain an additional 8.57142% (60/7%) Elemental DMG Bonus for the corresponding absorbed element during the skill's duration.",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description:
      "Premier 4-star Anemo support providing universal Elemental Mastery sharing (+50 EM via A1, +20% of Sucrose's EM via A4), +20% absorbed Elemental DMG Bonus (C6), and Luna III (6.2) Hexerei: Secret Rite damage boosts (+5.71428% party attack DMG, +7.14285% Hexerei attack DMG, and +8.57142% Hexerei absorbed elemental DMG).",
    buffExplanations: [
      {
        name: "A1: Catalyst Conversion",
        brief: "+50 EM on matching Swirl",
        full: "When Sucrose triggers a Swirl reaction, all characters in the party with the matching element have their Elemental Mastery increased by 50 for 8s.",
        category: "stat_share",
      },
      {
        name: "A4: Mollis Favonius",
        brief: "+20% of Sucrose's EM",
        full: "When Astable Anemohypostasis Creation - 6308 or Forbidden Creation - Isomer 75 / Type II hits an opponent, increases party members' EM by 20% of Sucrose's EM for 8s.",
        category: "stat_share",
      },
      {
        name: "C6: Chaotic Entropy",
        brief: "+20% / +28.57% Absorbed Elemental DMG",
        full: "If Forbidden Creation - Isomer 75 / Type II triggers an Elemental Absorption, all party members gain a 20% Elemental DMG Bonus for the corresponding absorbed element. Under Hexerei: Secret Rite, Hexerei teammates gain an additional +8.57142% (total +28.57142%).",
        category: "dmg_bonus",
      },
      {
        name: "Hexerei: Small Wind Spirit",
        brief: "+5.71428% All Attacks DMG (15s)",
        full: "After creating a Small Wind Spirit under Hexerei: Secret Rite, nearby party members gain +5.71428% (40/7%) Normal, Charged, Plunging, Skill, and Burst DMG for 15s.",
        category: "dmg_bonus",
      },
      {
        name: "Hexerei: Large Wind Spirit",
        brief: "+7.14285% Hexerei Attacks DMG (20s)",
        full: "After creating a Large Wind Spirit under Hexerei: Secret Rite, nearby Hexerei characters gain +7.14285% (50/7%) Normal, Charged, Plunging, Skill, and Burst DMG for 20s.",
        category: "dmg_bonus",
      },
    ],
    statFields: [
      { key: "em", label: "Elemental Mastery", defaultValue: "800" },
      { key: "er", label: "Energy Recharge%", defaultValue: "160" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "50" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "100" },
      { key: "baseAtk", label: "Base ATK", defaultValue: "600" },
    ],
    buffs: [
      {
        stat: "em",
        label: "Elemental Mastery (Sucrose A1 & A4)",
        compute: (ctx) => {
          let total = 0;
          if ((ctx.inputs["a1-swirl-buff"] ?? 1) > 0) {
            total += 50;
          }
          if ((ctx.inputs["a4-em-share"] ?? 1) > 0) {
            total += 0.20 * ctx.em;
          }
          return total;
        },
      },
      {
        stat: "pyroDmgBonus",
        label: "Pyro DMG (Sucrose C6 Chaotic Entropy)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-absorption-buff"] ?? 1) <= 0) return 0;
          const isPyro =
            (ctx.inputs["burst-absorb-pyro"] ?? 0) > 0 ||
            ctx.inputs["burst-absorption"] === 1 ||
            (ctx.inputs["burst-absorption"] as unknown) === "Pyro";
          if (!isPyro) return 0;
          const isHexerei = (ctx.inputs["hexerei-secret-rite"] ?? 1) > 0;
          const isTargetHexerei = (ctx.inputs["hexerei-target-is-hexerei"] ?? 1) > 0;
          const hexereiBonus = isHexerei && isTargetHexerei ? 60 / 7 : 0;
          return 20 + hexereiBonus;
        },
      },
      {
        stat: "hydroDmgBonus",
        label: "Hydro DMG (Sucrose C6 Chaotic Entropy)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-absorption-buff"] ?? 1) <= 0) return 0;
          const isHydro =
            (ctx.inputs["burst-absorb-hydro"] ?? 0) > 0 ||
            ctx.inputs["burst-absorption"] === 2 ||
            (ctx.inputs["burst-absorption"] as unknown) === "Hydro";
          if (!isHydro) return 0;
          const isHexerei = (ctx.inputs["hexerei-secret-rite"] ?? 1) > 0;
          const isTargetHexerei = (ctx.inputs["hexerei-target-is-hexerei"] ?? 1) > 0;
          const hexereiBonus = isHexerei && isTargetHexerei ? 60 / 7 : 0;
          return 20 + hexereiBonus;
        },
      },
      {
        stat: "electroDmgBonus",
        label: "Electro DMG (Sucrose C6 Chaotic Entropy)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-absorption-buff"] ?? 1) <= 0) return 0;
          const isElectro =
            (ctx.inputs["burst-absorb-electro"] ?? 0) > 0 ||
            ctx.inputs["burst-absorption"] === 3 ||
            (ctx.inputs["burst-absorption"] as unknown) === "Electro";
          if (!isElectro) return 0;
          const isHexerei = (ctx.inputs["hexerei-secret-rite"] ?? 1) > 0;
          const isTargetHexerei = (ctx.inputs["hexerei-target-is-hexerei"] ?? 1) > 0;
          const hexereiBonus = isHexerei && isTargetHexerei ? 60 / 7 : 0;
          return 20 + hexereiBonus;
        },
      },
      {
        stat: "cryoDmgBonus",
        label: "Cryo DMG (Sucrose C6 Chaotic Entropy)",
        compute: (ctx) => {
          if (ctx.constellationLevel < 6) return 0;
          if ((ctx.inputs["c6-absorption-buff"] ?? 1) <= 0) return 0;
          const isCryo =
            (ctx.inputs["burst-absorb-cryo"] ?? 0) > 0 ||
            ctx.inputs["burst-absorption"] === 4 ||
            (ctx.inputs["burst-absorption"] as unknown) === "Cryo";
          if (!isCryo) return 0;
          const isHexerei = (ctx.inputs["hexerei-secret-rite"] ?? 1) > 0;
          const isTargetHexerei = (ctx.inputs["hexerei-target-is-hexerei"] ?? 1) > 0;
          const hexereiBonus = isHexerei && isTargetHexerei ? 60 / 7 : 0;
          return 20 + hexereiBonus;
        },
      },
      {
        stat: "normalDmgBonus",
        label: "Normal Attack DMG (Sucrose Hexerei: Secret Rite)",
        compute: (ctx) => {
          if ((ctx.inputs["hexerei-secret-rite"] ?? 1) <= 0) return 0;
          let bonus = 0;
          if ((ctx.inputs["small-wind-spirit"] ?? 1) > 0) bonus += 40 / 7;
          if ((ctx.inputs["large-wind-spirit"] ?? 1) > 0 && (ctx.inputs["hexerei-target-is-hexerei"] ?? 1) > 0) {
            bonus += 50 / 7;
          }
          return bonus;
        },
      },
      {
        stat: "chargedDmgBonus",
        label: "Charged Attack DMG (Sucrose Hexerei: Secret Rite)",
        compute: (ctx) => {
          if ((ctx.inputs["hexerei-secret-rite"] ?? 1) <= 0) return 0;
          let bonus = 0;
          if ((ctx.inputs["small-wind-spirit"] ?? 1) > 0) bonus += 40 / 7;
          if ((ctx.inputs["large-wind-spirit"] ?? 1) > 0 && (ctx.inputs["hexerei-target-is-hexerei"] ?? 1) > 0) {
            bonus += 50 / 7;
          }
          return bonus;
        },
      },
      {
        stat: "plungeDmgBonus",
        label: "Plunging Attack DMG (Sucrose Hexerei: Secret Rite)",
        compute: (ctx) => {
          if ((ctx.inputs["hexerei-secret-rite"] ?? 1) <= 0) return 0;
          let bonus = 0;
          if ((ctx.inputs["small-wind-spirit"] ?? 1) > 0) bonus += 40 / 7;
          if ((ctx.inputs["large-wind-spirit"] ?? 1) > 0 && (ctx.inputs["hexerei-target-is-hexerei"] ?? 1) > 0) {
            bonus += 50 / 7;
          }
          return bonus;
        },
      },
      {
        stat: "skillDmgBonus",
        label: "Elemental Skill DMG (Sucrose Hexerei: Secret Rite)",
        compute: (ctx) => {
          if ((ctx.inputs["hexerei-secret-rite"] ?? 1) <= 0) return 0;
          let bonus = 0;
          if ((ctx.inputs["small-wind-spirit"] ?? 1) > 0) bonus += 40 / 7;
          if ((ctx.inputs["large-wind-spirit"] ?? 1) > 0 && (ctx.inputs["hexerei-target-is-hexerei"] ?? 1) > 0) {
            bonus += 50 / 7;
          }
          return bonus;
        },
      },
      {
        stat: "burstDmgBonus",
        label: "Elemental Burst DMG (Sucrose Hexerei: Secret Rite)",
        compute: (ctx) => {
          if ((ctx.inputs["hexerei-secret-rite"] ?? 1) <= 0) return 0;
          let bonus = 0;
          if ((ctx.inputs["small-wind-spirit"] ?? 1) > 0) bonus += 40 / 7;
          if ((ctx.inputs["large-wind-spirit"] ?? 1) > 0 && (ctx.inputs["hexerei-target-is-hexerei"] ?? 1) > 0) {
            bonus += 50 / 7;
          }
          return bonus;
        },
      },
    ],
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      const a4Share = (ctx.inputs["a4-em-share"] ?? 1) > 0 ? ctx.em * 0.20 : 0;
      const a1Share = (ctx.inputs["a1-swirl-buff"] ?? 1) > 0 ? 50 : 0;
      return [
        { label: "Total EM", value: fmt(ctx.em) },
        { label: "EM Share", value: `+${fmt(a1Share + a4Share)}` },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
