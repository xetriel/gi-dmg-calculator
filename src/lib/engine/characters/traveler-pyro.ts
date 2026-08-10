import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, hitKeysOf } from "../mechanics-utils";

export function resolveTravelerPyro(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0 } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // C1 Starfire's Flowing Light (+6% DMG, or +15% total if Nightsoul's Blessing active)
  if (cons >= 1 && on("c1-starfire")) {
    const bonus = on("c1-nightsoul-active") ? 15 : 6;
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + bonus;
    res.notes.push(`Starfire's Flowing Light (C1): +${bonus}% DMG Bonus.`);
  }

  // C4 Ravaging Flame (+20% Pyro DMG Bonus)
  if (cons >= 4 && on("c4-ravaging-flame")) {
    res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + 20;
    res.notes.push("Ravaging Flame (C4): +20% Pyro DMG Bonus.");
  }

  // C6 The Sacred Flame Imperishable (Pyro Infusion for NA/CA/Plunge & +40% CRIT DMG)
  if (cons >= 6 && on("c6-sacred-flame")) {
    const naKeys = hitKeysOf(config, "normal");
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Pyro" });
    }
    // All Pyro hits receive +40% CRIT DMG
    for (const group of config.talents) {
      for (const hit of group.hits) {
        if (hit.element === "Pyro" || naKeys.includes(hit.key)) {
          addMods(res.perHit, hit.key, { critDmgBonusPct: 40 });
        }
      }
    }
    res.notes.push("The Sacred Flame Imperishable (C6): NA/CA/Plunge converted to Pyro DMG + 40% CRIT DMG for Pyro attacks.");
  }

  return res;
}

