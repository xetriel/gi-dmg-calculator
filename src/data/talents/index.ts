import type { TalentType } from "@/data/registry/types";
import type { CharacterTalentSeed, HitKind } from "./types";
import { huTaoSeed } from "./hu-tao";
import { neuvilletteSeed } from "./neuvillette";
import { arlecchinoSeed } from "./arlecchino";
import { clorindeSeed } from "./clorinde";
import { sandroneSeed } from "./sandrone";
import { zibaiSeed } from "./zibai";
import { neferSeed } from "./nefer";

export const TALENT_SEED: CharacterTalentSeed[] = [huTaoSeed, neuvilletteSeed, arlecchinoSeed, clorindeSeed, sandroneSeed, zibaiSeed, neferSeed];

export interface TalentRow {
  characterId: string;
  talentType: TalentType;
  hitKey: string;
  level: number;
  value: number;
  kind: HitKind;
}

// Flatten the seed into one row per (character, talent, hit, level), skipping gaps.
export function flattenSeed(seeds: CharacterTalentSeed[] = TALENT_SEED): TalentRow[] {
  const rows: TalentRow[] = [];
  for (const s of seeds) {
    for (const h of s.hits) {
      h.values.forEach((v, i) => {
        if (v != null && Number.isFinite(v)) {
          rows.push({
            characterId: s.characterId,
            talentType: h.talentType,
            hitKey: h.hitKey,
            level: i + 1,
            value: v,
            kind: h.kind ?? "damage",
          });
        }
      });
    }
  }
  return rows;
}
