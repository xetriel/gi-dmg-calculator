import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";

export function resolveTartaglia(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // Master of Weaponry (Party Passive / Passive 1)
  if (on("master-of-weaponry")) {
    res.notes.push("Master of Weaponry: Increases Normal Attack Talent Level by +1 for Tartaglia and all party members.");
  }

  // Riptide Status Active
  if (on("riptide-active")) {
    res.notes.push("Riptide Active: Enemies hit by Melee/Charged attacks trigger Riptide Flash/Slash/Blast procs.");
  }

  return res;
}
