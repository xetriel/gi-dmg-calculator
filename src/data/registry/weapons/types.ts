import type { CharacterConfig, Element, MechanicDef } from "../types";

export type WeaponType = "Sword" | "Claymore" | "Polearm" | "Bow" | "Catalyst";
export type WeaponRarity = 1 | 2 | 3 | 4 | 5;

export interface WeaponSubStat {
  type: string;        // e.g. "em" | "critRate" | "critDmg" | "atkPct" | "energyRecharge" | "hpPct" | "defPct" | "physicalDmgBonus"
  label: string;       // e.g. "Elemental Mastery", "CRIT Rate%"
  value: number;       // Lv90 value e.g. 265, 22.1, 44.1, etc.
  baseValue?: number;  // Lv1 value e.g. 58, 4.8, etc.
}

export interface WeaponBuffContext {
  refinement: number;                          // 1..5
  baseAtk: number;                             // active character's base ATK
  charElement?: Element;                       // active character's element
  charWeapon?: WeaponType;                     // active character's weapon type
  inputs?: Record<string, string | number>;    // weapon condition inputs (e.g. stacks, wielderHp)
  wielderElement?: Element;                    // for element comparison (e.g. A Thousand Floating Dreams)
}

export interface WeaponBuffDef {
  id: string;                                  // unique identifier for this buff
  label: string;                               // display label (e.g. "Party EM (A Thousand Floating Dreams)")
  description?: string;
  stat: string;                                // target stat on DPS (e.g. "em", "atk", "normalDmgBonus", "allDmgBonus", "pyroDmgBonus", etc.)
  refinementValues: [number, number, number, number, number]; // Values for R1, R2, R3, R4, R5
  isTeamBuff: boolean;                         // True if buff applies to party members / teammates
  isPercent?: boolean;                         // True if value represents a percentage (e.g. +20% ATK)
  conditionKey?: string;                       // MechanicDef id if conditional
  compute?: (refinement: number, ctx: WeaponBuffContext) => number;
}

export interface WeaponDamageDef {
  id: string;                                  // unique identifier e.g. "eye-of-perception-proc"
  name: string;                                // display name e.g. "Bolt of Perception"
  scaling: "atk" | "hp" | "def";               // scaling stat
  element?: Element | "Physical";              // DMG element (default: "Physical")
  refinementMultipliers: [number, number, number, number, number]; // e.g. [240, 270, 300, 330, 360]
  conditionKey?: string;                       // e.g. "cryo-affected"
  conditionLabel?: string;                     // e.g. "Opponent affected by Cryo"
  conditionMultipliers?: [number, number, number, number, number]; // e.g. [200, 240, 280, 320, 360]
  guaranteedCrit?: boolean;                    // e.g. Messenger (100% crit on weakspot)
  description?: string;
}

export interface WeaponConfig {
  id: string;                                  // slug identifier e.g. "crimson-moons-semblance", "a-thousand-floating-dreams"
  name: string;                                // "Crimson Moon's Semblance"
  type: WeaponType;
  rarity: WeaponRarity;
  baseAtk: number;                             // Lv90 Base ATK
  lvl1BaseAtk?: number;                        // Lv1 Base ATK
  subStat?: WeaponSubStat;
  passiveName: string;                         // "Ashen Sun's Shadow"
  passiveDesc: string;                         // full passive description
  isSupport: boolean;                          // Has party/team buff capabilities
  buffType: "team" | "self" | "both";
  buffs: WeaponBuffDef[];
  damageInstances?: WeaponDamageDef[];         // Independent proc damage instances (e.g. Bolt of Perception, Everfrost Icicle)
  mechanicDefs?: MechanicDef[];                // UI controls for conditional passives (stacks, toggles)
  signatureFor?: string[];                     // Character IDs this weapon is specifically made for (e.g. ["arlecchino"])
}

export interface ExternalWeaponInstance {
  id: string;                                  // instance ID, e.g. "w-1"
  weaponId: string;                            // links to WeaponConfig.id
  refinement: number;                          // 1..5
  enabled: boolean;
  inputs?: Record<string, string | number>;    // toggle/slider values for weapon mechanics
}

/**
 * Filter weapons for a specific character:
 * 1. Weapons matching the character's weapon type (e.g. all Polearms for Arlecchino).
 * 2. Any weapon with team/party supporting capabilities (`isSupport: true`) regardless of weapon type.
 */
export function getWeaponsForCharacter(
  charConfig: CharacterConfig,
  weapons: WeaponConfig[]
): WeaponConfig[] {
  return weapons.filter(w => {
    // Weapons matching character's weapon type (e.g. Arlecchino -> all Polearms)
    if (w.type === charConfig.weapon) return true;
    // Weapons with supporting/party buff capabilities
    if (w.isSupport) return true;
    return false;
  });
}
