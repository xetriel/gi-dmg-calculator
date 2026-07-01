export type ScalingSource = "atk" | "hp" | "def" | "em";
export type Element = "Pyro" | "Hydro" | "Electro" | "Cryo" | "Anemo" | "Geo" | "Dendro";
export type Weapon = "Sword" | "Claymore" | "Polearm" | "Catalyst" | "Bow";

// Amplifying reactions supported by the engine (v1). "none" = no reaction.
export type ReactionType = "none" | "vaporize" | "melt";

// The three talent categories; each has one selectable level in the UI.
export type TalentType = "normal" | "skill" | "burst";

export type StatKey =
  | "hp" | "atk" | "def" | "em" | "critRate" | "critDmg" | "energyRecharge"
  | "dmgBonus" | "healingBonus" | "dmgReduction" | "enemyRes"
  | "levelChar" | "levelEnemy" | "defReduction" | "defIgnore";

export interface StatField {
  key: StatKey;
  label: string;                         // may be character-specific (e.g. "Pyro DMG Bonus%")
  unit: "flat" | "percent";
  group: "base" | "advanced" | "combat" | "defense";
  hasBaseAndFlat?: boolean;              // HP/ATK/DEF show Base + Flat + Total (like the Excel)
  derived?: boolean;                     // RES/Level/Defense multipliers are computed, not typed
}

// A single damage instance within a talent. `scaling` is the stat this hit's
// multiplier applies to — it is per-hit because a character's hits can scale off
// different stats (e.g. Neuvillette's basic NA scale on ATK, his HP hits on Max HP).
// `key` is a stable id used to join per-level multipliers in the TalentScaling table.
export interface TalentHit { key: string; name: string; scaling: ScalingSource; }
export interface TalentGroup { type: TalentType; name: string; hits: TalentHit[]; }

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
}

