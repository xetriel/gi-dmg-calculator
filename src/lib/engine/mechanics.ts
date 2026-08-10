// Fully-computed character mechanics (pure, framework-free).
// The registry's MechanicDefs describe the UI controls; this module owns the math,
// keyed by character id.
import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "./mechanics-utils";

// Re-export types so that other modules (e.g. CharacterCalculator.tsx) continue to work as-is
export type { PerHitMods, MechanicsResult, MechanicsCtx } from "./mechanics-utils";

// Import all character resolvers
import { resolveHuTao } from "./characters/hu-tao";
import { resolveSkirk } from "./characters/skirk";
import { resolveArlecchino } from "./characters/arlecchino";
import { resolveNeuvillette } from "./characters/neuvillette";
import { resolveSandrone } from "./characters/sandrone";
import { resolveLinnea } from "./characters/linnea";
import { resolveZibai } from "./characters/zibai";
import { resolveClorinde } from "./characters/clorinde";
import { resolveNefer } from "./characters/nefer";
import { resolveFlins } from "./characters/flins";
import { resolveColumbina } from "./characters/columbina";
import { resolveVarka } from "./characters/varka";
import { resolveIneffa } from "./characters/ineffa";
import { resolveVaresa } from "./characters/varesa";
import { resolveGaming } from "./characters/gaming";
import { resolveDurin } from "./characters/durin";
import { resolveAlhaitham } from "./characters/alhaitham";
import { resolveAyaka } from "./characters/ayaka";
import { resolveAyato } from "./characters/ayato";
import { resolveDehya } from "./characters/dehya";
import { resolveDiluc } from "./characters/diluc";
import { resolveCyno } from "./characters/cyno";
import { resolveAloy } from "./characters/aloy";
import { resolveEula } from "./characters/eula";
import { resolveGanyu } from "./characters/ganyu";
import { resolveHeizou } from "./characters/heizou";
import { resolveItto } from "./characters/itto";
import { resolveKaveh } from "./characters/kaveh";
import { resolveKeqing } from "./characters/keqing";
import { resolveKlee } from "./characters/klee";
import { resolveMavuika } from "./characters/mavuika";
import { resolveMualani } from "./characters/mualani";
import { resolveLyney } from "./characters/lyney";
import { resolveXiao } from "./characters/xiao";
import { resolveTartaglia } from "./characters/tartaglia";
import { resolveXinyan } from "./characters/xinyan";
import { resolveYanfei } from "./characters/yanfei";
import { resolveTravelerAnemo } from "./characters/traveler-anemo";
import { resolveTravelerGeo } from "./characters/traveler-geo";
import { resolveTravelerElectro } from "./characters/traveler-electro";
import { resolveTravelerDendro } from "./characters/traveler-dendro";
import { resolveTravelerHydro } from "./characters/traveler-hydro";
import { resolveTravelerPyro } from "./characters/traveler-pyro";

type CharacterResolver = (config: CharacterConfig, ctx: MechanicsCtx) => MechanicsResult;

const CHARACTER_RESOLVERS: Record<string, CharacterResolver> = {
  "hu-tao": resolveHuTao,
  "skirk": resolveSkirk,
  "arlecchino": resolveArlecchino,
  "neuvillette": resolveNeuvillette,
  "sandrone": resolveSandrone,
  "linnea": resolveLinnea,
  "zibai": resolveZibai,
  "clorinde": resolveClorinde,
  "nefer": resolveNefer,
  "flins": resolveFlins,
  "columbina": resolveColumbina,
  "varka": resolveVarka,
  "ineffa": resolveIneffa,
  "varesa": resolveVaresa,
  "gaming": resolveGaming,
  "durin": resolveDurin,
  "alhaitham": resolveAlhaitham,
  "ayaka": resolveAyaka,
  "ayato": resolveAyato,
  "dehya": resolveDehya,
  "diluc": resolveDiluc,
  "cyno": resolveCyno,
  "aloy": resolveAloy,
  "eula": resolveEula,
  "ganyu": resolveGanyu,
  "heizou": resolveHeizou,
  "itto": resolveItto,
  "kaveh": resolveKaveh,
  "keqing": resolveKeqing,
  "klee": resolveKlee,
  "mavuika": resolveMavuika,
  "mualani": resolveMualani,
  "lyney": resolveLyney,
  "xiao": resolveXiao,
  "tartaglia": resolveTartaglia,
  "xinyan": resolveXinyan,
  "yanfei": resolveYanfei,
  "traveler-anemo": resolveTravelerAnemo,
  "traveler-geo": resolveTravelerGeo,
  "traveler-electro": resolveTravelerElectro,
  "traveler-dendro": resolveTravelerDendro,
  "traveler-hydro": resolveTravelerHydro,
  "traveler-pyro": resolveTravelerPyro,
};

export function resolveMechanics(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const resolver = CHARACTER_RESOLVERS[config.id];
  if (resolver) {
    return resolver(config, ctx);
  }
  return { statDeltas: {}, perHit: {}, notes: [] };
}
