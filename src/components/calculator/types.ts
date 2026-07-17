import type { ReactionType } from "@/data/registry/types";
import type { HitResult, DamageStats } from "@/lib/engine/damage";
import type { TransformativeType } from "@/lib/engine/transformative";
import type { LunarType, LunarResult } from "@/lib/engine/lunar";
import type { validate } from "@/lib/engine/validation";

export interface SavedBuild {
  id: string;
  name: string;
  characterId?: string;
  data: unknown;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isOffline?: boolean;
}

export interface CalcInstance {
  id: string;
  stats: Record<string, string>;
  hits: Record<string, string>;
  levels: Record<string, string>;
  mechanicInputs: Record<string, string>;
  reaction: ReactionType;
  reactionBonus: string;
  reactionPanelBonus: string;
  lunarBaseBonus: string;
  constellationLevel: number;
}

export interface RotationStep {
  id: string;
  targetHitId: string;
  reactionOverride: ReactionType | "default";
  hitType?: "avg" | "crit" | "non-crit";
  quantity?: number;
}

export interface SavedRotation {
  id: string;
  name: string;
  description: string;
  steps: RotationStep[];
}

export interface ReactionExtras {
  transformative: { type: TransformativeType; dmg: number }[];
  lunar: { type: LunarType; res: LunarResult }[];
  notes: string[];
}

export interface ComputedInstance {
  validation: ReturnType<typeof validate>;
  results: Record<string, HitResult> | null;
  extras: ReactionExtras | null;
  inputStats: DamageStats | null;
  effectiveStats: DamageStats | null;
  rotationTotals: Record<string, number>;
  rotationStepsDmg: Record<string, number[]>;
  rotationStepsDetails: Record<string, HitResult[]>;
}
