import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveBaizhu(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { constellationLevel: cons, stats, inputs } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // 1. A1 Five Fortunes Forever
  // Inputs: a1-hp-threshold (1: >= 50% HP, 0: < 50% HP)
  const a1State = Number(inputs["a1-hp-threshold"] ?? 1);
  if (a1State === 1) {
    res.statDeltas.dendroDmgBonus = (res.statDeltas.dendroDmgBonus ?? 0) + 25;
    res.notes.push("A1 Five Fortunes Forever: +25% Dendro DMG Bonus (Active Character HP ≥ 50%)");
  } else {
    res.statDeltas.healingBonus = (res.statDeltas.healingBonus ?? 0) + 20;
    res.notes.push("A1 Five Fortunes Forever: +20% Healing Bonus (Active Character HP < 50%)");
  }

  // 2. A4 All Things Are of the Earth (Year of Verdant Favor)
  if (on("a4-verdant-favor")) {
    const totalHp = stats.hp ?? 0;
    const effHp = Math.min(totalHp, 50000);
    const hpThousands = effHp / 1000;

    const bloomPct = hpThousands * 2.0;
    const lunarBloomPct = hpThousands * 0.7;
    const spreadPct = hpThousands * 0.8;

    res.statDeltas.burningDmgBonus = (res.statDeltas.burningDmgBonus ?? 0) + bloomPct;
    res.statDeltas.bloomDmgBonus = (res.statDeltas.bloomDmgBonus ?? 0) + bloomPct;
    res.statDeltas.hyperbloomDmgBonus = (res.statDeltas.hyperbloomDmgBonus ?? 0) + bloomPct;
    res.statDeltas.burgeonDmgBonus = (res.statDeltas.burgeonDmgBonus ?? 0) + bloomPct;
    res.statDeltas.lunarBloomDmgBonus = (res.statDeltas.lunarBloomDmgBonus ?? 0) + lunarBloomPct;
    res.statDeltas.aggravateDmgBonus = (res.statDeltas.aggravateDmgBonus ?? 0) + spreadPct;
    res.statDeltas.spreadDmgBonus = (res.statDeltas.spreadDmgBonus ?? 0) + spreadPct;

    res.notes.push(
      `A4 Year of Verdant Favor: +${bloomPct.toFixed(1)}% Bloom/Burning, +${lunarBloomPct.toFixed(1)}% Lunar-Bloom, +${spreadPct.toFixed(1)}% Spread/Aggravate (${effHp.toLocaleString()} HP capped at 50,000)`
    );
  }

  // 3. C1 Attentive Observation
  if (cons >= 1) {
    res.notes.push("C1 Attentive Observation: Universal Diagnosis gains 1 additional charge");
  }

  // 4. C2 Incisive Discernment (Gossamer Sprite: Splice)
  if (cons >= 2) {
    addMods(res.perHit, "c2-splice-dmg", { baseDmgMultiplier: 1.0 });
    res.notes.push("C2 Incisive Discernment: Gossamer Sprite: Splice unlocked (250% ATK Dendro Skill DMG, 5s CD)");
  } else {
    addMods(res.perHit, "c2-splice-dmg", { baseDmgMultiplier: 0 });
  }

  // 5. C4 Ancient Art of Perception (+80 EM after Burst)
  if (cons >= 4 && on("c4-art-of-perception")) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + 80;
    res.notes.push("C4 Ancient Art of Perception: +80 Elemental Mastery (Burst Cast)");
  }

  // 6. C6 Elimination of Malicious Qi (+8% Max HP Flat DMG to Spiritveins)
  if (cons >= 6) {
    const totalHp = stats.hp ?? 0;
    const flatBonus = 0.08 * totalHp;
    addMods(res.perHit, "burst-spiritvein", { flatDmgBonus: flatBonus });
    res.notes.push(
      `C6 Elimination of Malicious Qi: +${Math.round(flatBonus)} Flat DMG (+8% Max HP) to Spiritveins`
    );
  }

  return res;
}
