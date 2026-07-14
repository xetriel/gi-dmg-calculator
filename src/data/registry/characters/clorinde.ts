import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

// Corrected from the Excel's leftover metadata (it carried Arlecchino's Pyro/Polearm/CRIT DMG).
export const clorinde: CharacterConfig = {
  id: "clorinde", name: "Clorinde", rarity: 5,
  element: "Electro", weapon: "Sword", scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate", maxValue: 19.2 },
  dmgBonusLabel: "DMG Bonus%",
  stats: coreStats("DMG Bonus%"),
  // Multi-strike hits show the per-hit value; Skill variants are keyed by Bond of Life state.
  talents: [
    { type: "normal", name: "Normal Attack — Oath of Hunting Shadows", hits: [
      atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit-x2", "3-Hit ×2 (each)"),
      atk("4-hit-x3", "4-Hit ×3 (each)"), atk("5-hit", "5-Hit"),
      atkCharged("charged", "Charged Attack (Stamina 20)"),
      atkPlunge("plunge", "Plunge"), atkPlunge("low-plunge", "Low Plunge"), atkPlunge("high-plunge", "High Plunge"),
    ] },
    { type: "skill", name: "Elemental Skill — Hunter's Vigil", hits: [
      atk("swift-hunt-1", "Swift Hunt"), atk("swift-hunt-2", "Swift Hunt (Bond ≥100%)"),
      atk("impale-1", "Impale the Night (Bond 0%)"), atk("impale-2", "Impale the Night (Bond <100%)"),
      atk("impale-3", "Impale the Night: Pact ×3 (each, Bond ≥100%)"), atk("surging-blade", "Surging Blade"),
    ] },
    { type: "burst", name: "Elemental Burst — Last Lightfall", hits: [atk("skill-dmg-x5", "Skill DMG ×5 (each)")] },
  ],
  mechanicDefs: [
    { id: "dark-flame-stacks", label: "Dark-Shattering Flame stacks", control: "stacks", max: 3,
      hint: "A1: +20% ATK flat DMG per stack on NA & Burst, cap 1,800 (C2: 30%, cap 2,700)" },
    { id: "a4-crit-stacks", label: "Lawful Remuneration stacks", control: "stacks", max: 2,
      hint: "A4: +10% CRIT Rate per stack while Bond of Life ≥ 100%" },
    { id: "bond-of-life", label: "Bond of Life (% Max HP)", control: "percent", max: 200, defaultValue: 100,
      hint: "Selects Skill hit variants; C4 boosts Last Lightfall by 2% per 1% BoL" },
  ],
  mechanics: ["Bond of Life thresholds (≥100% / <100% / 0%) select the Skill hit variants","Impale the Night heals 0% / 104% / 110% of Bond of Life; healing received converts 80% (A4: 100%) to Bond of Life"],
  wikiTalents: [
    {
      name: "Oath of Hunting Shadows",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 5 rapid strikes. Charged Attack: Consumes Stamina to fire a fan of pistolet shots. Plunging Attack: Plunges from mid-air, dealing AoE DMG on impact."
    },
    {
      name: "Hunter's Vigil",
      type: "Elemental Skill",
      description: "Enters the Night Vigil state (~7.5s): Normal Attacks become Swift Hunt pistolet shots dealing Electro DMG that cannot be overridden, and the Skill becomes Impale the Night, a lunging strike. Bond of Life drives both: at 0% BoL basic variants fire; below 100%, Swift Hunt grants Bond of Life (35% Max HP) and Impale consumes it to heal; at ≥100%, Swift Hunt pierces for higher DMG and Impale becomes Impale the Night: Pact (3 hits). Clorinde cannot be healed by others during Night Vigil — healing converts to Bond of Life."
    },
    {
      name: "Last Lightfall",
      type: "Elemental Burst",
      description: "Deals 5 instances of AoE Electro DMG and grants Clorinde a Bond of Life based on her Max HP (66%–138% by talent level), setting up an immediate empowered Impale the Night: Pact."
    },
    {
      name: "Dark-Shattering Flame",
      type: "Passive Talent",
      description: "After a nearby party member triggers an Electro-related reaction, Electro DMG dealt by Clorinde's Normal Attacks and Last Lightfall is increased by 20% of her ATK for 15s. Max 3 stacks, counted independently; total increase capped at 1,800."
    },
    {
      name: "Lawful Remuneration",
      type: "Passive Talent",
      description: "If Clorinde's Bond of Life is ≥100% of her Max HP, her CRIT Rate increases by 10% for 15s whenever her Bond of Life value changes. Max 2 stacks. Also raises Night Vigil's healing-to-Bond-of-Life conversion to 100%."
    },
    {
      name: "Night Vigil's Harvest",
      type: "Passive Talent",
      description: "Displays the location of nearby Fontaine local specialties on the mini-map."
    }
  ],
  // Numeric constellation effects (C2 Dark-Shattering upgrade, C4 BoL DMG bonus,
  // C6 CRIT bonuses) are applied by the mechanics resolver using the selected C-level.
  constellations: [
    {
      level: 1, name: "\"From This Day, I Pass the Candle's Shadow-Veil\"",
      description: "During Night Vigil, Electro DMG from Normal Attacks triggers 2 coordinated Nightvigil Shade attacks, each dealing 30% ATK as Electro DMG (once every 1.2s; counts as Normal Attack DMG).",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "\"Now, As We Face the Perils of the Long Night\"",
      description: "Dark-Shattering Flame upgraded: +30% of ATK per stack (max 3), total cap 2,700. Interruption resistance at 3 stacks.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "\"I Pledge to Remember the Oath of Daylight\"",
      description: "Increases the Level of Hunter's Vigil by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "\"To Enshrine Tears, Life, and Love\"",
      description: "Last Lightfall DMG increased by 2% per 1% of current Bond of Life (max +200%).",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "\"Holding Dawn's Coming as My Votive\"",
      description: "Increases the Level of Last Lightfall by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "\"And So Shall I Never Despair\"",
      description: "For 12s after Hunter's Vigil: +10% CRIT Rate, +70% CRIT DMG. Glimbright Shades strike for 200% ATK under specific conditions; DMG taken −80% during Night Vigil.",
      effects: [{ type: "informational" }]
    },
  ],
};
