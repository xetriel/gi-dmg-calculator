import type { CharacterConfig, Element, MechanicDef } from "../types";

export type ArtifactRarity = 1 | 2 | 3 | 4 | 5;
export type ArtifactPieceCount = 1 | 2 | 4;
export type ArtifactSlot = "wielder" | "support";

export interface ArtifactBuffContext {
  pieceCount: ArtifactPieceCount;              // 1, 2 or 4
  slot: ArtifactSlot;                          // "wielder" (active DPS) or "support" (party member)
  baseAtk: number;                             // active character's base ATK
  charElement?: Element;                       // active character's element
  charWeapon?: string;                         // active character's weapon type e.g. "Sword", "Claymore", "Polearm", "Bow", "Catalyst"
  energyRecharge?: number;                     // active character's ER% (e.g. 150 for Emblem)
  inputs?: Record<string, string | number>;    // artifact condition inputs (e.g. toggles/stacks)
}

export interface ArtifactBuffDef {
  id: string;                                  // unique identifier for this buff e.g. "scarlet-proof-2pc-atk"
  label: string;                               // display label (e.g. "2-Piece ATK% (Scarlet Proof)")
  description?: string;                        // optional tooltip description
  stat: string;                                // target stat key (e.g. "atk", "critRate", "stellarSwirlDmgBonus", "stellarGlimmerDmgBonus")
  pieceRequirement: ArtifactPieceCount;        // 1, 2 or 4 pieces required
  isTeamBuff: boolean;                         // true if buff applies to all party members / teammates
  isPercent?: boolean;                         // true if percentage based (e.g. +18% ATK)
  conditionKey?: string;                       // MechanicDef.id if conditional
  value?: number;                              // default value (e.g. 18 for +18% ATK, 16 for +16% CRIT Rate)
  compute?: (ctx: ArtifactBuffContext) => number;
}

export interface ArtifactConfig {
  id: string;                                  // slug identifier e.g. "scarlet-proof", "heart-of-the-furnace"
  name: string;                                // display name
  rarity: ArtifactRarity;                      // 4 or 5
  twoPieceDesc: string;                        // 2-Piece bonus description
  fourPieceDesc: string;                       // 4-Piece bonus description
  isSupport: boolean;                          // Has party/team buff capabilities
  buffType: "team" | "self" | "both";          // "team" (party support), "self" (wielder only), "both"
  buffs: ArtifactBuffDef[];
  mechanicDefs?: MechanicDef[];                // UI controls for conditional passives (toggles, stacks)
}

export interface ExternalArtifactInstance {
  id: string;                                  // unique instance ID, e.g. "art-1"
  artifactId: string;                          // links to ArtifactConfig.id
  pieceCount: ArtifactPieceCount;              // 2 or 4 (default: 4)
  slot: ArtifactSlot;                          // "wielder" or "support"
  enabled: boolean;                            // per-artifact toggle
  inputs?: Record<string, string | number>;    // toggle/stack values for mechanics
}

/**
 * Filter artifacts by scope:
 * - "all": all available artifacts
 * - "support": artifacts with team/party supporting capabilities (isSupport: true)
 * - "wielder": artifacts applicable to the equipping character (self or both)
 */
export function filterArtifacts(
  artifacts: ArtifactConfig[],
  scope: "all" | "support" | "wielder" = "all"
): ArtifactConfig[] {
  if (scope === "support") {
    return artifacts.filter((a) => a.isSupport);
  }
  if (scope === "wielder") {
    return artifacts.filter((a) => a.buffType === "self" || a.buffType === "both");
  }
  return artifacts;
}
