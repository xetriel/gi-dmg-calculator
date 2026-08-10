import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, hitKeysOf } from "../mechanics-utils";

export function resolveTravelerCryo(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0 } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // Frostglow Stacks (0–8 Stacks, +4.96% Burst DMG per stack)
  const stacks = inputs["frostglow-stacks"] ?? 8;
  if (stacks > 0) {
    const bonusPct = stacks * 4.96;
    addMods(res.perHit, "burst-javelin-dmg", { bonusDmgPct: bonusPct });
    addMods(res.perHit, "stellar-conduct-javelin-dmg", { bonusDmgPct: bonusPct });
    addMods(res.perHit, "stellar-swirl-javelin-dmg", { bonusDmgPct: bonusPct });
    res.notes.push(`Frostglow Stacks (${stacks}/8): +${bonusPct.toFixed(2)}% Burst DMG.`);
  }

  // C1 Frostbite Glare (-15% Cryo RES)
  if (cons >= 1 && on("c1-frost-shred")) {
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - 15;
    res.notes.push("Frostbite Glare (C1): Decreases target Cryo RES by 15% on Skill hit.");
  }

  // C6 Glacial Dominion (Cryo Infusion for NA/CA/Plunge & +40% CRIT DMG to Cryo attacks)
  if (cons >= 6 && on("c6-cryo-infusion")) {
    const naKeys = hitKeysOf(config, "normal");
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Cryo" });
    }
    // All Cryo hits receive +40% CRIT DMG
    for (const group of config.talents) {
      for (const hit of group.hits) {
        if (hit.element === "Cryo" || naKeys.includes(hit.key)) {
          addMods(res.perHit, hit.key, { critDmgBonusPct: 40 });
        }
      }
    }
    res.notes.push("Glacial Dominion (C6): NA/CA/Plunge converted to Cryo DMG + 40% CRIT DMG for Cryo attacks.");
  }

  return res;
}
