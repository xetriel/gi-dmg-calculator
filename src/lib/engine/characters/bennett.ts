import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, hitKeysOf } from "../mechanics-utils";

export function resolveBennett(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // Fantastic Voyage ATK Buff (self)
  if (on("fantastic-voyage-active")) {
    const burstLv = ctx.talentLevels?.burst ?? (cons >= 5 ? 13 : 10);
    const ratio = burstLv >= 13 ? 119.0 : 100.8;
    const c1Bonus = cons >= 1 ? 20.0 : 0;
    const totalRatio = (ratio + c1Bonus) / 100;
    const baseAtkEff = ctx.baseAtk ?? 800;
    const atkBonus = totalRatio * baseAtkEff;

    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + atkBonus;
    res.notes.push(
      `Fantastic Voyage: +${Math.round(atkBonus)} Flat ATK (${(totalRatio * 100).toFixed(1)}% Base ATK${cons >= 1 ? " with C1" : ""})`
    );
  }

  // C6 Fire Ventures with Me: +15% Pyro DMG Bonus & Pyro Infusion for Sword
  if (cons >= 6 && on("c6-pyro-bonus")) {
    res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + 15;
    const naKeys = hitKeysOf(config, "normal");
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Pyro" });
    }
    res.notes.push("C6 Fire Ventures with Me: +15% Pyro DMG Bonus and Pyro Infusion on Normal/Charged/Plunge");
  }

  return res;
}
