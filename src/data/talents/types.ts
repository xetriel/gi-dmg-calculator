import type { TalentType } from "@/data/registry/types";

// Seed shape for the TalentScaling table. One SeedHit expands to one DB row per level.
export type HitKind = "damage" | "buff" | "heal" | "shield";

export interface SeedHit {
  hitKey: string;         // joins registry TalentHit.key (for damage hits)
  talentType: TalentType;
  kind?: HitKind;         // default "damage"; buff/heal are stored but not yet wired to the calculator
  values: number[];       // values[i] => talent level (i + 1); gaps (undefined) fall back to manual entry
}

export interface CharacterTalentSeed {
  characterId: string;
  hits: SeedHit[];
}
