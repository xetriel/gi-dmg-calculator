import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge, lunarAtk } from "./hit-helpers";

export const flins: CharacterConfig = {
  id: "flins", name: "Flins", rarity: 5,
  element: "Electro", weapon: "Polearm", scalingSource: "atk",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Electro DMG Bonus%",
  stats: coreStats("Electro DMG Bonus%"),
  talents: [
    {
      type: "normal", name: "Normal Attack — Pocztowy Demonspear", hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        atk("4-hit", "4-Hit ×2 (each)"),
        atk("5-hit", "5-Hit"),
        atkCharged("charged", "Charged Attack"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill", name: "Elemental Skill — Ancient Rite: Arcane Light", hits: [
        { key: "spearstorm", name: "Northland Spearstorm DMG", scaling: "atk", hitCategory: "skill" },
        lunarAtk("c2-extra", "C2 Extra Lunar-Charged DMG (% ATK)"),
      ]
    },
    {
      type: "burst", name: "Elemental Burst — Ancient Ritual: Cometh the Night", hits: [
        { key: "burst-initial", name: "Initial Skill DMG", scaling: "atk", hitCategory: "burst" },
        lunarAtk("burst-middle", "Middle Phase Lunar-Charged DMG (each)"),
        lunarAtk("burst-final", "Final Phase Lunar-Charged DMG"),
        lunarAtk("symphony-dmg", "Thunderous Symphony DMG"),
        lunarAtk("symphony-add", "Thunderous Symphony Additional DMG"),
      ]
    },
  ],
  mechanics: [
    "Lunar-tagged rows are Lunar-Charged reaction DMG (coefficient 3.0): they ignore DMG Bonus% and enemy DEF, use EM bonus 6·EM/(EM+2000), and can CRIT",
    "Old World Secrets (Moonsign Benediction): Electro-Charged becomes Lunar-Charged; +0.7% Lunar-Charged Base DMG per 100 ATK (max 14% at 2000 ATK) — applied automatically to his Lunar hits and the Indirect Lunar panel",
    "Whispering Flame: increases EM by 8% of ATK (max 160; C4: 10% of ATK, max 220)",
  ],
  mechanicDefs: [
    {
      id: "manifest-flame", label: "Manifest Flame form", control: "toggle", defaultValue: 1,
      hint: "Normal and Charged attacks deal Electro DMG using Manifest Flame scaling; cannot plunge"
    },
    {
      id: "ascendant-gleam", label: "Moonsign: Ascendant Gleam", control: "toggle", defaultValue: 1,
      hint: "A1: +20% reaction bonus to his Lunar-Charged reactions. C6: elevates his Lunar-Charged DMG by 10% (additional to 35% base C6 elevation)."
    },
    {
      id: "c2-res-shred", label: "C2: opponent Electro RES decrease", control: "toggle", defaultValue: 1,
      hint: "Opponents' Electro RES decreased by 25% (requires Ascendant Gleam)"
    }
  ],
  wikiTalents: [
    {
      name: "Pocztowy Demonspear",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 5 consecutive spear strikes. Charged Attack: Consumes a certain amount of Stamina to perform a forward spear throw. Plunging Attack: Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact."
    },
    {
      name: "Ancient Rite: Arcane Light",
      type: "Elemental Skill",
      description: "Flins summons forth the ancient power concealed within his lamp and switches to his Manifest Flame form. This form has the following characteristics: Flins's Normal and Charged Attacks deal Electro DMG that cannot be overridden by other infusions, and he is unable to perform Plunging Attacks. Interruption resistance increased. Elemental Skill is replaced with Northland Spearstorm: summons a flurry of spears, dealing AoE Electro DMG and causing Burst to be replaced with Thunderous Symphony for the next 6s."
    },
    {
      name: "Ancient Ritual: Cometh the Night",
      type: "Elemental Burst",
      description: "Flins unleashes the true power of his lamp, dealing AoE Electro DMG and, after a short delay, dealing 2 instances of middle-phase and 1 instance of final-phase AoE Electro DMG, all of which are considered Lunar-Charged DMG. Moonsign: Ascendant Gleam: deals an additional 2 instances of middle-phase Lunar-Charged AoE Electro DMG."
    },
    {
      name: "Symphony of Winter",
      type: "1st Ascension Passive",
      description: "Flins will gain a corresponding buff effect based on the party's Moonsign. Moonsign: Ascendant Gleam: Lunar-Charged reactions triggered by Flins will deal an additional 20% DMG."
    },
    {
      name: "Whispering Flame",
      type: "4th Ascension Passive",
      description: "Flins's Elemental Mastery is increased by 8% of his ATK. The maximum increase obtainable this way is 160."
    },
    {
      name: "Old World Secrets",
      type: "Moonsign Benediction Passive",
      description: "When a party member triggers an Electro-Charged reaction, it will be converted into the Lunar-Charged reaction, with every 100 ATK that Flins has increasing Lunar-Charged's Base DMG by 0.7%, up to a maximum of 14%. Additionally, when Flins is in the party, the party's Moonsign will increase by 1 level."
    },
    {
      name: "A Light in the Dark",
      type: "Utility Passive",
      description: "Displays the location of nearby resources unique to Nod-Krai on the mini-map. Additionally, having Flins on-field will allow the player to understand the speech of Wilderness Exiles and Wilderness Hunters."
    }
  ],
  constellations: [
    {
      level: 1, name: "Part the Veil of Snow",
      description: "The basic cooldown of the special Elemental Skill Northland Spearstorm is reduced to 4s. Additionally, when party members trigger Lunar-Charged reactions, Flins will recover 8 Elemental Energy. This effect can occur once every 5.5s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "The Devil's Wall",
      description: "For the next 6s after using the special Elemental Skill Northland Spearstorm, when Flins's next Normal Attack hits an opponent, it will deal an additional 50% of Flins's ATK as AoE Electro DMG. This DMG is considered Lunar-Charged DMG. Moonsign: Ascendant Gleam: While Flins is on the field, after his Electro attacks hit an opponent, that opponent's Electro RES will be decreased by 25% for 7s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "Stranger in the Night",
      description: "Increases the Level of Ancient Ritual: Cometh the Night by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 4, name: "Night on Bald Mountain",
      description: "Flins's ATK is increased by 20%. Additionally, his Ascension Talent 'Whispering Flame' is enhanced: Flins's Elemental Mastery is increased by 10% of his ATK. The maximum increase obtainable this way is 220.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Exile's Shadow",
      description: "Increases the Level of Ancient Rite: Arcane Light by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 6, name: "Songs and Dances of Death",
      description: "The DMG dealt to opponents by Flins's Lunar-Charged reactions is elevated by 35%. Moonsign: Ascendant Gleam: All nearby party members' Lunar-Charged DMG is elevated by 10%.",
      effects: [{ type: "informational" }]
    }
  ],
  support: {
    description: "Moonsign Electro sub-DPS and Lunar-Charged amplifier. Converts Electro-Charged into Lunar-Charged reactions, boosts Lunar-Charged Base DMG scaling with ATK, reduces enemy Electro RES by 25% at C2, and elevates party Lunar-Charged DMG by 10% at C6.",
    buffExplanations: [
      {
        name: "Moonsign Benediction",
        brief: "+0.7% Lunar-Charged Base DMG per 100 ATK (max 14%)",
        full: "Converts Electro-Charged into Lunar-Charged reactions. Every 100 ATK increases party Lunar-Charged Base DMG by 0.7%, capped at 14.0%.",
        category: "lunar",
      },
      {
        name: "C2: Electro RES Shred",
        brief: "-25% Electro RES",
        full: "While Flins is on the field, after his Electro attacks hit an opponent, decreases that opponent's Electro RES by 25% for 7s.",
        category: "elemental",
      },
      {
        name: "C6: Songs and Dances of Death",
        brief: "+10% Lunar-Charged DMG elevation to party",
        full: "All nearby party members' Lunar-Charged DMG is elevated by 10%.",
        category: "lunar",
      },
    ],
    statFields: [
      { key: "atk", label: "Total ATK", defaultValue: "2200" },
      { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
      { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
    ],
    buffs: [
      {
        stat: "enemyRes",
        label: "Electro RES Shred (Flins C2)",
        compute: (ctx) => (ctx.constellationLevel >= 2 ? -25 : 0),
      },
      {
        stat: "lunarChargedElevation",
        label: "Lunar-Charged Elevation (Flins C6)",
        compute: (ctx) => (ctx.constellationLevel >= 6 ? 10 : 0),
      },
    ],
    lunarBaseBonusCompute: (ctx) => Math.min(0.7 * (ctx.atk / 100), 14),
    formatBriefStats: (ctx) => {
      const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
      return [
        { label: "Total ATK", value: fmt(ctx.atk) },
        { label: "CRIT", value: `${fmt(ctx.critRate)}% / ${fmt(ctx.critDmg)}%` },
      ];
    },
  },
};
