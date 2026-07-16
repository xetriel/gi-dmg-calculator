import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, hitKeysOf, fmt } from "../mechanics-utils";

export function resolveArlecchino(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  const bolPct = val("bond-of-life"); // % of Max HP, 0–200
  // Masque of the Red Death — verbatim wiki formula:
  //   base DMG = ATK × (Talent Multiplier + Masque Increase × BoL/MaxHP)
  // The bonus multiplies the BoL *percentage* (a ratio) by ATK; Max HP cancels
  // out and does NOT scale her damage. C1: Masque Increase +100 pp.
  if (bolPct > 0) {
    let masquePct = coeff(ctx, "normal", "masque-increase") ?? 0;
    if (cons >= 1) masquePct += 100;
    const additive = (masquePct / 100) * (bolPct / 100) * stats.atk;
    for (const key of hitKeysOf(config, "normal")) {
      addMods(res.perHit, key, { flatDmgBonus: additive });
    }
    res.notes.push(
      `Masque: +${fmt(additive)} flat DMG on Normal Attacks (${masquePct}% × ${bolPct}% BoL × ATK${cons >= 1 ? ", C1" : ""})`
    );
    // Burst heal (fixed formula): 150% Bond of Life + 150% ATK. The heal restores
    // HP, so here the HP-denominated BoL value (BoL% × Max HP) is the right term.
    const heal = 1.5 * ((bolPct / 100) * stats.hp) + 1.5 * stats.atk;
    res.notes.push(`Balemoon Rising heal: ${fmt(heal)} HP (150% BoL + 150% ATK)`);
  }
  // Utility passive "The Balemoon Alone May Know": +40% Pyro DMG Bonus in combat.
  if (on("pyro-bonus")) {
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + 40;
    res.notes.push("Balemoon passive: +40% Pyro DMG Bonus (in combat)");
  }
  // C6: Burst DMG += ATK × 700% × BoL%; NA & Burst +10% CRIT Rate / +70% CRIT DMG.
  if (cons >= 6) {
    addMods(res.perHit, "skill-dmg", { flatDmgBonus: 7.0 * (bolPct / 100) * stats.atk });
    for (const key of [...hitKeysOf(config, "normal"), "skill-dmg"]) {
      addMods(res.perHit, key, { critRateBonusPct: 10, critDmgBonusPct: 70 });
    }
    res.notes.push("C6: Burst +700% ATK × BoL%; NA & Burst +10% CRIT Rate / +70% CRIT DMG");
  }

  return res;
}
