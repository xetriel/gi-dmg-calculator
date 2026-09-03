import type { DamageStats } from "./damage";
import type { CharacterConfig } from "../../data/registry/types";
import {
  artifactById,
  type ExternalArtifactInstance,
  type ArtifactBuffContext,
  type ArtifactPieceCount,
  type ArtifactSlot,
} from "../../data/registry/artifacts";

export type { ExternalArtifactInstance } from "../../data/registry/artifacts";

export interface ExternalArtifactBuffSource {
  artifactId: string;
  artifactName: string;
  pieceCount: ArtifactPieceCount;
  slot: ArtifactSlot;
  buffId: string;
  stat: string;
  label: string;
  value: number;
  rarity?: number;
}

export interface ExternalArtifactBuffResult {
  statDeltas: Partial<DamageStats>;
  sources: ExternalArtifactBuffSource[];
}

/**
 * Resolves all active external artifact buffs for the current character calculation instance.
 *
 * @param artifacts - array of ExternalArtifactInstance attached to the active setup (max 4)
 * @param baseAtk - active character's base ATK
 * @param charConfig - active character's CharacterConfig (for element and routing)
 * @param masterEnabled - master toggle state for external artifact buffs (defaults to true)
 */
export function resolveExternalArtifactBuffs(
  artifacts: ExternalArtifactInstance[] | undefined,
  baseAtk: number = 0,
  charConfig?: CharacterConfig,
  masterEnabled: boolean = true,
): ExternalArtifactBuffResult {
  const result: ExternalArtifactBuffResult = {
    statDeltas: {},
    sources: [],
  };

  if (!masterEnabled || !artifacts || artifacts.length === 0) {
    return result;
  }

  // Set to track applied non-stacking team buff IDs across party members
  const appliedTeamBuffs = new Set<string>();

  // Enforce max 4 artifacts (including user)
  const validArtifacts = artifacts.slice(0, 4);

  for (const inst of validArtifacts) {
    if (!inst.enabled) continue;

    const config = artifactById(inst.artifactId);
    if (!config) continue;

    const pieceCount: ArtifactPieceCount = inst.pieceCount === 2 ? 2 : 4;
    const slot: ArtifactSlot = inst.slot || "wielder";

    const ctx: ArtifactBuffContext = {
      pieceCount,
      slot,
      baseAtk,
      charElement: charConfig?.element,
      charWeapon: charConfig?.weapon,
      inputs: inst.inputs ?? {},
    };

    for (const buff of config.buffs) {
      // 1. Piece requirement check (e.g. 4-piece buff requires 4-piece set)
      if (pieceCount < buff.pieceRequirement) {
        continue;
      }

      // 2. Role routing: Support-slot artifacts only provide team buffs (isTeamBuff: true).
      // Wielder-slot artifacts provide both self buffs and team buffs to active character.
      if (slot === "support" && !buff.isTeamBuff) {
        continue;
      }

      // 3. Non-stacking rule for identical team buffs from same artifact set
      if (buff.isTeamBuff) {
        const teamBuffKey = `${config.id}-${buff.stat}`;
        if (appliedTeamBuffs.has(teamBuffKey)) {
          continue; // Non-stacking: skip duplicate team buff
        }
        appliedTeamBuffs.add(teamBuffKey);
      }

      // 4. Compute value
      let val = 0;
      if (buff.compute) {
        val = buff.compute(ctx);
      } else {
        const rawVal = buff.value ?? 0;
        if (buff.isPercent && buff.stat === "atk") {
          val = (rawVal / 100) * baseAtk;
        } else {
          val = rawVal;
        }
      }

      if (val === 0 || !Number.isFinite(val)) continue;

      result.sources.push({
        artifactId: config.id,
        artifactName: config.name,
        pieceCount,
        slot,
        buffId: buff.id,
        stat: buff.stat,
        label: `${buff.label} (${pieceCount}-Pc, ${slot === "wielder" ? "Wielder" : "Support"})`,
        value: val,
        rarity: config.rarity,
      });

      const key = buff.stat as keyof DamageStats;
      (result.statDeltas as Record<string, number>)[key] =
        ((result.statDeltas as Record<string, number>)[key] ?? 0) + val;
    }
  }

  return result;
}
