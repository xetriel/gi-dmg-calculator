import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const vesna: CharacterConfig = {
  id: "vesna",
  name: "Vesna",
  rarity: 5,
  element: "Anemo",
  weapon: "Sword",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "Anemo DMG Bonus%",
  stats: coreStats("Anemo DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Vila Blade Dance",
      hits: [
        { key: "1-hit", name: "1-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "2-hit", name: "2-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit-a", name: "3-Hit DMG (Hit 1)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "3-hit-b", name: "3-Hit DMG (Hit 2)", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "4-hit", name: "4-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "5-hit", name: "5-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        { key: "6-hit", name: "6-Hit DMG", scaling: "atk", hitCategory: "normal", element: "Physical" },
        atkCharged("charged", "Charged Attack DMG"),
        atkPlunge("plunge", "Plunge DMG"),
        atkPlunge("low-plunge", "Low Plunge DMG"),
        atkPlunge("high-plunge", "High Plunge DMG"),
      ],
    },
    {
      type: "skill",
      name: "Elemental Skill — The Art of Victory",
      hits: [
        atk("initial-dmg", "Initial Skill DMG"),
        atk("wind-pinion", "Wind Pinion DMG"),
        atk("windborne-1", "Windborne Sword Lv. 1 DMG"),
        atk("windborne-2", "Windborne Sword Lv. 2 DMG"),
        atk("spirit-blade-2", "Spirit Blade Lv. 2 DMG"),
        { key: "spirit-blade-2-stellar", name: "Spirit Blade Lv. 2 (Radiance: Stellar Swirl)", scaling: "atk", hitCategory: "skill", direct: "stellar", stellarType: "stellar-swirl", element: "Anemo" },
        atk("windborne-3-blades", "Spirit Blades Lv. 3 DMG (×4 each)"),
        { key: "windborne-3-blades-stellar", name: "Spirit Blades Lv. 3 (Radiance: Stellar Swirl) (×4 each)", scaling: "atk", hitCategory: "skill", direct: "stellar", stellarType: "stellar-swirl", element: "Anemo" },
        atk("windborne-3-final", "Windborne Sword Lv. 3 Final Hit DMG"),
        { key: "c6-transpose", name: "C6 Transpose Strike DMG", scaling: "atk", hitCategory: "special", element: "Anemo" },
        { key: "c6-transpose-blade", name: "C6 Transpose Spirit Blade", scaling: "atk", hitCategory: "special", element: "Anemo" },
        { key: "c6-transpose-blade-stellar", name: "C6 Transpose Spirit Blade (Radiance: Stellar Swirl)", scaling: "atk", hitCategory: "special", direct: "stellar", stellarType: "stellar-swirl", element: "Anemo" },
      ],
    },
    {
      type: "burst",
      name: "Elemental Burst — For the Tsaritsa!",
      hits: [
        atk("burst-spirit-blade", "Spirit Blade DMG"),
        { key: "burst-spirit-blade-stellar", name: "Spirit Blade DMG (Radiance: Stellar Swirl)", scaling: "atk", hitCategory: "burst", direct: "stellar", stellarType: "stellar-swirl", element: "Anemo" },
      ],
    },
  ],
  mechanicDefs: [
    {
      id: "armed-for-action",
      label: "Armed for Action mode (Skill)",
      control: "toggle",
      defaultValue: 1,
      hint: "Infuses Normal/Charged/Plunging attacks with Anemo; enables Wind Pinion coordinated attacks and unlocks Windborne Sword.",
    },
    {
      id: "radiance-stellar-swirl",
      label: "Radiance: Stellar Swirl active (A4 / Swirl trigger)",
      control: "toggle",
      defaultValue: 1,
      hint: "Party triggers Stellar Swirl: enters Radiance: Stellar Swirl (8s). Spirit Blades deal direct Stellar Swirl reaction DMG; activates Truth Prevails party element buffs.",
    },
    {
      id: "disciplinary-action-stacks",
      label: "Disciplinary Action stacks (A1 / C2)",
      control: "stacks",
      max: 6,
      defaultValue: 6,
      hint: "A1: Using Windborne Sword or Burst grants 1 stack (max 6). Spirit Blades deal +10% DMG per stack (Base DMG Multiplier). C2: grants max 6 stacks immediately in Armed for Action mode and +60% ATK.",
    },
    {
      id: "party-anemo-cryo-count",
      label: "Other party members: Anemo/Cryo count (A4 / C4)",
      control: "stacks",
      max: 3,
      defaultValue: 2,
      hint: "A4 Truth Prevails: +6% ATK per other Anemo/Cryo member in party (+18% each at C4).",
    },
    {
      id: "party-other-element-count",
      label: "Other party members: Other elements count (A4 / C4)",
      control: "stacks",
      max: 3,
      defaultValue: 1,
      hint: "A4 Truth Prevails: +25 EM per member of other elements (+75 EM each at C4). Total party members capped at 3.",
    },
  ],
  mechanics: [
    "Radiance: Stellar Swirl rows are direct reaction DMG (coefficient 1.0): they ignore standard DMG Bonus% and enemy DEF, use EM bonus 6·EM/(EM+2000), and can CRIT",
    "Stellar Jubilee: Splendid Prelude: Cryo Swirl becomes Stellar Swirl; Base Stellar Swirl reaction DMG +0.7% per 100 ATK (max 14% at 2000 ATK)",
    "Rite of Spring's Procession (A1): Using Windborne Sword or Burst grants Disciplinary Action stacks (+10% Base DMG Multiplier to Spirit Blades per stack, max 6)",
    "Truth Prevails (A4): In Radiance: Stellar Swirl, +6% ATK per other Anemo/Cryo party member and +25 EM per member of other elements (tripled at C4)",
  ],
  wikiTalents: [
    {
      name: "Vila Blade Dance",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 6 consecutive strikes with her sword. Charged Attack: Consumes Stamina to trample opponents in front of her. Plunging Attack: Plunges from mid-air to strike the ground below, dealing AoE DMG upon impact. When Armed for Action is active, attacks are converted into Anemo DMG.",
    },
    {
      name: "The Art of Victory",
      type: "Elemental Skill",
      description: "Upon activation, calls forth Spirit Blades to deal AoE Anemo DMG and switches to Armed for Action mode, gaining 2 stacks of Sword Essence. While in this mode, her Normal, Charged, and Plunging Attack DMG is converted into Anemo DMG, and she summons a wind pinion for coordinated attacks. Consumes Sword Essence to unleash Windborne Sword (Lv. 1 to Lv. 3). Lv. 2 and Lv. 3 summon Spirit Blades dealing Anemo or Stellar Swirl DMG.",
    },
    {
      name: "For the Tsaritsa!",
      type: "Elemental Burst",
      description: "Summons a flurry of Spirit Blades that deal AoE Anemo DMG to surrounding opponents (or Stellar Swirl reaction DMG when in Radiance: Stellar Swirl). Restores 1 stack of Sword Essence and grants 1 stack of Disciplinary Action.",
    },
    {
      name: "Rite of Spring's Procession",
      type: "Passive Talent",
      description: "After Vesna uses Windborne Sword or her Elemental Burst 'For the Tsaritsa!', she gains one stack of Disciplinary Action (lasting 20s, max 6 stacks). When active, Spirit Blades summoned by Vesna deal damage equal to 100% of their original damage + (10% × Disciplinary Action stack count). Stacks are cleared when she casts The Art of Victory or leaves the field.",
    },
    {
      name: "Truth Prevails",
      type: "Passive Talent",
      description: "When Vesna is in the Radiance: Stellar Swirl state, for every Anemo or Cryo character in the party (other than Vesna), her ATK increases by 6%. For every character of any other Elemental Type, her Elemental Mastery increases by 25.",
    },
    {
      name: "Stellar Jubilee: Splendid Prelude",
      type: "Passive Talent",
      description: "When party members trigger a Cryo Swirl reaction, it is converted into a Stellar Swirl reaction. Increases the Base DMG of Stellar Swirl reactions by 0.7% for every 100 ATK Vesna has (capped at 14%). After a nearby party member triggers Stellar Swirl, Vesna enters Radiance: Stellar Swirl for 8s.",
    },
    {
      name: "The Grand Circuit",
      type: "Utility Passive",
      description: "While out of combat, holding Sprint allows Vesna to take flight and hover continuously by consuming Stamina.",
    },
  ],
  constellations: [
    {
      level: 1,
      name: "Winter's Farewell Feast",
      description: "When in Armed for Action mode, Vesna can unleash Windborne Sword at the highest level 4 times instead of 3. The first time she uses Windborne Sword at the highest level, it does not consume Sword Essence. Additionally, she gains 20% increased Stellar Swirl reaction DMG while in Armed for Action mode.",
      effects: [{ type: "informational" }],
    },
    {
      level: 2,
      name: "Kolo of Spring's Arrival",
      description: "Vesna gains the maximum number of Disciplinary Action stacks immediately upon entering Armed for Action mode. Additionally, her ATK is increased by 60% when she has maximum Disciplinary Action stacks.",
      effects: [{ type: "informational" }],
    },
    {
      level: 3,
      name: "Winter's Last Offering",
      description: "Increases the Level of The Art of Victory by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }],
    },
    {
      level: 4,
      name: "Glory to Our Forebears",
      description: "Enhances the Ascension Talent 'Truth Prevails': its ATK and Elemental Mastery bonuses are increased to three times their original values (18% ATK per Anemo/Cryo ally, 75 EM per other element ally).",
      effects: [{ type: "informational" }],
    },
    {
      level: 5,
      name: "The Nobleborn's Charge",
      description: "Increases the Level of For the Tsaritsa! by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }],
    },
    {
      level: 6,
      name: "Unwavering Ardor",
      description: "Tapping Normal Attack or Elemental Skill in the 5 seconds after Vesna uses Windborne Sword at its highest level unleashes the secret Vila ability 'Windborne Sword: Transpose', dealing Anemo DMG at 150% of her ATK and summoning a Spirit Blade dealing an additional 200% ATK as Anemo DMG (or direct Stellar Swirl DMG). If in Armed for Action mode, also summons a wind pinion for coordinated attacks. Additionally, her Stellar Swirl reaction DMG is increased by 20%.",
      effects: [{ type: "informational" }],
    },
  ],
  support: {
    description: "Anemo on-field Main DPS and Stellar Swirl specialist. Converts teammate Cryo Swirl into Stellar Swirl and grants party Base Stellar Swirl DMG scaling with her ATK.",
    buffExplanations: [
      {
        name: "Stellar Jubilee: Splendid Prelude",
        brief: "+0.7% Stellar Swirl Base DMG per 100 ATK (max 14%)",
        full: "Converts Cryo Swirl into Stellar Swirl. Increases party Base Stellar Swirl reaction DMG by 0.7% for every 100 ATK, capped at 14.0%.",
        category: "lunar",
      },
    ],
    statFields: [
      { key: "atk", label: "Total ATK", defaultValue: "2500" },
    ],
    stellarBaseBonusCompute: (ctx) => {
      const atk = Number(ctx.atk ?? (ctx as any).stats?.atk ?? 2500);
      return Math.min(0.7 * (atk / 100), 14.0);
    },
    formatBriefStats: (ctx) => [
      { label: "Total ATK", value: Math.round(Number(ctx.atk ?? (ctx as any).stats?.atk ?? 2500)).toLocaleString("en-US") },
    ],
    buffs: [
      {
        stat: "stellarSwirlBaseDmgMultiplier",
        label: "Stellar Swirl Base DMG% (Vesna Splendid Prelude)",
        compute: (ctx) => {
          const atk = Number(ctx.atk ?? (ctx as any).stats?.atk ?? 2500);
          return Math.min(0.7 * (atk / 100), 14.0);
        },
      },
    ],
  },
};
