import type { TalentType } from "@/data/registry/types";
import type { CharacterTalentSeed, HitKind } from "./types";
import { huTaoSeed } from "./hu-tao";
import { neuvilletteSeed } from "./neuvillette";
import { arlecchinoSeed } from "./arlecchino";
import { clorindeSeed } from "./clorinde";
import { sandroneSeed } from "./sandrone";
import { zibaiSeed } from "./zibai";
import { neferSeed } from "./nefer";
import { flinsSeed } from "./flins";
import { columbinaSeed } from "./columbina";
import { varkaSeed } from "./varka";
import { linneaSeed } from "./linnea";
import { ineffaSeed } from "./ineffa";
import { skirkSeed } from "./skirk";
import { varesaSeed } from "./varesa";
import { gamingSeed } from "./gaming";
import { durinSeed } from "./durin";
import { alhaithamSeed } from "./alhaitham";
import { ayakaSeed } from "./ayaka";
import { ayatoSeed } from "./ayato";
import { dehyaSeed } from "./dehya";
import { dilucSeed } from "./diluc";
import { cynoSeed } from "./cyno";
import { aloySeed } from "./aloy";
import { eulaSeed } from "./eula";
import { ganyuSeed } from "./ganyu";
import { heizouSeed } from "./heizou";
import { ittoSeed } from "./itto";
import { kavehSeed } from "./kaveh";
import { keqingSeed } from "./keqing";
import { kleeSeed } from "./klee";
import { mavuikaSeed } from "./mavuika";
import { mualaniSeed } from "./mualani";
import { lyneySeed } from "./lyney";
import { xiaoSeed } from "./xiao";
import { tartagliaSeed } from "./tartaglia";
import { xinyanSeed } from "./xinyan";

export const TALENT_SEED: CharacterTalentSeed[] = [huTaoSeed, neuvilletteSeed, arlecchinoSeed, clorindeSeed, sandroneSeed, zibaiSeed, neferSeed, flinsSeed, columbinaSeed, varkaSeed, linneaSeed, ineffaSeed, skirkSeed, varesaSeed, gamingSeed, durinSeed, alhaithamSeed, ayakaSeed, ayatoSeed, dehyaSeed, dilucSeed, cynoSeed, aloySeed, eulaSeed, ganyuSeed, heizouSeed, ittoSeed, kavehSeed, keqingSeed, kleeSeed, mavuikaSeed, mualaniSeed, lyneySeed, xiaoSeed, tartagliaSeed, xinyanSeed];

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
