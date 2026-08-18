import type { Element, MechanicDef, Constellation } from "../types";

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

// Which stat inputs to show in the support mini-calculator
export interface SupportStatField {
  key: string;               // e.g., "atk.base", "critRate"
  label: string;             // e.g., "Base ATK"
  defaultValue: string;      // e.g., "700"
  hasBaseAndFlat?: boolean;  // if true, renders base/percent/flat triple
}

// Full support character configuration
export interface SupportConfig {
  id: string;                // e.g., "ineffa-support"
  characterId: string;       // links to CharacterConfig.id ("ineffa")
  name: string;              // "Ineffa"
  rarity: 4 | 5;
  element: Element;
  statFields: SupportStatField[];       // limited stat inputs to show
  mechanicDefs?: MechanicDef[];         // support-mode mechanic toggles
  constellations?: Constellation[];     // constellation definitions
  buffs: SupportBuff[];                 // the buffs this support provides
  lunarBaseBonusCompute?: (ctx: SupportCtx) => number;  // Moonsign Lunar Base DMG
}
