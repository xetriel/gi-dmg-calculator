import type { Element, Weapon, MechanicDef, Constellation } from "../types";

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

// A single buff that a support character provides to the DPS
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

// Full support character configuration
export interface SupportConfig {
  id: string;                // e.g., "ineffa-support"
  characterId: string;       // links to CharacterConfig.id ("ineffa")
  name: string;              // "Ineffa"
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
