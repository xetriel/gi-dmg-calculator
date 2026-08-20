export type ScalingSource = "atk" | "hp" | "def" | "em";
export type Element = "Pyro" | "Hydro" | "Electro" | "Cryo" | "Anemo" | "Geo" | "Dendro";
export type Weapon = "Sword" | "Claymore" | "Polearm" | "Catalyst" | "Bow";

// Hit-attached reactions supported by the engine: amplifying (vaporize/melt multiply
// the whole hit) and catalyze (aggravate adds a level/EM-scaled additive base DMG).
// "none" = no reaction. Transformative and Lunar reactions are standalone outputs.
export type ReactionType = "none" | "vaporize" | "melt" | "aggravate";

// The talent categories; each has one selectable level in the UI.
export type TalentType = "normal" | "skill" | "burst" | "special";

import type { LunarType } from "@/lib/engine/lunar";

export type StatKey =
  | "hp" | "atk" | "def" | "em" | "critRate" | "critDmg" | "energyRecharge"
  | "dmgBonus" | "healingBonus" | "dmgReduction" | "enemyRes"
  | "levelChar" | "levelEnemy" | "defReduction" | "defIgnore"
  | "normalDmgBonus" | "chargedDmgBonus" | "plungeDmgBonus"
  | "skillDmgBonus" | "burstDmgBonus"
  | "pyroDmgBonus" | "hydroDmgBonus" | "dendroDmgBonus" | "electroDmgBonus"
  | "anemoDmgBonus" | "cryoDmgBonus" | "geoDmgBonus" | "physicalDmgBonus"
  | "lunarChargedDmgBonus" | "lunarBloomDmgBonus" | "lunarCrystallizeDmgBonus"
  | "lunarChargedElevation" | "lunarBloomElevation" | "lunarCrystallizeElevation"
  | "lunarChargedFlatDmg" | "lunarBloomFlatDmg" | "lunarCrystallizeFlatDmg"
  | "stellarSwirlDmgBonus" | "stellarGlimmerDmgBonus";

export interface StatField {
  key: StatKey;
  label: string;                         // may be character-specific (e.g. "Pyro DMG Bonus%")
  unit: "flat" | "percent";
  group: "base" | "advanced" | "combat" | "defense" | "lunar";
  hasBaseAndFlat?: boolean;              // HP/ATK/DEF show Base + Flat + Total (like the Excel)
  derived?: boolean;                     // RES/Level/Defense multipliers are computed, not typed
}

// A single damage instance within a talent. `scaling` is the stat this hit's
// multiplier applies to — it is per-hit because a character's hits can scale off
// different stats (e.g. Neuvillette's basic NA scale on ATK, his HP hits on Max HP).
// `key` is a stable id used to join per-level multipliers in the TalentScaling table.
// `kind: "heal"` rows display a healing amount (mult% × stat × (1 + Healing Bonus)),
// no crit columns.
// `direct` marks a direct-reaction hit — "stellar" (Stellar-Conduct) or "lunar"
// (Lunar-Crystallize etc.). Both compute through the same direct-reaction formula
// branch (no enemy-DEF multiplier, no DMG Bonus%, EM bonus 6·EM/(EM+2000));
// the mechanics resolver supplies the per-hit coefficient/bonus params.
// Hit categories for talent-type-specific DMG Bonus routing.
// "normal"/"charged"/"plunge" are sub-types within the "normal" talent group;
// "skill"/"burst" map directly to their talent group type. "special" hits receive only All DMG Bonus.
export type HitCategory = "normal" | "charged" | "plunge" | "skill" | "burst" | "special";
export interface TalentHit { key: string; name: string; scaling: ScalingSource; kind?: "damage" | "heal" | "buff" | "shield"; direct?: "stellar" | "lunar"; lunarType?: LunarType; hitCategory?: HitCategory; minConstellation?: number; element?: Element | "Physical"; }
export interface TalentGroup { type: TalentType; name: string; hits: TalentHit[]; }

// Declarative per-character mechanic control rendered by the UI. The math lives in
// src/lib/engine/mechanics.ts (resolveMechanics), keyed by character id + mechanic id.
export interface MechanicDef {
  id: string;                                  // e.g. "bond-of-life", "paramita", "draconic-stacks"
  label: string;
  control: "toggle" | "percent" | "stacks";
  min?: number;                                // min stacks or range
  max?: number;                                // percent cap (e.g. 200) or max stacks (e.g. 3)
  defaultValue?: number;                       // toggle: 1 = on; percent/stacks initial value
  hint?: string;                               // short explanation shown next to the control
}

export interface WikiTalent {
  name: string;
  type: string;
  description: string;
}

export interface ConstellationEffect {
  /** Which stat or mechanic this constellation modifies */
  type:
    | "talent_level_bonus"   // C3/C5: +3 to skill or burst level
    | "flat_dmg_bonus"       // C2: adds flat DMG based on a stat
    | "stat_bonus"           // C6: adds to critRate, etc.
    | "informational";       // C1/C4: no engine effect, display only

