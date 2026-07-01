export type ScalingSource = "atk" | "hp" | "def" | "em";
export type Element = "Pyro" | "Hydro" | "Electro" | "Cryo" | "Anemo" | "Geo" | "Dendro";
export type Weapon = "Sword" | "Claymore" | "Polearm" | "Catalyst" | "Bow";

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

export interface TalentGroup { name: string; hits: string[]; }

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
}
