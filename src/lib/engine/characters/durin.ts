import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt } from "../mechanics-utils";

export function resolveDurin(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // A1 Passive: Light Manifest of the Divine Calculus
  const isHexereiActive = on("hexerei-party-members");

  if (on("purity-form") && on("purity-res-shred")) {
    const shredAmount = isHexereiActive ? 35 : 20;
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - shredAmount;
    res.notes.push(`A1 Light Manifest: -${shredAmount}% Enemy RES (Purity Form RES Shred${isHexereiActive ? " [Hexerei active]" : ""})`);
  }

  const atkEff = stats.atk + (res.statDeltas.atk ?? 0);

  const durinAllHits = [
    "1-hit", "2-hit", "3-hit", "4-hit", "charged", "plunge", "low-plunge", "high-plunge",
    "purity-skill-dmg", "darkness-skill-1", "darkness-skill-2", "darkness-skill-3",
    "purity-burst-1", "purity-burst-2", "purity-burst-3", "white-flame-dmg",
    "darkness-burst-1", "darkness-burst-2", "darkness-burst-3", "dark-decay-dmg"
  ];

  if (on("darkness-form")) {
    const reactionBonus = isHexereiActive ? 70 : 40;
    for (const key of durinAllHits) {
      addMods(res.perHit, key, { reactionBonusPct: reactionBonus });
    }
    res.notes.push(`A1 Light Manifest: +${reactionBonus}% Vaporize/Melt DMG Bonus (Darkness Form${isHexereiActive ? " [Hexerei active]" : ""})`);
  }

  // A4 Passive: Chaos Formed Like the Night
  if (on("a4-primordial-fusion")) {
    const factor = Math.min(0.03 * Math.floor(atkEff / 100), 0.75);
    const multiplier = 1 + factor;

    addMods(res.perHit, "white-flame-dmg", { baseDmgMultiplier: multiplier });
    addMods(res.perHit, "dark-decay-dmg", { baseDmgMultiplier: multiplier });
    res.notes.push(`A4 Chaos Formed Like the Night: +${(factor * 100).toFixed(0)}% DMG multiplier on periodic summon hits (based on ${fmt(atkEff)} ATK)`);
  }

  // C1: Adamah's Redemption
  if (on("c1-cycle-of-enlightenment")) {
    const flatBonus = 0.60 * atkEff;
    for (const key of durinAllHits) {
      addMods(res.perHit, key, { flatDmgBonus: flatBonus });
    }
    res.notes.push(`C1 Cycle of Enlightenment: +${fmt(flatBonus)} flat DMG (60% ATK)`);
  }

  // C2: Unground Visions
  if (cons >= 2 && on("c2-pyro-dmg-bonus")) {
    res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + 50;
    res.notes.push("C2 Unground Visions: +50% Pyro DMG Bonus");
  }

  // C4: Emanare's Source
  if (cons >= 4) {
    const burstHits = [
      "purity-burst-1", "purity-burst-2", "purity-burst-3", "white-flame-dmg",
      "darkness-burst-1", "darkness-burst-2", "darkness-burst-3", "dark-decay-dmg"
    ];
    for (const key of burstHits) {
      addMods(res.perHit, key, { bonusDmgPct: 40 });
    }
    res.notes.push("C4 Emanare's Source: +40% Burst DMG Bonus");
  }

  // C6: Dual Birth
  if (cons >= 6) {
    const burstHits = [
      "purity-burst-1", "purity-burst-2", "purity-burst-3", "white-flame-dmg",
      "darkness-burst-1", "darkness-burst-2", "darkness-burst-3", "dark-decay-dmg"
    ];
    for (const key of burstHits) {
      addMods(res.perHit, key, { defIgnorePct: 30 });
    }
    // Additional 40% DEF ignore for Dark Decay
    addMods(res.perHit, "dark-decay-dmg", { defIgnorePct: 40 });

    if (on("c6-def-shred")) {
      res.statDeltas.defReduction = (res.statDeltas.defReduction ?? 0) + 30;
    }
    res.notes.push("C6 Dual Birth: Burst DMG ignores 30% DEF (Dark Decay ignores 70% DEF). DEF Reduction -30% on hits.");
  }

  return res;
}