  /** For talent_level_bonus: which talent type gets +3 */
  talentType?: TalentType;

  /** For flat_dmg_bonus: which hit keys receive the bonus */
  affectedHitKeys?: string[];

  /** For flat_dmg_bonus: the scaling source for the bonus (e.g. "hp") */
  bonusScaling?: ScalingSource;

  /** For flat_dmg_bonus: the percentage of the scaling stat (e.g. 10 for 10% Max HP) */
  bonusPercent?: number;

  /** For stat_bonus: which stat key and how much */
  statKey?: string;
  statValue?: number;

  /** Human-readable condition (displayed in UI) */
  condition?: string;
}

export interface Constellation {
  level: number;          // 1–6
  name: string;
  description: string;
  effects: ConstellationEffect[];
}

// ==========================================
// Support Character & Team Buff Types
// ==========================================

// Context passed to support buff compute functions
export interface SupportCtx {
  atk: number;               // support's total ATK
  baseAtk: number;           // support's base ATK
  hp: number;                // support's total HP
  baseHp: number;            // support's base HP
  def: number;               // support's total DEF
  baseDef: number;           // support's base DEF
  em: number;                // support's EM
  critRate: number;          // for team Lunar CRIT calc
  critDmg: number;           // for team Lunar CRIT calc
  constellationLevel: number;
  talentLevels: Record<string, number>;
  inputs: Record<string, number>;
}

// A single buff that a support character provides to the active DPS
export interface SupportBuff {
  stat: string;              // target stat key on DPS (e.g., "em", "lunarChargedDmgBonus")
  label: string;             // human-readable (e.g., "EM (Ineffa A4)")
  compute: (ctx: SupportCtx) => number;
}

// Structured explanation of a support character's buff source for catalog and details UI
export interface SupportBuffExplanation {
  name: string;             // e.g. "A4: Burst EM Share"
  brief: string;            // e.g. "+6% ATK as EM"
  full: string;             // e.g. "Panoramic Permutation Protocol: Increases active party member's EM by 6% of Ineffa's total ATK when Burst is active."
  category?: "stat_share" | "dmg_bonus" | "flat_dmg" | "lunar" | "elemental";
}

// Which stat inputs to show in the support mini-calculator
export interface SupportStatField {
  key: string;               // e.g., "atk.base", "critRate"
  label: string;             // e.g., "Base ATK"
  defaultValue: string;      // e.g., "700"
  hasBaseAndFlat?: boolean;  // if true, renders base/percent/flat triple
}

// Brief stat pill for the remastered support card UI
export interface BriefStatPill {
  label: string;   // e.g., "Total ATK"
  value: string;   // e.g., "2,180"
}

// Support configuration definition embedded on CharacterConfig
export interface CharacterSupportBuffDef {
  description?: string;                 // Overview of the support capabilities
  buffExplanations?: SupportBuffExplanation[]; // Detailed breakdown of buff sources
  statFields?: SupportStatField[];      // limited stat inputs to show (defaults to baseAtk/critRate/critDmg)
  buffs: SupportBuff[];                 // the buffs this support provides
  lunarBaseBonusCompute?: (ctx: SupportCtx) => number;  // Moonsign Lunar Base DMG
  formatBriefStats?: (ctx: SupportCtx) => BriefStatPill[];  // brief info pills for card UI
}

// Full support character configuration (used by team buff engine and UI)
export interface SupportConfig {
  id: string;                           // e.g., "ineffa-support" or "ineffa"
  characterId: string;                  // links to CharacterConfig.id ("ineffa")
  name: string;                         // "Ineffa"
  rarity: 4 | 5;
  element: Element;
  weapon?: Weapon;                      // "Polearm", "Sword", etc.
  description?: string;                 // Overview of the support character
  buffExplanations?: SupportBuffExplanation[]; // Detailed breakdown of buff sources
  statFields: SupportStatField[];       // limited stat inputs to show
  mechanicDefs?: MechanicDef[];         // support-mode mechanic toggles
  constellations?: Constellation[];     // constellation definitions
  buffs: SupportBuff[];                 // the buffs this support provides
  lunarBaseBonusCompute?: (ctx: SupportCtx) => number;  // Moonsign Lunar Base DMG
  formatBriefStats?: (ctx: SupportCtx) => BriefStatPill[];  // brief info pills for card UI
}

export interface CharacterConfig {
  id: string;
  name: string;
  rarity: 4 | 5;
  element: Element;
  weapon: Weapon;
  scalingSource: ScalingSource;
  ascensionStat: { label: string; maxValue: number };   // the Excel "Special Stat" column
  dmgBonusLabel: string;
  stats: StatField[];
  talents: TalentGroup[];
  mechanics?: string[];
  panels?: string[];
  notes?: string[];
  wikiTalents?: WikiTalent[];
  constellations?: Constellation[];
  mechanicDefs?: MechanicDef[];
  support?: CharacterSupportBuffDef;
}


