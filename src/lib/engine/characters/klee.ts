import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt } from "../mechanics-utils";

export function resolveKlee(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // Hexerei: Secret Rite (+15% Pyro DMG Bonus)
  if (on("hexerei-secret-rite")) {
    res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + 15;
    res.notes.push("Hexerei: Secret Rite: +15% Pyro DMG Bonus, 50% Explosive Spark retention & 40% NA proc chance");
  }

  // Hexerei Boom Badges (0–3 stacks: 115% / 130% / 150% CA multiplier)
  const badges = Math.max(0, Math.min(val("hexerei-boom-badges"), 3));
  if (badges > 0) {
    const mults = [1.15, 1.30, 1.50];
    const mult = mults[badges - 1];
    addMods(res.perHit, "charged", { baseDmgMultiplier: mult });
    res.notes.push(`Hexerei Boom Badges (${badges} stack${badges === 1 ? "" : "s"}): Charged Attack DMG x${mult.toFixed(2)}`);
  }

  // A1 Pounding Surprise: Explosive Spark (+50% Charged Attack DMG)
  if (on("a1-explosive-spark")) {
    addMods(res.perHit, "charged", { bonusDmgPct: 50 });
    res.notes.push("Pounding Surprise: Explosive Spark +50% Charged Attack DMG Bonus & 0 Stamina");
  }

  // C1 Chained Reaction ATK Buff (+60% Base ATK for 12s)
  if (cons >= 1 && on("c1-atk-buff")) {
    const baseAtk = ctx.baseAtk ?? 311;
    const c1AtkBonus = 0.60 * baseAtk;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + c1AtkBonus;
    res.notes.push(`C1 Chained Reaction: +60% Base ATK (+${fmt(c1AtkBonus)} ATK) for 12s after spark trigger`);
  }

  // C2 Explosive Frags (-23% Enemy DEF for 10s)
  if (cons >= 2 && on("c2-def-shred")) {
    res.statDeltas.defReduction = (res.statDeltas.defReduction ?? 0) + 23;
    res.notes.push("C2 Explosive Frags: -23% Enemy DEF for 10s");
  }

  // C4 Sparkly Explosion On-Field Boost (+100% DMG)
  if (cons >= 4 && on("c4-on-field")) {
    addMods(res.perHit, "c4-sparkly-explosion", { bonusDmgPct: 100 });
    res.notes.push("C4 Sparkly Explosion: +100% DMG Bonus when Klee is on-field during explosion");
  }

  // C6 Blazing Delight (+10% Pyro DMG Bonus for 25s)
  if (cons >= 6 && on("c6-pyro-buff")) {
    res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + 10;
    res.notes.push("C6 Blazing Delight: +10% Pyro DMG Bonus for 25s");
  }

  // Constellation exclusive hits: 0 multiplier if below required level
  if (cons < 1) {
    addMods(res.perHit, "c1-chained-reaction", { baseDmgMultiplier: 0 });
  }
  if (cons < 4) {
    addMods(res.perHit, "c4-sparkly-explosion", { baseDmgMultiplier: 0 });
  }

  return res;
}
