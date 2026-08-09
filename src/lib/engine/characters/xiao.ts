import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, fmt } from "../mechanics-utils";

const NA_CA_PLUNGE_HITS = [
  "1-hit-1", "1-hit-2", "2-hit", "3-hit",
  "4-hit-1", "4-hit-2", "5-hit", "6-hit",
  "charged", "plunge", "low-plunge", "high-plunge"
];

export function resolveXiao(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // Bane of All Evil (Burst Active)
  if (on("burst-active")) {
    const burstBonusCoeff = coeff(ctx, "burst", "burst-dmg-bonus") ?? 95.2;
    for (const hKey of NA_CA_PLUNGE_HITS) {
      addMods(res.perHit, hKey, {
        element: "Anemo",
        bonusDmgPct: burstBonusCoeff,
      });
    }
    res.notes.push(`Bane of All Evil (Burst Active): Anemo Infusion & +${burstBonusCoeff}% Normal/Charged/Plunging DMG Bonus`);
  }

  // A1 Tamer of Demons (0–5 Stacks: +5% to +25% DMG Bonus)
  const a1Stacks = Math.max(0, Math.min(val("a1-dmg-stacks"), 5));
  if (a1Stacks > 0) {
    const a1Bonus = a1Stacks * 5;
    res.statDeltas.anemoDmgBonus = (res.statDeltas.anemoDmgBonus ?? 0) + a1Bonus;
    res.notes.push(`A1 Tamer of Demons (${a1Stacks} stack${a1Stacks === 1 ? "" : "s"}): +${a1Bonus}% DMG Bonus`);
  }

  // A4 Dissolution Eon: Heaven Fall (0–3 Stacks: +15% to +45% Skill DMG Bonus)
  const a4Stacks = Math.max(0, Math.min(val("a4-skill-stacks"), 3));
  if (a4Stacks > 0) {
    const a4Bonus = a4Stacks * 15;
    addMods(res.perHit, "skill-dmg", { bonusDmgPct: a4Bonus });
    res.notes.push(`A4 Dissolution Eon (${a4Stacks} stack${a4Stacks === 1 ? "" : "s"}): +${a4Bonus}% Skill DMG Bonus`);
  }

  // C2 Annihilation Eon: Blossom of Kaleidos (+25% Energy Recharge Off-Field)
  if (cons >= 2 && on("c2-off-field-er")) {
    res.statDeltas.energyRecharge = (res.statDeltas.energyRecharge ?? 0) + 25;
    res.notes.push("C2 Blossom of Kaleidos: +25% Energy Recharge (Off-Field)");
  }

  // C4 Transcendent Eon: Cataclysm (+100% Base DEF when HP < 50%)
  if (cons >= 4 && on("c4-low-hp-def")) {
    const c4Def = 1.00 * ctx.baseDef;
    res.statDeltas.def = (res.statDeltas.def ?? 0) + c4Def;
    res.notes.push(`C4 Transcendent Eon: +${fmt(c4Def)} DEF (+100% Base DEF)`);
  }

  return res;
}
