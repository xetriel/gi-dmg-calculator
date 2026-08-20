import type { ReactionType } from "@/data/registry/types";
import type { HitResult, DamageStats } from "@/lib/engine/damage";
import type { TransformativeType } from "@/lib/engine/transformative";
import type { LunarType, LunarResult } from "@/lib/engine/lunar";
import type { validate } from "@/lib/engine/validation";
import type { SupportInstance } from "@/lib/engine/team-buffs";
import type { ExternalWeaponInstance } from "@/lib/engine/weapon-buffs";
import type { ExternalArtifactInstance, ExternalArtifactBuffSource } from "@/lib/engine/artifact-buffs";

export type { SupportInstance } from "@/lib/engine/team-buffs";
export type { ExternalWeaponInstance } from "@/lib/engine/weapon-buffs";
export type { ExternalArtifactInstance, ExternalArtifactBuffSource } from "@/lib/engine/artifact-buffs";

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
  teamSupports?: SupportInstance[];    // max 3 support characters
  teamBuffsEnabled?: boolean;          // master toggle, defaults to true
  externalWeapons?: ExternalWeaponInstance[]; // external weapon team buffs
  externalWeaponBuffsEnabled?: boolean;       // master toggle for external weapons, defaults to true
  externalArtifacts?: ExternalArtifactInstance[]; // external artifact team buffs (max 4)
  externalArtifactBuffsEnabled?: boolean;         // master toggle for external artifacts, defaults to true
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

export interface StatBuffSource {
  source: string;       // e.g. "Paramita Papilio State (Skill)", "Sanguine Bleed (A4)"
  value: number;        // e.g. 400 or 33.0
  description?: string; // detailed explanation
}

export interface StatBreakdown {
  key: string;
  label: string;
  unit: "flat" | "percent" | "multiplier";
  raw: number;
  additions: StatBuffSource[];
  total: number;
  hideIfZero?: boolean;
}

export interface ComputedInstance {
  validation: ReturnType<typeof validate>;
  results: Record<string, HitResult> | null;
  extras: ReactionExtras | null;
  inputStats: DamageStats | null;
  effectiveStats: DamageStats | null;
  statBreakdowns?: StatBreakdown[];
  rotationTotals: Record<string, number>;
  rotationStepsDmg: Record<string, number[]>;
  rotationStepsDetails: Record<string, HitResult[]>;
}
