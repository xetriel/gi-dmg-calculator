import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt } from "../mechanics-utils";

export function resolveVaresa(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  // A4 Passive: The Hero Twice-Returned!
  const a4Stacks = val("nightsoul-burst-stacks");
  if (a4Stacks > 0) {
    const a4Bonus = a4Stacks * 0.35 * ctx.baseAtk;
    res.statDeltas.atk = (res.statDeltas.atk ?? 0) + a4Bonus;
    res.notes.push(`A4 The Hero Twice-Returned: +${a4Stacks * 35}% ATK (+${fmt(a4Bonus)} ATK, ${a4Stacks} stacks)`);
  }

  const atkEff = stats.atk + (res.statDeltas.atk ?? 0);

  // A1 Passive: Tag-Team Triple Jump!
  if (on("rainbow-crash")) {
    const isFieryOrC1 = on("fiery-passion") || cons >= 1;
    const ratio = isFieryOrC1 ? 1.8 : 0.5;
    const flatBonus = ratio * atkEff;

    const plungeGroundHits = ["low-plunge", "high-plunge", "volcano-kablam-dmg"];
    for (const key of plungeGroundHits) {
      addMods(res.perHit, key, { flatDmgBonus: flatBonus });
    }
    res.notes.push(
      `A1 Tag-Team Triple Jump: +${fmt(flatBonus)} flat Plunge ground impact DMG (+${ratio * 100}% ATK${isFieryOrC1 ? " [Fiery Passion / C1]" : ""})`
    );
  }

  // C4: The Courage to Press On
  if (cons >= 4) {
    const isFieryOrApex = on("fiery-passion") || on("apex-drive");
    if (!isFieryOrApex && on("c4-diligent-refinement")) {
      const flatBonus = Math.min(5.0 * atkEff, 20000);
      const plungeGroundHits = ["low-plunge", "high-plunge", "volcano-kablam-dmg"];
      for (const key of plungeGroundHits) {
        addMods(res.perHit, key, { flatDmgBonus: flatBonus });
      }
      res.notes.push(
        `C4 The Courage to Press On: +${fmt(flatBonus)} flat Plunge ground impact DMG (Diligent Refinement${flatBonus >= 20000 ? " [capped]" : ""})`
      );
    } else if (isFieryOrApex) {
      // Elemental Burst deals 100% increased DMG
      const burstHits = ["kick-dmg", "fiery-kick-dmg"];
      for (const key of burstHits) {
        addMods(res.perHit, key, { baseDmgMultiplier: 2.0 });
      }
      res.notes.push("C4 The Courage to Press On: Burst DMG increased by 100% (Fiery Passion / Apex Drive active)");
    }
  }

  // C6: A Hero of Justice's Triumph
  if (cons >= 6) {
    const affectedHits = ["plunge", "low-plunge", "high-plunge", "volcano-kablam-dmg", "kick-dmg", "fiery-kick-dmg"];
    for (const key of affectedHits) {
      addMods(res.perHit, key, { critRateBonusPct: 10, critDmgBonusPct: 100 });
    }
    res.notes.push("C6 A Hero of Justice's Triumph: Plunging Attacks & Burst gain +10% CRIT Rate / +100% CRIT DMG");
  }

  return res;
}
