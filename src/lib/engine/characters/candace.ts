import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt, hitKeysOf, hitKeysOfCategory } from "../mechanics-utils";

export function resolveCandace(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // C2 Moon-Piercing Brilliance (+20% Max HP when Sacred Rite: Heron's Sanctum hits opponents)
  if (cons >= 2 && on("c2-max-hp-buff")) {
    const baseHpEff = ctx.baseHp ?? 10875;
    const hpBonus = 0.20 * baseHpEff;
    res.statDeltas.hp = (res.statDeltas.hp ?? 0) + hpBonus;
    res.notes.push(`C2 Moon-Piercing Brilliance: +${fmt(hpBonus)} Max HP (+20% Base HP for 15s)`);
  }

  // Prayer of the Crimson Crown (Burst active)
  if (on("prayer-of-crimson-crown")) {
    // Hydro Infusion for Sword, Claymore, Polearm
    const naKeys = hitKeysOf(config, "normal");
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Hydro" });
    }
    res.notes.push("Prayer of the Crimson Crown: Normal, Charged, and Plunging Attacks obtain Hydro Infusion");

    // Normal Attack DMG Bonus: +20% base + A4 Celestial Dome of Sand (+0.5% per 1,000 Max HP)
    const baseHpEff = ctx.baseHp ?? 10875;
    const c2Bonus = (cons >= 2 && on("c2-max-hp-buff")) ? 0.20 * baseHpEff : 0;
    const totalHp = (stats?.hp ?? (baseHpEff * 1.24)) + c2Bonus;
    const a4DmgBonus = (totalHp / 1000) * 0.5;
    const totalNaDmgBonus = 20 + a4DmgBonus;

    const naHitKeys = hitKeysOfCategory(config, "normal", "normal");
    for (const key of naHitKeys) {
      addMods(res.perHit, key, { bonusDmgPct: totalNaDmgBonus });
    }
    res.notes.push(
      `Prayer of the Crimson Crown & A4: +${fmt(totalNaDmgBonus)}% Normal Attack DMG Bonus (+20% base + ${fmt(a4DmgBonus)}% from ${fmt(totalHp)} Max HP)`
    );
  }

  // Constellation 6: The Overflow (15% Max HP AoE Hydro Burst DMG wave)
  if (cons < 6) {
    addMods(res.perHit, "c6-the-overflow", { baseDmgMultiplier: 0 });
  } else {
    res.notes.push("C6 The Overflow: Unleashes an attack wave dealing 15% Max HP as AoE Hydro Burst DMG when characters deal Elemental Normal Attack DMG");
  }

  return res;
}
